# Instagram Unlike Tool

A simple browser console script for removing liked posts and Reels from Instagram in batches.

## Features

* Automatically enters Select mode
* Selects up to 50 liked posts or Reels per batch
* Automatically scrolls to load more content
* Confirms the Unlike action
* Waits for Instagram to finish refreshing before starting the next batch
* Stops if an action cannot be verified
* Can process multiple batches automatically

## How to Use

1. Open Instagram on desktop.

2. Go to:

   **Profile → Your activity → Interactions → Likes**

3. Open your browser Developer Tools.

4. Open the **Console** tab.

5. Paste the JavaScript from `instagram-unlike.js`.

6. Press Enter.

7. Leave the Instagram tab open while the script is running.

To stop the script manually, run:

```js
window.STOP_IG = true
```

## Configuration

You can change these values near the top of the script:

```js
const BATCH_SIZE = 50;
const MAX_BATCHES = 10;
const CLICK_DELAY = 1000;
```

`BATCH_SIZE` controls how many items are selected before confirming Unlike.

`MAX_BATCHES` controls the maximum number of batches.

`CLICK_DELAY` controls the delay between selections in milliseconds.

## Important

This project is not affiliated with, endorsed by, or connected to Instagram or Meta.

Instagram may change its website interface at any time, which can cause the script to stop working.

Do not use this script to bypass Instagram restrictions, rate limits, temporary blocks, or other platform protections.

If Instagram displays a temporary restriction or block, stop the script and wait for the restriction to expire.

## Security

This script does not require your:

* Instagram password
* Session ID
* Cookies
* CSRF token
* Access token

Never paste your login credentials or session information into third-party scripts.

## Disclaimer

Use this project at your own risk. Automated interaction with websites may be restricted by their terms or platform rules. The author is not responsible for account restrictions, data loss, or other consequences caused by using the script.

## License

MIT License
