const { app } = require('electron');
const { fetchMetadata } = require('./services/darwin/trackService');

const intervalFetchMetadata = 2000;

function createWindow() {
  const os = process.platform;
  if (os === 'darwin') {
    // Call fetchMetadata initially
    fetchMetadata();

    // Call fetchMetadata at the specified interval
    setInterval(fetchMetadata, intervalFetchMetadata);
  } else {
    console.log('bye, we will support for your os');
    app.exit(0);
  }
}

app.on('ready', () => {
  createWindow();
});