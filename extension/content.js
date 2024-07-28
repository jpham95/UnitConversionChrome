chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const tooltip = document.createElement('div');

    function moveTooltip(event) {
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
    }
    if (request.action === "showResult") {
        tooltip.textContent = `Converted: ${request.message}`;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'black';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '1000';

        document.body.appendChild(tooltip);

        document.addEventListener('mousemove', moveTooltip);

        data = await chrome.storage.local.get('tooltipTimeout');
        const timeout = (data.tooltipTimeout || 3) * 1000; // sec -> ms conversion
        setTimeout(() => {
                document.body.removeChild(tooltip);
                document.removeEventListener('mousemove', moveTooltip);
        }, timeout);
    }
});