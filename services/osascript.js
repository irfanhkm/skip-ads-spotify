const { exec } = require('child_process');

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
    });
}

module.exports = { executeCommand };