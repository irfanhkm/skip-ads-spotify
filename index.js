const { app } = require('electron');
const { fetchMetadata } = require('./services/trackService');

const intervalFetchMetadata = 2000;

function createWindow() {
  // Call fetchMetadata initially
  fetchMetadata();

  // Call fetchMetadata at the specified interval
  setInterval(fetchMetadata, intervalFetchMetadata);
}

app.on('ready', () => {
  createWindow();
});