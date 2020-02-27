/* eslint-disable no-unused-vars */
const clipboardjs = new ClipboardJS('.clipboard-event');

function removeUrl(shortUrl) {
  fetch(`/${shortUrl}`, { method: 'DELETE' });
  document.getElementById(`shorturl-${shortUrl}`).style.display = 'none';
}
