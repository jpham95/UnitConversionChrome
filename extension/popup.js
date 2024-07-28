document.addEventListener('DOMContentLoaded', async () => {

  // tooltip timeout timer slider
  async function updateTooltipTimeout(value) {
    tooltipTimeoutSlider.value = value;
    tooltipTimeoutInput.value = value;
    chrome.storage.local.set({tooltipTimeout: value});
  }

  tooltipTimeoutSlider.addEventListener('input', (event) => {
    updateTooltipTimeout(event.target.value);
  });

  tooltipTimeoutInput.addEventListener('input', (event) => {
    updateTooltipTimeout(event.target.value);
  });

  // initialise button text and tooltip timeout
  const timeout = await chrome.storage.local.get('tooltipTimeout').tooltipTimeout 
                        || 3;
  updateTooltipTimeout(timeout);
});