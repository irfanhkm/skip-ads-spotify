const { app } = require('electron');
const { exec } = require('child_process');

let currentMedia = {};
let statePlayer;
let isCurrStateAds = false;

const statePlaying = "playing";
const advertisementTag = "Advertisement";
const defaultVolumeAfterAds = 20;
const intervalFetchMetadata = 2000;

function createWindow() {
  // Periodically check for media updates,, sorry this still abusing. will explore next possible approach
  setInterval(fetchMetadata, intervalFetchMetadata);
}

function fetchMetadata() {

  exec('osascript -e \'tell application "Spotify" to get player state\'', (error, stdout, stderr) => {
    if (stdout !== statePlayer) {
      statePlayer = stdout.trim();
    }
  });

  if (statePlayer === null || statePlayer != statePlaying) {
    return;
  }

  exec('osascript -e \'tell application "Spotify" to if player state is playing then return {name, artist, album} of current track\'', (error, stdout, stderr) => {
    if (stdout == null) {
      return;
    }
    if (error) {
      console.error(`Error retrieving media metadata: ${error.message}`);
      return;
    }

    const [title, artist, album] = stdout.trim().split(', ');

    if (currentMedia.title !== title || currentMedia.artist !== artist || currentMedia.album !== album) {
      currentMedia = { title, artist, album };

      // Handle the media metadata change
      console.log(`Current song is ${title} by ${artist} on album ${album}`);

      if (title === advertisementTag) {
        console.log(`Now is advertisement, we keep volume down`);
        setVolume(0);
        isCurrStateAds = true;
      } else if (isCurrStateAds) {
        console.log(`Advertisement complete, we set the default volume`);
        setVolume(defaultVolumeAfterAds);
        isCurrStateAds = false;
      }
    }
  });
}

function setVolume(volume) {
  exec(`osascript -e \'set volume output volume ${volume}\'`, (error, stdout, stderr) => {
    if (error != null || stderr != null) {
      console.error(`fail update volume ${error}, ${stderr}`)
    } 
  });
}

app.on('ready', () => {
  createWindow();
});