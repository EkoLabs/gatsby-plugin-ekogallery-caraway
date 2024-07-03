/* eslint-env node */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const EKO_GALLERY_PATH = path.join(process.cwd(), '..', 'eko-gallery');
const EKO_GALLERY_LIQUID_DIST_PATH = path.join(EKO_GALLERY_PATH, 'liquid-dist');
const EKO_GALLERY_PLUGIN_LIQUID_PATH = path.join(process.cwd(), 'liquid-auto-generated');

const argv = yargs(hideBin(process.argv)).argv;

// Validate "gallery" arg is provided.
if (!argv.gallery) {
    console.error('Missing "gallery" option... aborting');
    process.exit(1);
}

if (!fs.existsSync(EKO_GALLERY_PATH)) {
    // eslint-disable-next-line max-len
    console.error(`eko-gallery could not be found in "${EKO_GALLERY_PATH}", you might need to modify the path before running, aborting...`);
    process.exit(1);
}

execSync(`yarn generate-liquid --gallery ${argv.gallery}`, { cwd: EKO_GALLERY_PATH, stdio: 'inherit' });

// Clean previous liquid generations.
if (fs.existsSync(EKO_GALLERY_PLUGIN_LIQUID_PATH)) {
    fs.rmdirSync(EKO_GALLERY_PLUGIN_LIQUID_PATH, { recursive: true });
}

// Create the plugin liquids folder.
fs.mkdirSync(EKO_GALLERY_PLUGIN_LIQUID_PATH);

// Copy gallery liquids into the plugin liquids folder.
let distLiquidFiles = fs.readdirSync(EKO_GALLERY_LIQUID_DIST_PATH, { recursive: true });
distLiquidFiles.forEach(file => {
    let currSource = path.join(EKO_GALLERY_LIQUID_DIST_PATH, file);
    let currTarget = path.join(EKO_GALLERY_PLUGIN_LIQUID_PATH, file);

    // Skip directories.
    if (fs.lstatSync(currSource).isDirectory()) {
        return;
    }

    // Create the subfolder if needed.
    let targetFolder = path.dirname(currTarget);
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }

    fs.copyFileSync(currSource, currTarget);
});
