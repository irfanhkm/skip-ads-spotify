const { Notification } = require('electron');

function showNotification(title, body, isSilent) {
    const notification = new Notification({
        title,
        body,
        silent: isSilent, // Disable notification sound
    });

    notification.show();
}

module.exports = { showNotification };