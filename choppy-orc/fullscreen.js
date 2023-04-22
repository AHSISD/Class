/**
 * This function creates a fullscreen button on an iframe.
 * When the button is clicked, the iframe will be displayed in fullscreen mode.
 *
 * @param {string} ChoppyOrc  - The ID of the iframe element.
 */
function createFullscreenButton(ChoppyOrc) {
  const iframe = document.getElementById(ChoppyOrc);

  // Create the fullscreen button
  const fullscreenButton = document.createElement('button');
  fullscreenButton.textContent = 'Fullscreen';

  // Add a click event listener to the button
  fullscreenButton.addEventListener('click', () => {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  });

  // Add the button to the iframe
  iframe.parentNode.insertBefore(fullscreenButton, iframe);
}