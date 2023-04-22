/**
 * This function takes an iframe element and makes it go fullscreen when the link is opened.
 * 
 * @param {string} iframeId - The id of the iframe element
 */
function openFullscreen(iframeId) {
  try {
    // Get the iframe element
    const iframe = document.getElementById(iframeId);
    
    // Check if the iframe exists
    if (!iframe) {
      throw new Error("Iframe element not found");
    }
    
    // Check if the iframe is already in fullscreen mode
    if (document.fullscreenElement === iframe) {
      throw new Error("Iframe is already in fullscreen mode");
    }
    
    // Request fullscreen mode for the iframe
    iframe.requestFullscreen();
  } catch (error) {
    // Log the error
    console.error(error);
  }
}