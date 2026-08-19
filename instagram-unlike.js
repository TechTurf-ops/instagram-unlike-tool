(async () => {
    if (window.__IG_UNLIKE_UI__) {
        window.__IG_UNLIKE_UI__.remove();
    }

    window.STOP_IG = false;

    const config = {
        batchSize: 50,
        maxBatches: 10,
        clickDelay: 1000,
        scrollDelay: 1100,
        scrollAmount: 0.45,
        refreshTimeout: 45000,
        selectOpenTimeout: 10000,
        theme: "blue"
    };

    const sleep = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    const panel = document.createElement("div");

    panel.id = "ig-unlike-tool-ui";

    panel.innerHTML = `
        <style>
            #ig-unlike-tool-ui {
                --accent-1: #28c6e8;
                --accent-2: #278fe8;
                --accent-3: #526dff;
                --accent-soft: rgba(39,143,232,.15);

                position: fixed;
                top: 72px;
                right: 20px;
                width: 330px;
                z-index: 2147483647;
                font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
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
                box-shadow: 0 18px 50px rgba(0,0,0,.50);
            }

            .igu-header {
                height: 50px;
                display: flex;
                align-items: center;
                padding: 0 11px;
                border-bottom: 1px solid #223034;
                cursor: move;
                user-select: none;
            }

            .igu-logo {
                width: 14px;
                height: 14px;
                margin-right: 8px;
                border-radius: 50%;
                background: linear-gradient(
                    135deg,
                    var(--accent-1),
                    var(--accent-2),
                    var(--accent-3)
                );
                box-shadow: 0 0 12px var(--accent-soft);
            }

            .igu-title-wrap {
                flex: 1;
                min-width: 0;
            }

            .igu-title {
                font-size: 14px;
                font-weight: 700;
                line-height: 17px;
            }

            .igu-subtitle {
                margin-top: 1px;
                color: #7e8e93;
                font-size: 9px;
            }

            .igu-header-actions {
                display: flex;
                align-items: center;
                gap: 2px;
            }

            .igu-icon-button {
                width: 27px;
                height: 27px;
                display: grid;
                place-items: center;
                padding: 0;
                border: 0;
                border-radius: 7px;
                color: #89979b;
                background: transparent;
                cursor: pointer;
            }

            .igu-icon-button:hover,
            .igu-icon-button.active {
                color: #ffffff;
                background: var(--accent-soft);
            }

            .igu-icon-button svg {
                width: 14px;
                height: 14px;
                fill: none;
                stroke: currentColor;
                stroke-width: 1.8;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            .igu-main {
                display: block;
                padding: 20px 22px 19px;
                text-align: center;
            }

            .igu-main.hidden {
                display: none;
            }

            .igu-mark {
                width: 50px;
                height: 50px;
                position: relative;
                margin: 0 auto 12px;
                border-radius: 50%;
                background: var(--accent-soft);
                border: 1px solid rgba(255,255,255,.04);
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
                    var(--accent-1),
                    var(--accent-2)
                );
                transform: translate(-50%,-50%);
            }

            .igu-mark::before {
                width: 22px;
                height: 4px;
            }

            .igu-mark::after {
                width: 4px;
                height: 22px;
            }

            .igu-status {
                font-size: 16px;
                font-weight: 720;
                letter-spacing: -.2px;
            }

            .igu-description {
                max-width: 270px;
                margin: 6px auto 14px;
                color: #8e9a9e;
                font-size: 11px;
                line-height: 1.4;
            }

            .igu-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 7px;
                margin-bottom: 10px;
            }

            .igu-stat {
                padding: 8px 9px;
                background: #172023;
                border: 1px solid #263337;
                border-radius: 8px;
                text-align: left;
            }

            .igu-stat-label {
                color: #708085;
                font-size: 8px;
                font-weight: 650;
                text-transform: uppercase;
                letter-spacing: .6px;
            }

            .igu-stat-value {
                margin-top: 2px;
                font-size: 14px;
                font-weight: 700;
            }

            .igu-progress-shell {
                height: 5px;
                overflow: hidden;
                margin-bottom: 14px;
                border-radius: 99px;
                background: #202c2f;
            }

            .igu-progress {
                width: 0%;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(
                    90deg,
                    var(--accent-1),
                    var(--accent-2),
                    var(--accent-3)
                );
                transition: width .2s ease;
            }

            .igu-buttons {
                display: flex;
                justify-content: center;
                gap: 7px;
            }

            .igu-primary,
            .igu-secondary {
                height: 38px;
                padding: 0 17px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
            }

            .igu-primary {
                min-width: 105px;
                color: #071516;
                border: 0;
                background: linear-gradient(
                    135deg,
                    var(--accent-1),
                    var(--accent-2)
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
                min-width: 82px;
                color: #dfe7e9;
                background: #172023;
                border: 1px solid #2a393d;
            }

            .igu-secondary:hover {
                background: #202c30;
            }

            .igu-log {
                display: none;
                max-height: 64px;
                overflow-y: auto;
                margin-top: 11px;
                padding: 7px 8px;
                color: #7e8e92;
                background: #0c1113;
                border: 1px solid #1d292c;
                border-radius: 7px;
                font-family: ui-monospace,SFMono-Regular,Menlo,monospace;
                font-size: 8px;
                line-height: 1.4;
                text-align: left;
                white-space: pre-wrap;
            }

            .igu-settings {
                display: none;
                padding: 13px;
            }

            .igu-settings.active {
                display: block;
            }

            .igu-settings-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .igu-settings-title {
                font-size: 13px;
                font-weight: 700;
            }

            .igu-settings-note {
                color: #68777b;
                font-size: 8px;
            }

            .igu-setting-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .igu-setting {
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 35px;
                padding: 5px 7px 5px 9px;
                background: #172023;
                border: 1px solid #263337;
                border-radius: 7px;
            }

            .igu-setting-info {
                flex: 1;
                min-width: 0;
                padding-right: 7px;
            }

            .igu-setting-name {
                color: #e5edef;
                font-size: 10px;
                font-weight: 650;
            }

            .igu-setting-desc {
                margin-top: 1px;
                color: #647277;
                font-size: 7px;
            }

            .igu-input,
            .igu-select {
                width: 76px;
                height: 26px;
                padding: 0 6px;
                border: 1px solid #304145;
                border-radius: 6px;
                outline: none;
                color: #e8eff1;
                background: #101719;
                font-size: 9px;
            }

            .igu-input:focus,
            .igu-select:focus {
                border-color: var(--accent-2);
            }

            .igu-select {
                width: 80px;
            }

            .igu-save {
                width: 100%;
                height: 33px;
                margin-top: 9px;
                border: 0;
                border-radius: 7px;
                color: #071516;
                background: linear-gradient(
                    135deg,
                    var(--accent-1),
                    var(--accent-2)
                );
                font-size: 10px;
                font-weight: 700;
                cursor: pointer;
            }

            .igu-save:hover {
                filter: brightness(1.08);
            }

            .igu-save-status {
                height: 12px;
                margin-top: 5px;
                color: var(--accent-1);
                font-size: 8px;
                text-align: center;
            }

            .igu-card.igu-minimized .igu-main,
            .igu-card.igu-minimized .igu-settings {
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

                    <button class="igu-icon-button igu-settings-button" title="Settings">
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3v-4h.08A1.7 1.7 0 0 0 4.6 8.97a1.7 1.7 0 0 0-.34-1.88l-.06-.06L7.03 4.2l.06.06A1.7 1.7 0 0 0 8.97 4.6 1.7 1.7 0 0 0 10 3.04V3h4v.08a1.7 1.7 0 0 0 1.03 1.52 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.96 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15z"></path>
                        </svg>
                    </button>

                    <button class="igu-icon-button igu-minimize" title="Minimize">
                        <svg viewBox="0 0 24 24">
                            <path d="M6 12h12"></path>
                        </svg>
                    </button>

                    <button class="igu-icon-button igu-close" title="Close">
                        <svg viewBox="0 0 24 24">
                            <path d="M7 7l10 10"></path>
                            <path d="M17 7L7 17"></path>
                        </svg>
                    </button>

                </div>
            </div>

            <div class="igu-main">
                <div class="igu-mark"></div>

                <div class="igu-status">Ready</div>

                <div class="igu-description">
                    Open your Instagram Likes activity page and press Start.
                </div>

                <div class="igu-stats">
                    <div class="igu-stat">
                        <div class="igu-stat-label">Batch</div>
                        <div class="igu-stat-value igu-batch">0 / 10</div>
                    </div>

                    <div class="igu-stat">
                        <div class="igu-stat-label">Selected</div>
                        <div class="igu-stat-value igu-selected">0 / 50</div>
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

            <div class="igu-settings">
                <div class="igu-settings-header">
                    <div class="igu-settings-title">Settings</div>
                    <div class="igu-settings-note">Runtime controls</div>
                </div>

                <div class="igu-setting-list">

                    <div class="igu-setting">
                        <div class="igu-setting-info">
                            <div class="igu-setting-name">Batch Size</div>
                            <div class="igu-setting-desc">Items per batch</div>
                        </div>

                        <input
                            class="igu-input setting-batch-size"
                            type="number"
                            min="1"
                            max="50"
                            value="50"
                        >
                    </div>

                    <div class="igu-setting">
                        <div class="igu-setting-info">
                            <div class="igu-setting-name">Max Batches</div>
                            <div class="igu-setting-desc">Maximum batches</div>
                        </div>

                        <input
                            class="igu-input setting-max-batches"
                            type="number"
                            min="1"
                            max="100"
                            value="10"
                        >
                    </div>

                    <div class="igu-setting">
                        <div class="igu-setting-info">
                            <div class="igu-setting-name">Selection Delay</div>
                            <div class="igu-setting-desc">Milliseconds</div>
                        </div>

                        <input
                            class="igu-input setting-click-delay"
                            type="number"
                            min="500"
                            max="10000"
                            step="100"
                            value="1000"
                        >
                    </div>

                    <div class="igu-setting">
                        <div class="igu-setting-info">
                            <div class="igu-setting-name">Scroll Delay</div>
                            <div class="igu-setting-desc">Milliseconds</div>
                        </div>

                        <input
                            class="igu-input setting-scroll-delay"
                            type="number"
                            min="300"
                            max="10000"
                            step="100"
                            value="1100"
                        >
                    </div>

                    <div class="igu-setting">
                        <div class="igu-setting-info">
                            <div class="igu-setting-name">Scroll Amount</div>
                            <div class="igu-setting-desc">Viewport ratio</div>
                        </div>

                        <input
                            class="igu-input setting-scroll-amount"
                            type="number"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value="0.45"
                        >
                    </div>

                    <div class="igu-setting">
                        <div class="igu-setting-info">
                            <div class="igu-setting-name">Refresh Timeout</div>
                            <div class="igu-setting-desc">Milliseconds</div>
                        </div>

                        <input
                            class="igu-input setting-refresh-timeout"
                            type="number"
                            min="5000"
                            max="120000"
                            step="1000"
                            value="45000"
                        >
                    </div>

                    <div class="igu-setting">
                        <div class="igu-setting-info">
                            <div class="igu-setting-name">Theme</div>
                            <div class="igu-setting-desc">Accent color</div>
                        </div>

                        <select class="igu-select setting-theme">
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="teal">Teal</option>
                        </select>
                    </div>

                </div>

                <button class="igu-save">
                    Save Settings
                </button>

                <div class="igu-save-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    window.__IG_UNLIKE_UI__ = panel;

    const card =
        panel.querySelector(".igu-card");

    const header =
        panel.querySelector(".igu-header");

    const mainPage =
        panel.querySelector(".igu-main");

    const settingsPage =
        panel.querySelector(".igu-settings");

    const settingsButton =
        panel.querySelector(".igu-settings-button");

    const minimizeButton =
        panel.querySelector(".igu-minimize");

    const closeButton =
        panel.querySelector(".igu-close");

    const startButton =
        panel.querySelector(".igu-start");

    const stopButton =
        panel.querySelector(".igu-stop");

    const statusElement =
        panel.querySelector(".igu-status");

    const descriptionElement =
        panel.querySelector(".igu-description");

    const selectedElement =
        panel.querySelector(".igu-selected");

    const batchElement =
        panel.querySelector(".igu-batch");

    const progressElement =
        panel.querySelector(".igu-progress");

    const logElement =
        panel.querySelector(".igu-log");

    const saveButton =
        panel.querySelector(".igu-save");

    const saveStatus =
        panel.querySelector(".igu-save-status");

    const batchSizeInput =
        panel.querySelector(".setting-batch-size");

    const maxBatchesInput =
        panel.querySelector(".setting-max-batches");

    const clickDelayInput =
        panel.querySelector(".setting-click-delay");

    const scrollDelayInput =
        panel.querySelector(".setting-scroll-delay");

    const scrollAmountInput =
        panel.querySelector(".setting-scroll-amount");

    const refreshTimeoutInput =
        panel.querySelector(".setting-refresh-timeout");

    const themeInput =
        panel.querySelector(".setting-theme");

    let running = false;
    let settingsOpen = false;

    function setStatus(title, description = "") {
        statusElement.textContent = title;

        if (description) {
            descriptionElement.textContent = description;
        }
    }

    function setSelected(count) {
        selectedElement.textContent =
            `${count} / ${config.batchSize}`;

        progressElement.style.width =
            `${Math.min(
                100,
                count / config.batchSize * 100
            )}%`;
    }

    function setBatch(batch) {
        batchElement.textContent =
            `${batch} / ${config.maxBatches}`;
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

    function applyTheme(theme) {
        const themes = {
            blue: {
                a1: "#28c6e8",
                a2: "#278fe8",
                a3: "#526dff",
                soft: "rgba(39,143,232,.15)"
            },

            green: {
                a1: "#43d584",
                a2: "#20b96a",
                a3: "#138e54",
                soft: "rgba(32,185,106,.15)"
            },

            teal: {
                a1: "#19d4af",
                a2: "#18acb8",
                a3: "#287dca",
                soft: "rgba(25,212,175,.14)"
            }
        };

        const data =
            themes[theme] ||
            themes.blue;

        panel.style.setProperty(
            "--accent-1",
            data.a1
        );

        panel.style.setProperty(
            "--accent-2",
            data.a2
        );

        panel.style.setProperty(
            "--accent-3",
            data.a3
        );

        panel.style.setProperty(
            "--accent-soft",
            data.soft
        );
    }

    function toggleSettings() {
        settingsOpen =
            !settingsOpen;

        settingsButton.classList.toggle(
            "active",
            settingsOpen
        );

        mainPage.classList.toggle(
            "hidden",
            settingsOpen
        );

        settingsPage.classList.toggle(
            "active",
            settingsOpen
        );

        if (
            card.classList.contains(
                "igu-minimized"
            )
        ) {
            card.classList.remove(
                "igu-minimized"
            );
        }
    }

    settingsButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();
            toggleSettings();
        }
    );

    saveButton.addEventListener(
        "click",
        () => {
            const batchSize =
                Number(batchSizeInput.value);

            const maxBatches =
                Number(maxBatchesInput.value);

            const clickDelay =
                Number(clickDelayInput.value);

            const scrollDelay =
                Number(scrollDelayInput.value);

            const scrollAmount =
                Number(scrollAmountInput.value);

            const refreshTimeout =
                Number(refreshTimeoutInput.value);

            if (
                !Number.isFinite(batchSize) ||
                batchSize < 1 ||
                batchSize > 50
            ) {
                saveStatus.textContent =
                    "Batch Size must be 1–50.";

                return;
            }

            if (
                !Number.isFinite(maxBatches) ||
                maxBatches < 1
            ) {
                saveStatus.textContent =
                    "Invalid Max Batches.";

                return;
            }

            if (
                !Number.isFinite(clickDelay) ||
                clickDelay < 500
            ) {
                saveStatus.textContent =
                    "Delay must be at least 500 ms.";

                return;
            }

            if (
                !Number.isFinite(scrollDelay) ||
                scrollDelay < 300
            ) {
                saveStatus.textContent =
                    "Invalid Scroll Delay.";

                return;
            }

            if (
                !Number.isFinite(scrollAmount) ||
                scrollAmount <= 0 ||
                scrollAmount > 1
            ) {
                saveStatus.textContent =
                    "Scroll Amount must be 0.1–1.";

                return;
            }

            config.batchSize =
                batchSize;

            config.maxBatches =
                maxBatches;

            config.clickDelay =
                clickDelay;

            config.scrollDelay =
                scrollDelay;

            config.scrollAmount =
                scrollAmount;

            config.refreshTimeout =
                refreshTimeout;

            config.theme =
                themeInput.value;

            applyTheme(
                config.theme
            );

            setBatch(0);
            setSelected(0);

            saveStatus.textContent =
                "Settings saved.";

            setTimeout(() => {
                saveStatus.textContent = "";
            }, 1800);
        }
    );

    function visible(el) {
        if (!el) return false;

        const r =
            el.getBoundingClientRect();

        const s =
            getComputedStyle(el);

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
            words.map(
                x => x.toLowerCase()
            );

        return [
            ...root.querySelectorAll(
                'button,[role="button"],[tabindex],div,span'
            )
        ]
            .filter(
                el => !panel.contains(el)
            )
            .filter(visible)
            .filter(
                el =>
                    wanted.includes(
                        textOf(el)
                    )
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
                panel.contains(node)
            ) {
                return null;
            }

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

        if (
            panel.contains(target)
        ) {
            return false;
        }

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
            document.querySelectorAll(
                "body *"
            )
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
                    count:
                        Number(m[1])
                };
            }

            m =
                t.match(
                    /^(\d+)\s+seçildi$/i
                );

            if (m) {
                return {
                    exists: true,
                    count:
                        Number(m[1])
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
            getSelectedCounter()
                .count;

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
        if (
            selectModeActive()
        ) {
            return false;
        }

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
                config.refreshTimeout
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
        if (
            selectModeActive()
        ) {
            return true;
        }

        setStatus(
            "Preparing",
            "Waiting for Select."
        );

        let select = null;

        const start =
            Date.now();

        while (
            !window.STOP_IG &&
            Date.now() - start <
                config.refreshTimeout
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
            config.selectOpenTimeout
        ) {
            if (
                selectModeActive()
            ) {
                return true;
            }

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

                if (
                    selectModeActive()
                ) {
                    return true;
                }
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
            .filter(
                tile =>
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
                    tile.querySelector(
                        "img"
                    );

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
            tile.querySelector(
                "img"
            );

        return (
            img?.currentSrc ||
            img?.src ||
            img?.alt ||
            ""
        );
    }

    async function selectTile(tile) {
        if (
            !selectModeActive()
        ) {
            return false;
        }

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
            config.clickDelay + 600
        ) {
            await sleep(100);

            const after =
                selectedCount();

            if (
                after === before + 1
            ) {
                const elapsed =
                    Date.now() - start;

                if (
                    elapsed <
                    config.clickDelay
                ) {
                    await sleep(
                        config.clickDelay -
                        elapsed
                    );
                }

                return true;
            }

            if (
                after < before
            ) {
                return false;
            }
        }

        return false;
    }

    async function scrollDown() {
        window.scrollBy({
            top:
                Math.floor(
                    innerHeight *
                    config.scrollAmount
                ),
            behavior: "smooth"
        });

        await sleep(
            config.scrollDelay
        );
    }

    async function selectBatch() {
        const processed =
            new Set();

        const failures =
            new Map();

        let noProgress = 0;

        while (
            selectedCount() <
                config.batchSize &&
            !window.STOP_IG
        ) {
            if (!onInstagram())
                return false;

            if (
                !selectModeActive()
            ) {
                return false;
            }

            const tiles =
                getTiles();

            let added = 0;

            for (
                const tile of tiles
            ) {
                if (
                    selectedCount() >=
                        config.batchSize ||
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

                    setStatus(
                        `Selecting ${selectedCount()} / ${config.batchSize}`,
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
                config.batchSize
            ) {
                return true;
            }

            if (
                added === 0
            ) {
                noProgress++;
            } else {
                noProgress = 0;
            }

            if (
                noProgress >= 10
            ) {
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
            .filter(
                el =>
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
        const result = [];

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
                    !result.includes(
                        el
                    )
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
            if (
                window.STOP_IG
            ) {
                return false;
            }

            await sleep(250);

            candidates =
                getSecondUnlikeCandidates(
                    oldElements
                );

            if (
                candidates.length
            ) {
                break;
            }
        }

        if (
            !candidates.length
        ) {
            return false;
        }

        let confirmed = false;

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
                confirmed = true;
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

        if (settingsOpen) {
            toggleSettings();
        }

        running = true;
        window.STOP_IG = false;

        startButton.disabled = true;

        log(
            "Script started."
        );

        try {
            for (
                let batch = 1;
                batch <= config.maxBatches;
                batch++
            ) {
                if (
                    window.STOP_IG
                ) {
                    break;
                }

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

                if (
                    window.STOP_IG
                ) {
                    break;
                }

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
                    config.maxBatches
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

            if (
                window.STOP_IG
            ) {
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
            log(
                error.message
            );

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
            window.STOP_IG =
                true;

            setStatus(
                "Stopping",
                "Finishing the current action."
            );
        }
    );

    closeButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            window.STOP_IG =
                true;

            panel.remove();

            window.__IG_UNLIKE_UI__ =
                null;
        }
    );

    minimizeButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            card.classList.toggle(
                "igu-minimized"
            );
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

    applyTheme(
        config.theme
    );

    setBatch(0);
    setSelected(0);

    setStatus(
        "Ready",
        "Open your Instagram Likes activity page and press Start."
    );
})();
