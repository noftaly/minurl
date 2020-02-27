/* eslint-disable no-unused-vars */
const clipboardjs = new ClipboardJS('.clipboard-event');
const socket = io();

function removeUrl(shortUrl) {
  fetch(`/${shortUrl}`, { method: 'DELETE' });
  document.getElementById(`shorturl-${shortUrl}`).style.display = 'none';
}

socket.on('newClick', (data) => {
  document.querySelector(`tr#shorturl-${data.shortUrl} td#clicks`).textContent = data.clicks;
});
