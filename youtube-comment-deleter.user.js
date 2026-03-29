// ==UserScript==
// @name         YouTube Comment Deleter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Deletes YouTube comments from Google My Activity page automatically.
// @author       Antigravity
// @match        https://myactivity.google.com/*page=youtube_comments*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Trusted Types Policy for YouTube/Google My Activity
    let ttPolicy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            ttPolicy = window.trustedTypes.createPolicy('ytDeleterPolicy', {
                createHTML: (string) => string,
            });
        } catch (e) {
            // Policy might already exist or creation failed
            if (window.trustedTypes.getPolicies) {
                ttPolicy = window.trustedTypes.getPolicies().find(p => p.name === 'ytDeleterPolicy');
            }
        }
    }

    let isRunning = false;
    let deleteCount = 0;
    let timer = null;

    // --- Selectors ---
    const SELECTORS = {
        // Main delete button (the "X")
        deleteButton: 'button[aria-label*="Delete activity item"]',
        // Specific confirmation button selectors
        confirmButton: [
            'button[data-mdc-dialog-action="ok"]',
            'button.VfPpkd-LgbsSe[jsname="L57Ugc"]',
            '.VfPpkd-LgbsSe[data-mdc-dialog-action="ok"]'
        ].join(', '),
        dialog: 'div[role="dialog"]',
        // Selector to identify and avoid the verification modal
        verificationDialog: 'div[aria-labelledby="manage-my-activity-verification-title"]'
    };

    // --- UI Overlay ---
    const ui = document.createElement('div');
    ui.id = 'yt-deleter-ui';
    ui.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 99999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        width: 220px;
        border: 1px solid #444;
    `;

    const title = document.createElement('h3');
    title.textContent = 'YT Comment Deleter';
    title.style.cssText = 'margin-top:0; font-size: 16px; border-bottom: 1px solid #555; padding-bottom: 8px;';
    ui.appendChild(title);

    const statsContainer = document.createElement('div');
    statsContainer.style.cssText = 'margin: 10px 0; font-size: 14px;';

    const statusText = document.createElement('span');
    statusText.textContent = 'Status: ';
    statsContainer.appendChild(statusText);

    const statusEl = document.createElement('span');
    statusEl.id = 'deleter-status';
    statusEl.textContent = 'Stopped';
    statusEl.style.cssText = 'font-weight:bold; color: #ff4444;';
    statsContainer.appendChild(statusEl);

    statsContainer.appendChild(document.createElement('br'));

    const countText = document.createElement('span');
    countText.textContent = 'Deleted: ';
    statsContainer.appendChild(countText);

    const countEl = document.createElement('span');
    countEl.id = 'deleter-count';
    countEl.textContent = '0';
    countEl.style.fontWeight = 'bold';
    statsContainer.appendChild(countEl);

    ui.appendChild(statsContainer);

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display: flex; gap: 10px;';

    const startBtn = document.createElement('button');
    startBtn.id = 'deleter-start';
    startBtn.textContent = 'Start';
    startBtn.style.cssText = 'flex:1; padding: 8px; cursor: pointer; background: #28a745; color: white; border: none; border-radius: 4px; font-weight: bold;';

    const stopBtn = document.createElement('button');
    stopBtn.id = 'deleter-stop';
    stopBtn.textContent = 'Stop';
    stopBtn.style.cssText = 'flex:1; padding: 8px; cursor: pointer; background: #dc3545; color: white; border: none; border-radius: 4px; font-weight: bold;';

    btnContainer.appendChild(startBtn);
    btnContainer.appendChild(stopBtn);
    ui.appendChild(btnContainer);

    document.body.appendChild(ui);

    // --- Logic ---

    function updateUI(statusMsg) {
        statusEl.textContent = isRunning ? (statusMsg || 'Running') : 'Stopped';
        statusEl.style.color = isRunning ? '#00ff00' : '#ff4444';
        countEl.textContent = deleteCount;
    }

    // Helper to wait for an element to disappear
    async function waitForDisappearance(element, timeout = 5000) {
        return new Promise((resolve) => {
            const start = Date.now();
            const check = () => {
                if (!document.contains(element) || Date.now() - start > timeout) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    async function process() {
        if (!isRunning) return;

        // 1. Check for the "Manage My Activity verification" modal - STOP if found
        const verifyModal = document.querySelector('div[role="dialog"]');
        if (verifyModal && (verifyModal.innerText.includes('Manage My Activity verification') || verifyModal.innerText.includes('extra verification'))) {
            console.warn('Security verification modal detected. Stopping automated deletion.');
            isRunning = false;
            updateUI('Security Check!');
            alert('Google has popped up a verification modal. Please handle it manually, then refresh and start the script again.');
            return;
        }

        // 2. Check for confirmation dialog first
        const confirmBtn = document.querySelector(SELECTORS.confirmButton);
        if (confirmBtn && confirmBtn.offsetParent !== null) { // Ensure it's visible
            // Double check it's actually in a deletion confirmation dialog
            const dialog = confirmBtn.closest(SELECTORS.dialog);
            const dialogText = dialog ? dialog.innerText.toLowerCase() : '';
            
            if (dialogText.includes('delete') || dialogText.includes('permanently')) {
                console.log('Clicking confirmation button');
                updateUI('Confirming...');
                confirmBtn.click();
                
                deleteCount++;
                updateUI();
                
                await waitForDisappearance(confirmBtn);
                timer = setTimeout(process, 1000);
                return;
            }
        }

        // 2. Look for the delete "X" buttons
        // We find all buttons and pick the first visible one
        const deleteBtns = Array.from(document.querySelectorAll(SELECTORS.deleteButton))
            .filter(btn => btn.offsetParent !== null); // Only visible ones
        
        if (deleteBtns.length > 0) {
            const btnToClick = deleteBtns[0];
            const label = btnToClick.getAttribute('aria-label') || 'item';
            
            console.log('Clicking delete button:', label);
            updateUI('Deleting...');
            
            btnToClick.click();
            
            // Wait for button to be clicked/dialog to appear
            // We'll check again in a bit
            timer = setTimeout(process, 1500);
            return;
        }

        // 3. If no buttons found in current view, scroll down
        console.log('No buttons found in view, scrolling...');
        updateUI('Scrolling...');
        window.scrollBy(0, 800);

        // Wait for lazy loading
        timer = setTimeout(process, 2000);
    }

    startBtn.onclick = () => {
        if (!isRunning) {
            isRunning = true;
            updateUI();
            process();
        }
    };

    stopBtn.onclick = () => {
        isRunning = false;
        if (timer) clearTimeout(timer);
        updateUI();
    };

})();
