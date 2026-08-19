(async () => {
    if (window.__IG_UNLIKE_UI__) {
        window.__IG_UNLIKE_UI__.remove();
    }

    window.STOP_IG = false;

    const BATCH_SIZE = 50;
    const MAX_BATCHES = 10;
    const CLICK_DELAY = 1000;
    const SCROLL_DELAY = 1100;
    const SCROLL_AMOUNT = 0.45;
    const AFTER_UNLIKE_MAX_WAIT = 45000;
    const SELECT_OPEN_MAX_WAIT = 10000;

    const sleep = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    const panel = document.createElement("div");

    panel.id = "ig-unlike-tool-ui";

    panel.innerHTML = `
        <style>
            #ig-unlike-tool-ui {
                position: fixed;
                top: 72px;
                right: 20px;
                width: 350px;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                color: #f4f7f8;
            }

            #ig-unlike-tool-ui * {
                box-sizing: border-box;
            }

            .igu-card {
                overflow: hidden;
                background: #111719;
                border: 1px solid #26363a;
                border-radius: 14px;
                box-shadow: 0 18px 50px rgba(0, 0, 0, .5);
            }

            .igu-header {
                height: 52px;
                display: flex;
                align-items: center;
                padding: 0 13px;
                border-bottom: 1px solid #223034;
                cursor: move;
                user-select: none;
            }

            .igu-logo {
                width: 15px;
                height: 15px;
                margin-right: 9px;
                border-radius: 50%;
                background: linear-gradient(
                    135deg,
                    #16d4b3,
                    #22a9e8,
                    #487bff
                );
                box-shadow: 0 0 14px rgba(34, 169, 232, .35);
            }

            .igu-title-wrap {
                flex: 1;
                min-width: 0;
            }

            .igu-title {
                font-size: 15px;
                line-height: 18px;
                font-weight: 700;
            }

            .igu-subtitle {
                margin-top: 1px;
                color: #819095;
                font-size: 10px;
            }

            .igu-header-actions {
                display: flex;
                align-items: center;
                gap: 3px;
            }

            .igu-icon-button {
                width: 27px;
                height: 27px;
                display: grid;
                place-items: center;
                border: 0;
                border-radius: 7px;
                color: #89979b;
                background: transparent;
                font-size: 17px;
                cursor: pointer;
            }

            .igu-icon-button:hover {
                color: #ffffff;
                background: #1e292c;
            }

            .igu-body {
                padding: 24px 25px 22px;
                text-align: center;
            }

            .igu-mark {
                width: 58px;
                height: 58px;
                position: relative;
                margin: 0 auto 15px;
                border-radius: 50%;
                background: linear-gradient(
                    145deg,
                    rgba(22, 212, 179, .17),
                    rgba(34, 169, 232, .17)
                );
                border: 1px solid rgba(34, 169, 232, .12);
            }

            .igu-mark::before,
            .igu-mark::after {
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                border-radius: 99px;
                background: linear-gradient(
                    135deg,
                    #18d2ae,
                    #31aee8
                );
                transform: translate(-50%, -50%);
            }

            .igu-mark::before {
                width: 25px;
                height: 5px;
            }

            .igu-mark::after {
                width: 5px;
                height: 25px;
            }

            .igu-status {
                font-size: 17px;
                font-weight: 720;
                letter-spacing: -.25px;
            }

            .igu-description {
                max-width: 290px;
                margin: 7px auto 16px;
                color: #8e9a9e;
                font-size: 12px;
                line-height: 1.45;
            }

            .igu-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 11px;
            }

            .igu-stat {
                padding: 9px 10px;
                background: #172023;
                border: 1px solid #263337;
                border-radius: 9px;
                text-align: left;
            }

            .igu-stat-label {
                color: #708085;
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: .65px;
            }

            .igu-stat-value {
                margin-top: 3px;
                font-size: 15px;
                font-weight: 700;
            }

            .igu-progress-shell {
                width: 100%;
                height: 5px;
                overflow: hidden;
                margin-bottom: 16px;
                border-radius: 99px;
                background: #202c2f;
            }

            .igu-progress {
                width: 0%;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(
                    90deg,
                    #19cfa8,
                    #28aee8,
                    #4c82ff
                );
                transition: width .2s ease;
            }

            .igu-buttons {
                display: flex;
                justify-content: center;
                gap: 8px;
            }

            .igu-primary,
            .igu-secondary {
                height: 40px;
                padding: 0 18px;
                border-radius: 9px;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
            }

            .igu-primary {
                min-width: 112px;
                color: #071516;
                border: 0;
                background: linear-gradient(
                    135deg,
                    #18d0ad,
                    #27aee7
                );
            }

            .igu-primary:hover {
                filter: brightness(1.08);
            }

            .igu-primary:disabled {
                opacity: .45;
                cursor: default;
            }

            .igu-secondary {
                min-width: 92px;
                color: #dfe7e9;
                background: #172023;
                border: 1px solid #2a393d;
            }

            .igu-secondary:hover {
                background: #202c30;
            }

            .igu-log {
                display: none;
                max-height: 72px;
                overflow-y: auto;
                margin-top: 13px;
                padding: 8px 9px;
                color: #7e8e92;
                background: #0c1113;
                border: 1px solid #1d292c;
                border-radius: 8px;
                font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                font-size: 9px;
                line-height: 1.45;
                text-align: left;
                white-space: pre-wrap;
            }

            .igu-card.igu-minimized .igu-body {
                display: none;
            }
        </style>

        <div class="igu-card">
            <div class="igu-header">
                <div class="igu-logo"></div>

                <div class="igu-title-wrap">
                    <div class="igu-title">Instagram Unlike Tool</div>
                    <div class="igu-subtitle">Liked posts manager</div>
                </div>

                <div class="igu-header-actions">
                    <button class="igu-icon-button igu-minimize">−</button>
                    <button class="igu-icon-button igu-close">×</button>
                </div>
            </div>

            <div class="igu-body">
                <div class="igu-mark"></div>

                <div class="igu-status">Ready</div>

                <div class="igu-description">
                    Open your Instagram Likes activity page and press Start.
                </div>

                <div class="igu-stats">
                    <div class="igu-stat">
                        <div class="igu-stat-label">Batch</div>
                        <div class="igu-stat-value igu-batch">0 / ${MAX_BATCHES}</div>
                    </div>

                    <div class="igu-stat">
                        <div class="igu-stat-label">Selected</div>
                        <div class="igu-stat-value igu-selected">0 / ${BATCH_SIZE}</div>
                    </div>
                </div>

                <div class="igu-progress-shell">
                    <div class="igu-progress"></div>
                </div>

                <div class="igu-buttons">
                    <button class="igu-primary igu-start">Start</button>
                    <button class="igu-secondary igu-stop">Stop</button>
                </div>

                <div class="igu-log"></div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    window.__IG_UNLIKE_UI__ = panel;

    const card = panel.querySelector(".igu-card");
    const header = panel.querySelector(".igu-header");
    const startButton = panel.querySelector(".igu-start");
    const stopButton = panel.querySelector(".igu-stop");
    const closeButton = panel.querySelector(".igu-close");
    const minimizeButton = panel.querySelector(".igu-minimize");

    const statusElement = panel.querySelector(".igu-status");
    const descriptionElement = panel.querySelector(".igu-description");
    const selectedElement = panel.querySelector(".igu-selected");
    const batchElement = panel.querySelector(".igu-batch");
    const progressElement = panel.querySelector(".igu-progress");
    const logElement = panel.querySelector(".igu-log");

    let running = false;

    function setStatus(title, description = "") {
        statusElement.textContent = title;

        if (description) {
            descriptionElement.textContent = description;
        }
    }

    function setSelected(count) {
        selectedElement.textContent =
            `${count} / ${BATCH_SIZE}`;

        progressElement.style.width =
            `${Math.min(100, count / BATCH_SIZE * 100)}%`;
    }

    function setBatch(batch) {
        batchElement.textContent =
            `${batch} / ${MAX_BATCHES}`;
    }

    function log(message) {
        console.log(message);

        logElement.style.display = "block";

        const time =
            new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

        logElement.textContent +=
            `[${time}] ${message}\n`;

        logElement.scrollTop =
            logElement.scrollHeight;
    }

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
            .filter(el => !panel.contains(el))
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
        if (!el) return null;

        let node = el;

        for (
            let i = 0;
            i < 8 && node;
            i++
        ) {
            if (panel.contains(node))
                return null;

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

        if (panel.contains(target))
            return false;

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
            if (
                panel.contains(el) ||
                !visible(el)
            ) {
                continue;
            }

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
        const count =
            getSelectedCounter().count;

        setSelected(count);

        return count;
    }

    function selectModeActive() {
        if (
            getSelectedCounter()
                .exists
        ) {
            return true;
        }

        return !!findExactText([
            "cancel",
            "iptal"
        ]);
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
        setStatus(
            "Processing",
            "Waiting for Instagram to refresh."
        );

        const start =
            Date.now();

        while (
            !window.STOP_IG &&
            Date.now() - start <
                AFTER_UNLIKE_MAX_WAIT
        ) {
            if (
                normalSelectVisible()
            ) {
                await sleep(1200);
                return true;
            }

            await sleep(300);
        }

        return false;
    }

    async function autoSelect() {
        if (selectModeActive())
            return true;

        setStatus(
            "Preparing",
            "Waiting for Select."
        );

        let select =
            null;

        const start =
            Date.now();

        while (
            !window.STOP_IG &&
            Date.now() - start <
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

        if (!select)
            return false;

        safeClick(select);

        const openStart =
            Date.now();

        while (
            Date.now() - openStart <
            SELECT_OPEN_MAX_WAIT
        ) {
            if (selectModeActive())
                return true;

            await sleep(250);
        }

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
                !panel.contains(parent) &&
                visible(parent) &&
                r.width <= 250 &&
                r.height <= 100 &&
                (
                    t === "select" ||
                    t === "seç"
                )
            ) {
                parent.click();

                await sleep(800);

                if (selectModeActive())
                    return true;
            }

            parent =
                parent.parentElement;
        }

        return false;
    }

    function getTiles() {
        return [
            ...document.querySelectorAll(
                'div[role="button"][aria-label="Image with button"]'
            )
        ]
            .filter(tile =>
                !panel.contains(tile)
            )
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
                    return A.top - B.top;
                }

                return A.left - B.left;
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

            if (after === before + 1) {
                const elapsed =
                    Date.now() - start;

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

            if (after < before)
                return false;
        }

        return false;
    }

    async function scrollDown() {
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
            if (!onInstagram())
                return false;

            if (!selectModeActive())
                return false;

            const tiles =
                getTiles();

            let added = 0;

            for (const tile of tiles) {
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
                    failures.get(key) || 0;

                if (failCount >= 3)
                    continue;

                const before =
                    selectedCount();

                const success =
                    await selectTile(tile);

                if (success) {
                    processed.add(key);
                    failures.delete(key);
                    added++;

                    setStatus(
                        `Selecting ${selectedCount()} / ${BATCH_SIZE}`,
                        "Processing liked items."
                    );
                } else {
                    failures.set(
                        key,
                        failCount + 1
                    );

                    if (
                        selectedCount() <
                        before
                    ) {
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

            if (added === 0)
                noProgress++;
            else
                noProgress = 0;

            if (noProgress >= 10) {
                return (
                    selectedCount() > 0
                );
            }

            await scrollDown();
        }

        return (
            selectedCount() > 0
        );
    }

    function visibleDialogs() {
        return [
            ...document.querySelectorAll(
                '[role="dialog"]'
            )
        ]
            .filter(el =>
                !panel.contains(el)
            )
            .filter(visible);
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

            return B.top - A.top;
        });

        return list[0];
    }

    function getSecondUnlikeCandidates(
        oldElements
    ) {
        const result = [];

        for (
            const dialog of
            visibleDialogs()
        ) {
            const list =
                unlikeElements(dialog);

            for (const el of list) {
                if (
                    !result.includes(el)
                ) {
                    result.push(el);
                }
            }
        }

        const current =
            unlikeElements();

        for (const el of current) {
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
                A.width * A.height -
                B.width * B.height
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

        if (count <= 0)
            return false;

        setStatus(
            "Removing likes",
            `Processing ${count} selected items.`
        );

        const oldElements =
            new Set(
                unlikeElements()
            );

        const first =
            findFirstUnlike();

        if (!first)
            return false;

        safeClick(first);

        let candidates = [];

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

            if (candidates.length)
                break;
        }

        if (!candidates.length)
            return false;

        let confirmed =
            false;

        for (
            let i = 0;
            i < candidates.length;
            i++
        ) {
            safeClick(
                candidates[i]
            );

            if (
                await confirmClickWorked()
            ) {
                confirmed =
                    true;

                break;
            }
        }

        if (!confirmed)
            return false;

        return (
            await waitForInstagramReady()
        );
    }

    async function run() {
        if (running)
            return;

        if (!onInstagram()) {
            setStatus(
                "Instagram not detected",
                "Open the Instagram Likes activity page."
            );

            return;
        }

        running = true;
        window.STOP_IG = false;

        startButton.disabled = true;

        log("Script started.");

        try {
            for (
                let batch = 1;
                batch <= MAX_BATCHES;
                batch++
            ) {
                if (window.STOP_IG)
                    break;

                setBatch(batch);
                setSelected(0);

                setStatus(
                    `Batch ${batch}`,
                    "Opening selection mode."
                );

                const selectOK =
                    await autoSelect();

                if (!selectOK) {
                    throw new Error(
                        "Select could not be opened."
                    );
                }

                const itemsOK =
                    await selectBatch();

                if (!itemsOK) {
                    throw new Error(
                        "Selection could not be completed."
                    );
                }

                if (window.STOP_IG)
                    break;

                const unlikeOK =
                    await unlikeBatch();

                if (!unlikeOK) {
                    throw new Error(
                        "Unlike could not be completed."
                    );
                }

                log(
                    `Batch ${batch} completed.`
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

            if (window.STOP_IG) {
                setStatus(
                    "Stopped",
                    "The operation was stopped."
                );
            } else {
                setStatus(
                    "Finished",
                    "All configured batches are complete."
                );

                progressElement.style.width =
                    "100%";
            }
        } catch (error) {
            log(error.message);

            setStatus(
                "Stopped",
                error.message
            );
        } finally {
            running = false;
            startButton.disabled = false;
        }
    }

    startButton.addEventListener(
        "click",
        run
    );

    stopButton.addEventListener(
        "click",
        () => {
            window.STOP_IG = true;

            setStatus(
                "Stopping",
                "Finishing the current action."
            );
        }
    );

    closeButton.addEventListener(
        "click",
        () => {
            window.STOP_IG = true;
            panel.remove();
            window.__IG_UNLIKE_UI__ = null;
        }
    );

    minimizeButton.addEventListener(
        "click",
        () => {
            card.classList.toggle(
                "igu-minimized"
            );

            minimizeButton.textContent =
                card.classList.contains(
                    "igu-minimized"
                )
                    ? "+"
                    : "−";
        }
    );

    let dragging = false;
    let dragX = 0;
    let dragY = 0;

    header.addEventListener(
        "mousedown",
        event => {
            if (
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }

            dragging = true;

            const rect =
                panel.getBoundingClientRect();

            dragX =
                event.clientX -
                rect.left;

            dragY =
                event.clientY -
                rect.top;

            panel.style.right =
                "auto";
        }
    );

    document.addEventListener(
        "mousemove",
        event => {
            if (!dragging)
                return;

            panel.style.left =
                `${event.clientX - dragX}px`;

            panel.style.top =
                `${event.clientY - dragY}px`;
        }
    );

    document.addEventListener(
        "mouseup",
        () => {
            dragging = false;
        }
    );

    setStatus(
        "Ready",
        "Open your Instagram Likes activity page and press Start."
    );
})();
