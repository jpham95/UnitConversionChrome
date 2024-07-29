// Create context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "convertUnit",
      title: "Convert Unit",
      contexts: ["selection"]
    });
  });

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "convertUnit") {
        const selectedText = info.selectionText;
        const unitMatch = selectedText.match(/([\d,]+(\.\d+)?)\s*(miles?|mi|km|kilometers?|°?C|°?F|kg|kilograms?|lbs?|pounds|"|inches|cm|centimeter|inch|centimeters?)/i);
        if (unitMatch) {
            const value = parseFloat(unitMatch[1].replace(/,/g, ''));
            const unit = unitMatch[3].toLowerCase();
            let result, 
                message,
                origin,
                dest;

            switch(unit) {
                case 'c':
                case '°c':
                    result = ((value * 9/5) + 32).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `\u00B0C`; 
                    dest = `\u00B0F`;
                    // message = `${value.toLocaleString()}\u00B0C = ${result}\u00B0F`;
                    break;
                case 'f':
                case '°f':
                    result = ((value - 32) * 5/9).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `\u00B0F`;
                    dest = `\u00B0C`;
                    // message = `${value.toLocaleString()}\u00B0F = ${result}\u00B0C`;
                    break;
                case 'km':
                case 'kilometer':
                case 'kilometers':
                    result = (value * 0.621371).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `km`;
                    dest = `mi`;
                    // message = `${value.toLocaleString()}km = ${result}mi`;
                    break;
                case 'mi':
                case 'mile':
                case 'miles':
                    result = (value * 1.60934).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `mi`;
                    dest = `km`
                    // message = `${value.toLocaleString()}mi = ${result}km`;
                    break;
                case 'kg':
                case 'kilogram':
                case 'kilograms':
                    result = (value * 2.20462).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `kg`
                    dest = `lb`
                    // message = `${value.toLocaleString()}kg = ${result}lb`;
                    break;
                case 'lb':
                case 'lbs':
                case 'pound':
                case 'pounds':
                    result = (value * 0.453592).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `lb`;
                    dest = `kg`;
                    // message = `${value.toLocaleString()}lb = ${result}kg`;
                    break;
                case '"':
                case 'inches':
                case 'inch':
                    result = (value * 2.54).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `"`; 
                    dest = `cm`;
                    // message = `${value.toLocaleString()}in = ${result}cm`;
                    break;
                case 'cm':
                case 'centimeter':
                case 'centimeters':
                    result = (value * 0.393701).toLocaleString(undefined, {maximumFractionDigits: 2});
                    origin = `cm`;
                    dest = `"`;
                    // message = `${value.toLocaleString()}cm = ${result}in`;
                    break;
            }

            if (result) {
                const data = {
                    from: `${value.toLocaleString()}${origin}`,
                    to: `${result}${dest}`
                }
                const format = await chrome.storage.local.get('tooltipFormat');
                const message = format === '=' ? 
                                `${data.from} = ${data.to}`
                                : `${data.from} converts to ${data.to}`
                await chrome.tabs.sendMessage(tab.id, {action: "showResult", message: message})
            }
        }
    }
});