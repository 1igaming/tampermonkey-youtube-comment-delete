# YouTube Comment Deleter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-0047AB)](https://www.tampermonkey.net/)

A **Tampermonkey** userscript that automates **bulk deletion of your own YouTube comments** from Google’s **My Activity** comment history and/or YouTube’s **comment history** feed, by driving the on-page delete / confirm controls.

Maintained by **[1igaming](https://github.com/1igaming)** · Repository: [`tampermonkey-youtube-comment-delete`](https://github.com/1igaming/tampermonkey-youtube-comment-delete)

---

## Overview

The script matches the URLs declared in its header (Google **My Activity** for YouTube comments and/or **YouTube comment history**). It shows a small **status overlay** with **Start** / **Stop**, scrolls the activity list as needed, and repeatedly activates delete flows while reporting state (e.g. deleting, confirming, scrolling). It can surface alerts when Google shows **security verification** style modals that need human input.

---

## Features

- **Exhaustive pass** — targets delete controls on the visible activity list and repeats until stopped or cleared.
- **Verification awareness** — detects common **Google security check** modals and prompts you to complete them manually before continuing.
- **Status overlay** — shows live status (e.g. deleting, confirming, scrolling) so you can see progress at a glance.
- **Trusted Types** — registers a small **TrustedHTML** policy where supported for compatibility with modern Chromium defaults.
- **Dual entry points** — `@match` includes both **My Activity** and **YouTube comment history** URLs (see the userscript header for the exact patterns).

---

## Requirements

| Requirement | Notes |
|-------------|--------|
| [Tampermonkey](https://www.tampermonkey.net/) (or compatible manager) | Script uses **`@grant none`**. |
| Google / YouTube account | You must be logged in as the user whose **My Activity** / comment history you are cleaning. |
| Supported URLs | Typically [`https://myactivity.google.com/...`](https://myactivity.google.com/) with the YouTube-comments activity view, and/or [`https://www.youtube.com/feed/history/comment_history`](https://www.youtube.com/feed/history/comment_history) — see **`@match`** in `youtube-comment-deleter.user.js` for the authoritative patterns. |

---

## Installation

### Option A — Install from URL (recommended)

1. Open Tampermonkey → **Dashboard** → **Utilities** → **Import from URL**.
2. Paste:

   **`https://raw.githubusercontent.com/1igaming/tampermonkey-youtube-comment-delete/main/youtube-comment-deleter.user.js`**

3. Confirm installation and enable the script.

### Option B — Manual install

1. Open the script on GitHub ([**Raw**](https://github.com/1igaming/tampermonkey-youtube-comment-delete/raw/main/youtube-comment-deleter.user.js) or [**blob view**](https://github.com/1igaming/tampermonkey-youtube-comment-delete/blob/main/youtube-comment-deleter.user.js)).
2. Copy the full file contents into a **new script** in Tampermonkey and save.

---

## Usage

1. Open **[YouTube comment history](https://www.youtube.com/feed/history/comment_history)** or your **Google My Activity** page for YouTube comments (matching the script’s `@match` URLs).
2. Wait for the page to load; use the **Start** control in the overlay to begin automated deletion.
3. Click **Stop** at any time to halt the loop.
4. If a **security verification** modal appears, complete it in the browser when prompted, then resume if needed.

Large histories can take **a long time**. Google may throttle or change the DOM; if something breaks after an update, open an [issue](https://github.com/1igaming/tampermonkey-youtube-comment-delete/issues).

---

## Technical notes

- **Google changes often:** Selectors for delete / confirm dialogs are not a public API; site updates can break automation without warning.
- **No server component:** All logic runs locally in your browser.
- **Account risk:** Aggressive bulk deletion may trigger **extra verification** or temporary restrictions from Google.

---

## Disclaimer

Deletions are **permanent** from the perspective of the visible activity UI (Google may retain data per their own policies). You are solely responsible for compliance with **YouTube / Google Terms of Service** and applicable law. This software is provided **“as is”** without warranty; the maintainer is not liable for misuse, data loss, or enforcement actions by Google or third parties. See [LICENSE](LICENSE).

---

## License

**MIT** — see [LICENSE](LICENSE).

Copyright © 2026 [1igaming](https://github.com/1igaming).
