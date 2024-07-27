// Create context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "convertUnit",
      title: "Convert Unit",
      contexts: ["selection"]
    });
  });

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "convertUnit") {
        const selectedText = info.selectionText;
        const unitMatch = selectedText.match(/([\d,]+(\.\d+)?)\s*(miles?|mi|km|kilometers?|C|F|kg|kilograms?|lbs?|pounds?)/i);
        if (unitMatch) {
            const value = parseFloat(unitMatch[1].replace(/,/g, ''));
            const unit = unitMatch[3].toLowerCase();
            let result, message;

            switch(unit) {
                case 'c':
                    result = ((value * 9/5) + 32).toLocaleString(undefined, {maximumFractionDigits: 2});
                    message = `${value.toLocaleString()}\u00B0C to ${result}\u00B0F`;
                    break;
                case 'f':
                    result = ((value - 32) * 5/9).toLocaleString(undefined, {maximumFractionDigits: 2});
                    message = `${value.toLocaleString()}\u00B0F to ${result}\u00B0C`;
                    break;
                case 'km':
                case 'kilometer':
                case 'kilometers':
                    result = (value * 0.621371).toLocaleString(undefined, {maximumFractionDigits: 2});
                    message = `${value.toLocaleString()}km to ${result}mi`;
                    break;
                case 'mi':
                case 'mile':
                case 'miles':
                    result = (value * 1.60934).toLocaleString(undefined, {maximumFractionDigits: 2});
                    message = `${value.toLocaleString()}mi to ${result}km`;
                    break;
                case 'kg':
                case 'kilogram':
                case 'kilograms':
                    result = (value * 2.20462).toLocaleString(undefined, {maximumFractionDigits: 2});
                    message = `${value.toLocaleString()}kg to ${result}lb`;
                    break;
                case 'lb':
                case 'lbs':
                case 'pound':
                case 'pounds':
                    result = (value * 0.453592).toLocaleString(undefined, {maximumFractionDigits: 2});
                    message = `${value.toLocaleString()}lb to ${result}kg`;
                    break;
                default:
                    result = "Invalid unit";
            }

            if (result) {
                chrome.tabs.sendMessage(tab.id, {action: "showResult", result: result, message: message})
            }
        }
    }
});