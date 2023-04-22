/**
 * This function takes an iframe element and makes it go fullscreen.
 * 
 * @param {HTMLElement} iframe - The iframe element to make fullscreen.
 * @throws {TypeError} Will throw an error if the argument is not an HTML element.
 */
 function makeIframeFullscreen(iframe) {
  try {
    // Check if the argument is an HTML element
    if (!(iframe instanceof HTMLElement)) {
      throw new TypeError("Argument must be an HTML element");
    }
    
    // Check if the iframe is already in fullscreen mode
    if (document.fullscreenElement === iframe) {
      return;
    }
    
    // Request fullscreen mode for the iframe
    iframe.requestFullscreen();
  } catch (error) {
    console.error(error);
  }
}