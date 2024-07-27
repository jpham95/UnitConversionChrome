document.addEventListener('DOMContentLoaded', () => {

  // tooltip timeout timer slider
  function updateTooltipTimeout(value) {
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
  chrome.storage.local.get(['enabled', 'tooltipTimeout'], (data) => {
    const timeout = data.tooltipTimeout || 3;
    updateTooltipTimeout(timeout);
  });
});