const { app, Tray, nativeImage, Menu } = require('electron');
const { fetchMetadata } = require('./services/darwin/trackService');

const intervalFetchMetadata = 2000;

function createWindow() {
  const os = process.platform;
  
  if (os === 'darwin') {
    createTray();

    // Call fetchMetadata initially
    fetchMetadata();

    // Call fetchMetadata at the specified interval
    setInterval(fetchMetadata, intervalFetchMetadata);
  } else {
    console.log('bye, we will support for your os');
    app.exit(0);
  }
}

function createTray() {
  const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAACBklEQVR4nK3Vy4vOYRQH8I/Bbi6LYcKCkiErsxBlQ8i1rJSFjQ1JUS4xY6TE2gYJg4VILBjGpWahhCFyCxHj+o/o6Pz4eb3v+Ll86+l9et/nOc/3fL/nnJfqGJfrn9GBHtzHZzzLFfshdOeZyhiNXgzn5Wl1znTmb8P5eNPvgjZjAMfRUoFEK/pwNe82ZDqAXf4c3Rm8LvPeZPq36EtZfkJH6tWSmu7ESVzG7TTtUe5PJ8O5mWVZlogxvhy4JyWIVN5jK5agC5MxFVPyczG24Ao+YH+pOnbXSjlUcv9pXnqFj7me4GXu3+ACNuRD2/EOczAdd4ugo7I2C4QcszKlODgPq7A898F8Pg7gLY7gItbn/S8ZU3uyLDAG15PFIM7hEI7hPB7jNQ5iJtZiG8aWMm6vF3hC6rwHZ3ADD9O8wXxkHTbhBQ4XDGsD10oRWIGNWIhFWJqmLcPqLK3IaEfqPskPfJeiMK+zpnSu4VOacSkNu5PfRSYrsRebS/dmlM2TdRmrwOyU4yzuZVkFswc4msbFcNpXDpLlFj3wS4O0lr4LRgswsdQIkfIa3MoHb5bOt9VrkKJJTqiOrgxW4FSjOdOUg6QsSVUEqf6RxmdzBu+rkaUR2pJp/0hjUyJeLQ/x6L5ahPthVJwpZkxlhAlxKUyKOn+eK+o0Sirc/y//gdFN3zqqCr4C3Yp3ZeGKKYEAAAAASUVORK5CYII=')
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', type: 'normal', click: () => app.quit() }
  ]);

  tray.setToolTip('Spotify skipper');
  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  createWindow();

  app.dock.hide();
});