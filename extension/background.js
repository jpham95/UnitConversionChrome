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
        const { selectionText } = info;
        const unitMatch = selectionText.trim().match(/(\d+(?:,\d{3})*(\.\d+)?)?\s*(miles?|mi|km|kilometers?|°?C\b|°?F\b|kg|kilograms?|lbs?|pounds?|"|inches|cm|centimeters?|inch(?:es)?|oz|ounces?|g|grams?)\b/i);
        if (unitMatch) {
            const unit = unitMatch[3].toLowerCase();
            let value = unitMatch[1],
                result,
                origin,
                dest,
                message;
            if (!value) {
                message = "Invalid selection.";
            } else {
                value = parseFloat(unitMatch[1].replace(/,/g, ''));
                
                switch(unit) {
                    case 'c':
                    case '°c':
                        result = ((value * 9/5) + 32).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = `\u00B0C`; 
                        dest = `\u00B0F`;
                        break;
                    case 'f':
                    case '°f':
                        result = ((value - 32) * 5/9).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = `\u00B0F`;
                        dest = `\u00B0C`;
                        break;
                    case 'km':
                    case 'kilometer':
                    case 'kilometers':
                        result = (value * 0.621371).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = "km";
                        dest = "mi";
                        break;
                    case 'mi':
                    case 'mile':
                    case 'miles':
                        result = (value * 1.60934).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = 'mi';
                        dest = 'km';
                        break;
                    case 'kg':
                    case 'kilogram':
                    case 'kilograms':
                        result = (value * 2.20462).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = 'kg';
                        dest = 'lb';
                        break;
                    case 'lb':
                    case 'lbs':
                    case 'pound':
                    case 'pounds':
                        result = (value * 0.453592).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = 'lb';
                        dest = 'kg';
                        break;
                    case '"':
                    case 'inches':
                    case 'inch':
                        result = (value * 2.54).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = '"'; 
                        dest = 'cm';
                        break;
                    case 'cm':
                    case 'centimeter':
                    case 'centimeters':
                        result = (value * 0.393701).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = 'cm';
                        dest = '"';
                        break;
                    case 'oz':
                    case 'ounce':
                    case 'ounces':
                        result = (value * 28.3495).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = 'oz';
                        dest = 'g';
                        break;
                    case 'g':
                    case 'gram':
                    case 'grams':
                        result = (value * 0.035274).toLocaleString(undefined, {maximumFractionDigits: 2});
                        origin = 'g';
                        dest = 'oz';
                        break;
                    default:
                        break;
                }
            }
            if (!message) {
                const data = {
                    from: `${value.toLocaleString()}${origin}`,
                    to: `${result}${dest}`
                }
                const { tooltipFormat } = await chrome.storage.local.get('tooltipFormat');
                message = tooltipFormat === '='
                    ? `${data.from} = ${data.to}`
                    : `${data.from} converts to ${data.to}`
            }

            await chrome.tabs.sendMessage(tab.id, {action: 'showResult', message: message})
        }
    }
});