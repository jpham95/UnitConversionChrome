document.addEventListener('DOMContentLoaded', async () => {
  const tooltipFormat = document.querySelector('input[name="tooltipFormat"]:checked')
  // tooltip format selector
  async function updateTooltipFormat(value) {
    const selectedFormat = document.querySelector(`input[name="tooltipFormat"][value="${value}"]`);
    if (selectedFormat) {
      selectedFormat.checked = true;
    }
    await chrome.storage.local.set({tooltipFormat: value});    
  }
  // tooltip timeout timer slider
  async function updateTooltipTimeout(value) {
    tooltipTimeoutSlider.value = value;
    tooltipTimeoutInput.value = value;
    await chrome.storage.local.set({tooltipTimeout: value});
  };
  
  // initialise tooltip timeout
  const timeout = (await chrome.storage.local.get('tooltipTimeout')).tooltipTimeout 
                  || 3; // default 3
  updateTooltipTimeout(timeout);
  // initialise tooltip format selector
  const format = (await chrome.storage.local.get('tooltipFormat')).tooltipFormat
                  || '=';
  updateTooltipFormat(format);

  // TODO: tooltipFormat is null here for some reason
  tooltipFormat.addEventListener('input', (event) => {
    updateTooltipFormat(event.target.value);
  });

  tooltipTimeoutSlider.addEventListener('input', (event) => {
    updateTooltipTimeout(event.target.value);
  });

  tooltipTimeoutInput.addEventListener('input', (event) => {
    updateTooltipTimeout(event.target.value);
  });
});
