const { exec } = require('child_process');

const Script = {
	GetPlayerState: 'tell application "Spotify" to get player state',
    GetCurrentTrack: 'tell application "Spotify" to if player state is playing then return {name, artist, album} of current track',
    UpdateVolume: 'tell application "Spotify" to set sound volume to '
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(`osascript -e \'${command}\'`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Command execution failed: ${error}`);
                reject(error);
            } else {
                resolve(stdout.trim());
            }
        });
    }).catch((error) => {
        console.error(`Command execution error: ${error}`);
    });
}

module.exports = { executeCommand, Script };