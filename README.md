# YouTube Comment Deleter

A Tampermonkey script to automatically delete all YouTube comments from your Google My Activity history.

## Features
- **Exhaustive Deletion**: Scans and clicks every delete button on the page.
- **Smart Detection**: Detects Google's security verification modals and alerts the user.
- **Improved UI**: Displays real-time status (Deleting, Confirming, Scrolling).
- **Trusted Types Support**: Compatible with modern browser security policies.

## Installation
1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. Create a new script in Tampermonkey.
3. Copy and paste the contents of `youtube-comment-deleter.user.js` into the editor.
4. Save the script.

## Usage
1. Open your [YouTube Comments History page](https://www.youtube.com/feed/history/comment_history).
2. A status overlay will appear in the top-right corner.
3. Click **Start** to begin the automated deletion process.
4. The script will automatically scroll and delete items until the page is cleared or you click **Stop**.
