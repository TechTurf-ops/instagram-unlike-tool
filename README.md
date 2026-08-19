# Instagram Unlike Tool

A lightweight browser-based tool for removing liked posts and Reels from your Instagram Likes activity in batches.

The tool runs directly inside Instagram and includes a compact control panel with live progress, batch tracking, Start/Stop controls, and automatic processing.

## Features

* Compact in-page control panel
* Start and Stop controls
* Live batch progress
* Live selected-item counter
* Automatically opens Instagram Select mode
* Selects up to 50 liked posts or Reels per batch
* Automatically scrolls to load more content
* Automatically presses Unlike
* Handles the confirmation Unlike prompt
* Waits for Instagram to finish refreshing before continuing
* Automatically starts the next batch
* Retries items that fail to select
* Stops when an action cannot be verified
* Draggable and minimizable interface
* Does not require login credentials, cookies, or tokens

## How to Use

1. Open Instagram on a desktop browser.

2. Go to:

   **Profile → Your activity → Interactions → Likes**

3. Open Developer Tools.

   **Chrome / Edge**

   `Ctrl + Shift + J`

   **macOS**

   `Command + Option + J`

4. Open the **Console** tab.

5. Copy the code from:

   `instagram-unlike.js`

6. Paste it into the Console and press Enter.

7. The **Instagram Unlike Tool** panel will appear on the page.

8. Press **Start**.

The tool will begin selecting liked posts and Reels automatically.

## Interface

The control panel displays:

* Current batch
* Number of selected items
* Progress bar
* Current operation status
* Activity log
* Start button
* Stop button
* Minimize control
* Close control

The window can also be dragged around the page.

## Configuration

The main settings can be changed near the top of `instagram-unlike.js`:

```js
const BATCH_SIZE = 50;
const MAX_BATCHES = 10;
const CLICK_DELAY = 1000;
```

### BATCH_SIZE

Controls how many items are selected before the tool performs the Unlike action.

Default:

```js
50
```

### MAX_BATCHES

Controls the maximum number of batches processed during one run.

Default:

```js
10
```

With the default configuration, the tool can process up to:

```text
50 × 10 = 500 items
```

### CLICK_DELAY

Controls the delay between item selections in milliseconds.

Default:

```js
1000
```

This means approximately one selection per second.

## Stopping the Tool

Press the **Stop** button in the interface.

You can also stop it manually from the Console:

```js
window.STOP_IG = true;
```

The tool attempts to stop safely after the current action.

## How It Works

The tool interacts with Instagram's existing **Your Activity → Likes** interface.

For each batch it:

1. Opens Select mode.
2. Selects liked posts or Reels.
3. Scrolls automatically when more items are needed.
4. Reaches the configured batch size.
5. Presses Unlike.
6. Confirms the Unlike action.
7. Waits for Instagram to finish processing and refreshing the list.
8. Starts the next batch.

The next batch does not begin until the previous Unlike operation has finished.

## Safety

The tool does **not** require or request your:

* Instagram password
* Session ID
* Cookies
* CSRF token
* Access token
* API credentials

Never paste your login credentials, session information, or authentication tokens into scripts from unknown sources.

## Important

This project is not affiliated with, endorsed by, sponsored by, or connected to Instagram or Meta.

Instagram can change its website structure at any time. Changes to the Instagram interface may cause some features of this tool to stop working.

If Instagram displays a temporary restriction, rate limit, or block, stop using the tool and wait for the restriction to expire.

This project is not intended to bypass Instagram restrictions, rate limits, temporary blocks, or other platform protections.

## Browser Compatibility

The tool is primarily designed for desktop Chromium-based browsers such as:

* Google Chrome
* Microsoft Edge
* Brave

Other browsers may work but are not guaranteed.

## Disclaimer

Use this project at your own risk.

Automated interaction with websites may be restricted by their terms, policies, or technical limitations. The author is not responsible for account restrictions, removed content, data loss, or other consequences resulting from use of this project.

## License

MIT License
