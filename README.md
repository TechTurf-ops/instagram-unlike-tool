# Instagram Unlike Tool

A lightweight browser tool for managing and removing liked posts and Reels from Instagram in configurable batches.

It runs directly inside Instagram and adds a compact floating control panel with live progress tracking, automatic processing, and customizable settings.

## Features

* Compact floating interface
* Automatic Select mode
* Automatic scrolling
* Batch-based Unlike processing
* Automatic confirmation handling
* Waits for Instagram to finish refreshing before continuing
* Automatically continues to the next batch
* Live selected-item counter
* Live batch counter
* Progress bar
* Start and Stop controls
* Activity log
* Draggable interface
* Minimize control
* Compact Settings panel
* Blue, Green, and Teal themes
* Configurable selection delay
* Configurable batch size
* Configurable number of batches
* Configurable scrolling behavior
* Configurable refresh timeout
* No passwords, cookies, tokens, or API credentials required

## How to Use

1. Open Instagram in a desktop browser.

2. Go to:

   **Profile → Your activity → Interactions → Likes**

3. Open Developer Tools.

   Chrome / Edge on Windows:

   `Ctrl + Shift + J`

   Chrome on macOS:

   `Command + Option + J`

4. Open the **Console**.

5. Copy the contents of:

   `instagram-unlike.js`

6. Paste the script into the Console.

7. Press Enter.

8. The **Instagram Unlike Tool** panel will appear.

9. Press **Start**.

The tool will automatically open Select mode, select liked items, scroll through the list, perform the Unlike action, confirm it, and wait for Instagram to finish refreshing before starting another batch.

## Interface

The main panel contains the current status, batch number, selected-item counter, progress bar, Start and Stop controls, and a small activity log.

The window can be dragged anywhere on the page.

The header also contains three controls:

**Settings** — opens the compact Settings panel.

**Minimize** — collapses the tool to its header.

**Close** — closes the tool and stops the current run.

## Settings

Click the **gear icon** in the top-right corner of the tool to open Settings.

The following options can be changed:

### Batch Size

Controls how many liked items are selected before the Unlike action is performed.

Default:

```js
50
```

Maximum:

```js
50
```

### Max Batches

Controls the maximum number of batches processed during a single run.

Default:

```js
10
```

With the default settings, the tool can process up to:

```text
50 × 10 = 500 items
```

### Selection Delay

Controls the delay between item selections in milliseconds.

Default:

```js
1000
```

This corresponds to approximately one selection per second.

### Scroll Delay

Controls how long the tool waits after automatically scrolling the page.

Default:

```js
1100
```

### Scroll Amount

Controls how far the page moves during each automatic scroll.

Default:

```js
0.45
```

This represents 45% of the browser viewport height.

### Refresh Timeout

Controls how long the tool will wait for Instagram to finish processing an Unlike operation and reload the Likes interface.

Default:

```js
45000
```

This corresponds to 45 seconds.

### Theme

The interface includes three accent themes:

* Blue
* Green
* Teal

Choose a theme and press **Save Settings** to apply it.

## How Processing Works

For each batch, the tool automatically opens Instagram's Select mode and begins selecting items from the Likes activity page.

After reaching the configured batch size, it presses Unlike and handles the confirmation prompt.

The tool then waits until Instagram has finished processing the change and the normal Select control becomes available again.

Only after the previous operation is fully completed will the next batch begin.

## Stopping the Tool

Press **Stop** in the interface.

You can also stop it manually from the browser Console:

```js
window.STOP_IG = true;
```

The tool will stop as safely as possible after the current action.

## Security

The tool does not require or request your Instagram password, session ID, cookies, CSRF token, access token, or API credentials.

Never paste authentication information or login credentials into scripts from unknown sources.

## Browser Compatibility

The tool is primarily intended for desktop Chromium-based browsers, including Google Chrome, Microsoft Edge, and Brave.

Other browsers may work but are not guaranteed.

## Important

This project is not affiliated with, endorsed by, sponsored by, or connected to Instagram or Meta.

Instagram can modify its website interface at any time. Changes to Instagram's page structure may cause this tool to stop working until the selectors are updated.

If Instagram displays a temporary restriction, rate limit, or block, stop using the tool and wait for the restriction to expire.

This project is not intended to bypass Instagram restrictions, rate limits, temporary blocks, or other platform protections.

## Disclaimer

Use this project at your own risk.

Automated interaction with websites may be restricted by their terms, policies, or technical limitations. The author is not responsible for account restrictions, data loss, removed content, or other consequences resulting from the use of this project.

## License

MIT License
