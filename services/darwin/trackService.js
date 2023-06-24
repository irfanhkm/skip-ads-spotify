const { executeCommand, Script } = require('./osascript');
const { exec } = require('child_process');


let currentMedia = {};
let statePlayer;
let isCurrStateAds = false;
let isPlayerRunning;

const statePlaying = "playing";
const advertisementTag = "Advertisement";
const defaultVolumeAfterAds = 100;
const zeroVolume = 0;

async function fetchMetadata() {
    const playerRunning = await checkSpotifyRunning();

    if (!playerRunning) {
        if (isPlayerRunning !== playerRunning) {
            currentMedia = {};
            console.log('no music player is running');
        }

        isPlayerRunning = false;
        return;
    }
    isPlayerRunning = true;

    statePlayer = await executeCommand(Script.GetPlayerState);
    if (statePlayer === null || statePlayer !== statePlaying) {
        return;
    }

    const trackInfo = await executeCommand(Script.GetCurrentTrack);
    if (trackInfo === null) {
        return;
    }

    const [title, artist, album] = trackInfo.trim().split(', ');
    if (
        currentMedia.title !== title 
        || currentMedia.artist !== artist
        || currentMedia.album !== album
    ) {
        currentMedia = { title, artist, album };

        if (title === advertisementTag) {
            console.log(`Now is advertisement, we keep volume down`);
            await executeCommand(`${Script.UpdateVolume} ${zeroVolume}`);
            isCurrStateAds = true;
            return;
        } else if (isCurrStateAds) {
            console.log(`Advertisement complete, we set the default volume`);
            await executeCommand(`${Script.UpdateVolume} ${defaultVolumeAfterAds}`);
            isCurrStateAds = false;
        }

        console.log(`Current song is ${title} by ${artist} on album ${album}`);
    }
}

function checkSpotifyRunning() {
    const command = 'pgrep -x Spotify';

    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            resolve(stdout != null && stdout.length > 0);
        });
    }).catch((error) => {
        console.error(`Error checking if Spotify is running: ${error}`);
        return false;
    });
}

module.exports = { fetchMetadata };
