// ==UserScript==
// @name         Civitai Download Button
// @namespace    https://github.com/CeeVeeR/monkeycivit
// @version      1.1
// @description  Adds a button to copy wget command for Civitai models
// @author       CeeVeer
// @match        https://civitai.com/models/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

class Config {
    static DEFAULT_API_KEY = 'REDACTED';
    static DOWNLOAD_PATH = '/teamspace/studios/this_studio/ComfyUI/models/loras';
    static API_KEY_STORAGE_KEY = 'civitai_api_key'; //placeholder, dont recommend hardcoding
}

class ApiKeyManager {
    static getApiKey() {
        let apiKey = GM_getValue(Config.API_KEY_STORAGE_KEY);
        if (!apiKey) {
            apiKey = this.promptForApiKey();
            if (apiKey) {
                GM_setValue(Config.API_KEY_STORAGE_KEY, apiKey);
            }
        }
        return apiKey;
    }

    static promptForApiKey() {
        return prompt('Please enter your Civitai API key (it will be saved for future use):',
                     Config.DEFAULT_API_KEY);
    }
}

class DownloadUrlBuilder {
    static addApiKeyToUrl(downloadUrl, apiKey) {
        const separator = downloadUrl.includes('?') ? '&' : '?';
        return `${downloadUrl}${separator}token=${apiKey}`;
    }

    static extractFilenameFromUrl(url) {
        const urlParts = url.split('/');
        const modelId = urlParts[urlParts.length - 1].split('?')[0];
        return `model_${modelId}.safetensors`;
    }

    static buildWgetCommand(downloadUrl, apiKey) {
        const urlWithToken = this.addApiKeyToUrl(downloadUrl, apiKey);
        const filename = this.extractFilenameFromUrl(downloadUrl);
        return `wget -O "${Config.DOWNLOAD_PATH}/${filename}" "${urlWithToken}"`;
    }
}

class CopyButton {
    static createButton() {
        const button = document.createElement('button');
        button.innerHTML = '📋 Copy wget Command';
        this.applyButtonStyles(button);
        return button;
    }

    static applyButtonStyles(button) {
        button.style.cssText = `
            padding: 8px 16px;
            margin-left: 10px;
            border-radius: 8px;
            background-color: #2d2d2d;
            color: white;
            border: none;
            cursor: pointer;
        `;
        this.addHoverEffects(button);
    }

    static addHoverEffects(button) {
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#3d3d3d';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#2d2d2d';
        });
    }
}

class ClipboardManager {
    static copyToClipboard(command) {
        GM_setClipboard(command);
        this.showCopyConfirmation();
    }

    static showCopyConfirmation() {
        alert('wget command copied to clipboard!');
    }
}

class DownloadManager {
    constructor() {
        this.observer = null;
    }

    handleCopyClick(downloadUrl) {
        const apiKey = ApiKeyManager.getApiKey();
        if (!apiKey) {
            alert('No API key provided!');
            return;
        }

        const wgetCommand = DownloadUrlBuilder.buildWgetCommand(downloadUrl, apiKey);
        ClipboardManager.copyToClipboard(wgetCommand);
    }

    addCopyButtons() {
        const downloadButtons = document.querySelectorAll('a[href*="/api/download/models/"]');
        downloadButtons.forEach(downloadButton => {
            if (downloadButton.nextSibling?.classList?.contains('copy-url-button')) {
                return;
            }
            const copyButton = CopyButton.createButton();
            copyButton.classList.add('copy-url-button');
            copyButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCopyClick(downloadButton.href);
            });
            downloadButton.parentNode.insertBefore(copyButton, downloadButton.nextSibling);
        });
    }

    initializeObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    this.addCopyButtons();
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initialize() {
        this.addCopyButtons();
        this.initializeObserver();
    }
}

// Main execution
(function() {
    'use strict';
    const downloadManager = new DownloadManager();
    downloadManager.initialize();
})();