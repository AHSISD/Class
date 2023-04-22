/**
 * This function creates a fullscreen button with an image on an iframe.
 * 
 * @param {string} ChoppyOrc - The ID of the iframe element.
 * @param {string} https://ibb.co/7SH2bbH - The URL of the image to be displayed on the button.
 */
function createFullscreenButton(iframeId, imageUrl) {
  try {
    // Get the iframe element
    const iframe = document.getElementById(iframeId);
    
    // Create the fullscreen button element
    const fullscreenButton = document.createElement("button");
    fullscreenButton.style.position = "absolute";
    fullscreenButton.style.top = "0";
    fullscreenButton.style.right = "0";
    fullscreenButton.style.zIndex = "9999";
    fullscreenButton.style.backgroundImage = `url(${imageUrl})`;
    fullscreenButton.style.backgroundSize = "contain";
    fullscreenButton.style.backgroundRepeat = "no-repeat";
    fullscreenButton.style.width = "50px";
    fullscreenButton.style.height = "50px";
    fullscreenButton.addEventListener("click", () => {
      // Request fullscreen for the iframe
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    });
    
    // Add the fullscreen button to the iframe
    iframe.parentNode.insertBefore(fullscreenButton, iframe);
  } catch (error) {
    console.error(error);
  }
}