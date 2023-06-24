const { executeCommand } = require('./osascript');


let currentMedia = {};
let statePlayer;
let isCurrStateAds = false;

const statePlaying = "playing";
const advertisementTag = "Advertisement";
const defaultVolumeAfterAds = 20;
const zeroVolume = 0;

async function fetchMetadata() {
    statePlayer = await executeCommand('tell application "Spotify" to get player state');

    if (statePlayer === null || statePlayer != statePlaying) {
        return;
    }

    const trackInfo = await executeCommand('tell application "Spotify" to if player state is playing then return {name, artist, album} of current track');

    if (trackInfo == null) {
        return;
    }

    const [title, artist, album] = trackInfo.trim().split(', ');

    if (currentMedia.title !== title || currentMedia.artist !== artist || currentMedia.album !== album) {
        currentMedia = { title, artist, album };

        if (title === advertisementTag) {
            console.log(`Now is advertisement, we keep volume down`);
            await executeCommand(`set volume output volume ${zeroVolume}`);
            isCurrStateAds = true;
            return;
        } else if (isCurrStateAds) {
            console.log(`Advertisement complete, we set the default volume`);
            await executeCommand(`set volume output volume ${defaultVolumeAfterAds}`);
            isCurrStateAds = false;
        }

        // Handle the media metadata change
        console.log(`Current song is ${title} by ${artist} on album ${album}`);
    }
}

module.exports = { fetchMetadata };
