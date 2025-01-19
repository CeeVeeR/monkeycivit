# Civitai Download Button

A cheap lazy userscript that adds a convenient button to Civitai model pages, allowing you to copy a `wget` command for loras, in lightingAI workspaces, see folder path

## Features
- Adds a "📋 Copy wget Command" button next to download links on Civitai model pages.
- Prompts for your Civitai API key on first use, saving it side the voilentmonkey local storage.
- Automatically generates a `wget` command including your API key and copies the link to clipboard.

## Requirements
- A valid Civitai API key.

## Installation
1. Install a userscript manager for your browser:
   - [Violentmonkey](https://violentmonkey.github.io/)
2. Create a new script in your userscript manager and paste the content of this script.
3. Save and enable the script.

## Usage
1. Navigate to any Civitai model page (e.g., `https://civitai.com/models/<model_id>`).
2. If running the script for the first time, you will be prompted to enter your Civitai API key. The key will be securely saved.
3. Click the "📋 Copy wget Command" button next to the download link.
4. Paste the copied `wget` command into your terminal to download the model.

## Configuration
The script uses the following default configuration:
- **API Key Storage Key**: `civitai_api_key`
- **Default Download Path**: `/teamspace/studios/this_studio/ComfyUI/models/loras`

You can customize these values in the script's `Config` class.

## Permissions
This script requires the following permissions:
- `GM_setClipboard`: To copy the `wget` command to the clipboard.
- `GM_getValue` and `GM_setValue`: To securely save and retrieve the API key.

## License
MIT License
