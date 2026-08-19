(async () => {
    const BATCH_SIZE = 50;
    const MAX_BATCHES = 10;

    const CLICK_DELAY = 1000;
    const SCROLL_DELAY = 1100;
    const SCROLL_AMOUNT = 0.45;

    const AFTER_UNLIKE_MAX_WAIT = 45000;
    const SELECT_OPEN_MAX_WAIT = 10000;

    window.STOP_IG = false;

    const sleep = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    function visible(el) {
        if (!el) return false;

        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);

        return (
            r.width > 0 &&
            r.height > 0 &&
            r.bottom > 0 &&
            r.top < innerHeight &&
            s.display !== "none" &&
            s.visibility !== "hidden" &&
            Number(s.opacity || 1) > 0
        );
    }

    function textOf(el) {
        return (
            el?.innerText ||
            el?.textContent ||
            el?.getAttribute?.("aria-label") ||
            ""
        )
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
    }

    function onInstagram() {
        return (
            location.hostname === "instagram.com" ||
            location.hostname.endsWith(".instagram.com")
        );
    }

    function exactTextElements(
        words,
        root = document
    ) {
        const wanted =
            words.map(x => x.toLowerCase());

        return [
            ...root.querySelectorAll(
                'button,[role="button"],[tabindex],div,span'
            )
        ]
            .filter(visible)
            .filter(el =>
                wanted.includes(textOf(el))
            )
            .sort((a, b) => {
                const A =
                    a.getBoundingClientRect();

                const B =
                    b.getBoundingClientRect();

                return (
                    A.width * A.height -
                    B.width * B.height
                );
            });
    }

    function findExactText(
        words,
        root = document
    ) {
        return (
            exactTextElements(
                words,
                root
            )[0] ||
            null
        );
    }

    function clickableParent(el) {
        if (!el)
            return null;

        let node = el;

        for (
            let i = 0;
            i < 8 && node;
            i++
        ) {
            if (
                node.matches?.(
                    'button,[role="button"],[tabindex="0"]'
                )
            ) {
                return node;
            }

            node =
                node.parentElement;
        }

        return null;
    }

    function safeClick(el) {
        if (!el)
            return false;

        const target =
            clickableParent(el) ||
            el;

        try {
            target.click();
            return true;
        } catch {
            return false;
        }
    }

    function getSelectedCounter() {
        for (
            const el of
            document.querySelectorAll("body *")
        ) {
            if (!visible(el))
                continue;

            const t =
                (el.textContent || "")
                    .trim()
                    .replace(/\s+/g, " ");

            let m =
                t.match(
                    /^(\d+)\s+selected$/i
                );

            if (m) {
                return {
                    exists: true,
                    count: Number(m[1])
                };
            }

            m =
                t.match(
                    /^(\d+)\s+seçildi$/i
                );

            if (m) {
                return {
                    exists: true,
                    count: Number(m[1])
                };
            }
        }

        return {
            exists: false,
            count: 0
        };
    }

    function selectedCount() {
        return (
            getSelectedCounter()
                .count
        );
    }

    function selectModeActive() {
        if (
            getSelectedCounter()
                .exists
        ) {
            return true;
        }

        if (
            findExactText([
                "cancel",
                "iptal"
            ])
        ) {
            return true;
        }

        return false;
    }

    function normalSelectVisible() {
        if (selectModeActive())
            return false;

        return !!findExactText([
            "select",
            "seç"
        ]);
    }

    async function waitForInstagramReady() {
        console.log(
            "Waiting for Instagram to finish refreshing..."
        );

        const start =
            Date.now();

        let lastLog =
            -1;

        while (
            !window.STOP_IG &&
            Date.now() - start <
                AFTER_UNLIKE_MAX_WAIT
        ) {
            const elapsed =
                Math.floor(
                    (
                        Date.now() -
                        start
                    ) / 1000
                );

            if (
                elapsed !== lastLog &&
                elapsed % 3 === 0
            ) {
                lastLog = elapsed;

                console.log(
                    `Loading... ${elapsed}s`
                );
            }

            if (
                normalSelectVisible()
            ) {
                console.log(
                    "The list has refreshed and Select is available again."
                );

                await sleep(1200);

                return true;
            }

            await sleep(300);
        }

        if (window.STOP_IG)
            return false;

        console.error(
            "Select did not return within 45 seconds."
        );

        console.error(
            "The next batch will not start."
        );

        return false;
    }

    async function autoSelect() {
        if (selectModeActive()) {
            console.log(
                "Select mode is already active."
            );

            return true;
        }

        console.log(
            "Waiting for Select..."
        );

        let select =
            null;

        const waitStart =
            Date.now();

        while (
            !window.STOP_IG &&
            Date.now() - waitStart <
                AFTER_UNLIKE_MAX_WAIT
        ) {
            select =
                findExactText([
                    "select",
                    "seç"
                ]);

            if (select)
                break;

            await sleep(300);
        }

        if (!select) {
            console.error(
                "Select was not found."
            );

            return false;
        }

        console.log(
            "Select found."
        );

        safeClick(select);

        const openStart =
            Date.now();

        while (
            Date.now() - openStart <
            SELECT_OPEN_MAX_WAIT
        ) {
            if (selectModeActive()) {
                console.log(
                    "Select mode opened."
                );

                return true;
            }

            await sleep(250);
        }

        console.log(
            "Trying Select parent element..."
        );

        let parent =
            select.parentElement;

        for (
            let depth = 0;
            depth < 6 && parent;
            depth++
        ) {
            const r =
                parent.getBoundingClientRect();

            const t =
                textOf(parent);

            if (
                visible(parent) &&
                r.width <= 250 &&
                r.height <= 100 &&
                (
                    t === "select" ||
                    t === "seç"
                )
            ) {
                parent.click();

                const parentStart =
                    Date.now();

                while (
                    Date.now() -
                        parentStart <
                    3000
                ) {
                    if (
                        selectModeActive()
                    ) {
                        console.log(
                            "Select mode opened."
                        );

                        return true;
                    }

                    await sleep(200);
                }
            }

            parent =
                parent.parentElement;
        }

        console.error(
            "Select mode could not be opened."
        );

        return false;
    }

    function getTiles() {
        return [
            ...document.querySelectorAll(
                'div[role="button"][aria-label="Image with button"]'
            )
        ]
            .filter(tile => {
                if (!visible(tile))
                    return false;

                const r =
                    tile.getBoundingClientRect();

                if (
                    r.width < 120 ||
                    r.width > 400 ||
                    r.height < 120 ||
                    r.height > 400
                ) {
                    return false;
                }

                const img =
                    tile.querySelector("img");

                if (!img)
                    return false;

                const ir =
                    img.getBoundingClientRect();

                return (
                    ir.width > 120 &&
                    ir.height > 120
                );
            })
            .sort((a, b) => {
                const A =
                    a.getBoundingClientRect();

                const B =
                    b.getBoundingClientRect();

                if (
                    Math.abs(
                        A.top -
                        B.top
                    ) > 20
                ) {
                    return (
                        A.top -
                        B.top
                    );
                }

                return (
                    A.left -
                    B.left
                );
            });
    }

    function tileKey(tile) {
        const img =
            tile.querySelector("img");

        return (
            img?.currentSrc ||
            img?.src ||
            img?.alt ||
            ""
        );
    }

    async function selectTile(tile) {
        if (!selectModeActive())
            return false;

        const before =
            selectedCount();

        tile.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        await sleep(120);

        tile.click();

        const start =
            Date.now();

        while (
            Date.now() - start <
            CLICK_DELAY + 600
        ) {
            await sleep(100);

            const after =
                selectedCount();

            if (
                after ===
                before + 1
            ) {
                const elapsed =
                    Date.now() -
                    start;

                if (
                    elapsed <
                    CLICK_DELAY
                ) {
                    await sleep(
                        CLICK_DELAY -
                        elapsed
                    );
                }

                return true;
            }

            if (
                after <
                before
            ) {
                return false;
            }
        }

        return false;
    }

    async function scrollDown() {
        console.log(
            "Scrolling down..."
        );

        window.scrollBy({
            top:
                Math.floor(
                    innerHeight *
                    SCROLL_AMOUNT
                ),

            behavior: "smooth"
        });

        await sleep(
            SCROLL_DELAY
        );
    }

    async function selectBatch() {
        const processed =
            new Set();

        const failures =
            new Map();

        let noProgress =
            0;

        while (
            selectedCount() <
                BATCH_SIZE &&
            !window.STOP_IG
        ) {
            if (!onInstagram()) {
                console.error(
                    "The page is no longer Instagram."
                );

                window.STOP_IG =
                    true;

                return false;
            }

            if (!selectModeActive()) {
                console.error(
                    "Select mode closed unexpectedly."
                );

                return false;
            }

            const tiles =
                getTiles();

            console.log(
                `${tiles.length} grid items detected`
            );

            let added =
                0;

            for (
                const tile of tiles
            ) {
                if (
                    selectedCount() >=
                        BATCH_SIZE ||
                    window.STOP_IG
                ) {
                    break;
                }

                const key =
                    tileKey(tile);

                if (
                    !key ||
                    processed.has(key)
                ) {
                    continue;
                }

                const failCount =
                    failures.get(key) ||
                    0;

                if (
                    failCount >= 3
                ) {
                    continue;
                }

                const before =
                    selectedCount();

                const success =
                    await selectTile(
                        tile
                    );

                if (success) {
                    processed.add(
                        key
                    );

                    failures.delete(
                        key
                    );

                    added++;

                    console.log(
                        `${selectedCount()} / ${BATCH_SIZE}`
                    );

                } else {
                    failures.set(
                        key,
                        failCount + 1
                    );

                    console.log(
                        `Retrying item (${failCount + 1}/3)`
                    );

                    if (
                        selectedCount() <
                        before
                    ) {
                        console.error(
                            "Selected count decreased unexpectedly."
                        );

                        window.STOP_IG =
                            true;

                        return false;
                    }
                }
            }

            if (
                selectedCount() >=
                BATCH_SIZE
            ) {
                return true;
            }

            if (
                added === 0
            ) {
                noProgress++;
            } else {
                noProgress =
                    0;
            }

            if (
                noProgress >= 10
            ) {
                console.log(
                    `No new items found. Currently selected: ${selectedCount()}`
                );

                return (
                    selectedCount() >
                    0
                );
            }

            await scrollDown();
        }

        return (
            selectedCount() >
            0
        );
    }

    function visibleDialogs() {
        return [
            ...document.querySelectorAll(
                '[role="dialog"]'
            )
        ].filter(visible);
    }

    function unlikeElements(
        root = document
    ) {
        return (
            exactTextElements(
                [
                    "unlike",
                    "beğenmekten vazgeç"
                ],
                root
            )
        );
    }

    function findFirstUnlike() {
        const list =
            unlikeElements();

        if (!list.length)
            return null;

        list.sort((a, b) => {
            const A =
                a.getBoundingClientRect();

            const B =
                b.getBoundingClientRect();

            return (
                B.top -
                A.top
            );
        });

        return list[0];
    }

    function getSecondUnlikeCandidates(
        oldElements
    ) {
        const result =
            [];

        for (
            const dialog of
            visibleDialogs()
        ) {
            const list =
                unlikeElements(
                    dialog
                );

            for (
                const el of list
            ) {
                if (
                    !result.includes(el)
                ) {
                    result.push(el);
                }
            }
        }

        const current =
            unlikeElements();

        for (
            const el of current
        ) {
            if (
                oldElements.has(el)
            ) {
                continue;
            }

            if (
                !result.includes(el)
            ) {
                result.push(el);
            }
        }

        result.sort((a, b) => {
            const A =
                a.getBoundingClientRect();

            const B =
                b.getBoundingClientRect();

            return (
                A.width *
                    A.height -
                B.width *
                    B.height
            );
        });

        return result;
    }

    async function confirmClickWorked() {
        for (
            let i = 0;
            i < 20;
            i++
        ) {
            await sleep(250);

            if (
                visibleDialogs()
                    .length === 0
            ) {
                return true;
            }

            if (
                !selectModeActive()
            ) {
                return true;
            }
        }

        return false;
    }

    async function unlikeBatch() {
        const count =
            selectedCount();

        if (count <= 0) {
            console.error(
                "No items are selected."
            );

            return false;
        }

        const oldElements =
            new Set(
                unlikeElements()
            );

        const first =
            findFirstUnlike();

        if (!first) {
            console.error(
                "The first Unlike button was not found."
            );

            return false;
        }

        console.log(
            `Unliking ${count} items`
        );

        safeClick(first);

        console.log(
            "Searching for confirmation Unlike..."
        );

        let candidates =
            [];

        for (
            let attempt = 0;
            attempt < 50;
            attempt++
        ) {
            if (window.STOP_IG)
                return false;

            await sleep(250);

            candidates =
                getSecondUnlikeCandidates(
                    oldElements
                );

            if (
                candidates.length
            ) {
                console.log(
                    `${candidates.length} confirmation candidate(s) found`
                );

                break;
            }
        }

        if (
            !candidates.length
        ) {
            console.error(
                "The confirmation Unlike button was not found."
            );

            console.error(
                "The next batch will not start."
            );

            return false;
        }

        let confirmed =
            false;

        for (
            let i = 0;
            i < candidates.length;
            i++
        ) {
            const candidate =
                candidates[i];

            console.log(
                `Trying confirmation candidate ${i + 1}/${candidates.length}`
            );

            safeClick(
                candidate
            );

            const worked =
                await confirmClickWorked();

            if (worked) {
                confirmed =
                    true;

                console.log(
                    "Confirmation Unlike clicked."
                );

                break;
            }
        }

        if (!confirmed) {
            console.error(
                "The confirmation Unlike could not be verified."
            );

            return false;
        }

        console.log(
            "Waiting for Instagram to finish processing..."
        );

        const ready =
            await waitForInstagramReady();

        if (!ready) {
            return false;
        }

        console.log(
            "Unlike operation and refresh completed."
        );

        return true;
    }

    console.log(
        "Instagram unlike script started"
    );

    console.log(
        "Select is automatic"
    );

    console.log(
        "1 second per selection"
    );

    console.log(
        `Batch size: ${BATCH_SIZE}`
    );

    console.log(
        "Confirmation Unlike required"
    );

    console.log(
        "Automatic scrolling enabled"
    );

    console.log(
        "Next batch is automatic"
    );

    console.log(
        "Stop with: window.STOP_IG = true"
    );

    if (!onInstagram()) {
        console.error(
            "You are not on Instagram."
        );

        return;
    }

    for (
        let batch = 1;
        batch <= MAX_BATCHES;
        batch++
    ) {
        if (window.STOP_IG)
            break;

        console.log("");
        console.log(
            `BATCH ${batch}/${MAX_BATCHES}`
        );

        const selectOK =
            await autoSelect();

        if (!selectOK) {
            console.error(
                "Select could not be opened."
            );

            break;
        }

        const itemsOK =
            await selectBatch();

        if (!itemsOK) {
            console.error(
                "Item selection could not be completed."
            );

            break;
        }

        if (window.STOP_IG)
            break;

        const unlikeOK =
            await unlikeBatch();

        if (!unlikeOK) {
            console.error(
                "Unlike operation could not be completed."
            );

            break;
        }

        console.log(
            `BATCH ${batch} COMPLETED`
        );

        if (
            batch <
            MAX_BATCHES
        ) {
            await sleep(700);

            window.scrollBy({
                top:
                    -Math.floor(
                        innerHeight *
                        0.20
                    ),

                behavior: "smooth"
            });

            await sleep(500);
        }
    }

    console.log(
        window.STOP_IG
            ? "Script stopped."
            : "Script finished."
    );
})();
