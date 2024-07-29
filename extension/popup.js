document.addEventListener('DOMContentLoaded', async () => {
  const tooltipFormatSelect = document.getElementById('tooltipFormat');
  const tooltipTimeoutSlider = document.getElementById('tooltipTimeoutSlider');
  const tooltipTimeoutInput = document.getElementById('tooltipTimeoutInput');

  // tooltip format selector
  async function updateTooltipFormat(value) {
    tooltipFormatSelect.value = value;
    await chrome.storage.local.set({tooltipFormat: value});    
  }
  
  // initialise tooltip format selector
  const { tooltipFormat } = await chrome.storage.local.get('tooltipFormat');
  const format = tooltipFormat || '='; // default '=' symbol
  updateTooltipFormat(format);
  tooltipFormat.addEventListener('change', (event) => {
    updateTooltipFormat(event.target.value);
  });

  // tooltip timeout timer slider
  async function updateTooltipTimeout(value) {
    tooltipTimeoutSlider.value = value;
    tooltipTimeoutInput.value = value;
    await chrome.storage.local.set({tooltipTimeout: value});
  };
  
  // initialise tooltip timeout
  const { tooltipTimeout } = await chrome.storage.local.get('tooltipTimeout');
  const timeout = tooltipTimeout || 3; // default 3
  updateTooltipTimeout(timeout);

  tooltipTimeoutSlider.addEventListener('input', (event) => {
    updateTooltipTimeout(event.target.value);
  });

  tooltipTimeoutInput.addEventListener('input', (event) => {
    updateTooltipTimeout(event.target.value);
  });
});
