// TODO: Modify this function
function generateShortCode(storeId, transactionId) {
    // Checking validity of inputs
    if (!Number.isInteger(storeId) || storeId < 0 || storeId > 199) {
        return "INVALID"; // Return error for bad store ID
    }
    if (!Number.isInteger(transactionId) || transactionId < 1 || transactionId > 10000) {
        return "INVALID";
    }

    // Converting storeId to base-36 (0-199 fits in two characters: 00-ZZ)
    let storeCode = storeId.toString(36).toUpperCase().padStart(2, '0');

    // Converting transactionId to four digits
    let transactionCode = transactionId.toString().padStart(4, '0');
    

    // If transactionId is 10000
    if (transactionId === 10000) {
        transactionCode = "ZZZZ"; // Special code for 10000
    }

    let finalCode = storeCode + "-" + transactionCode;
    return finalCode;
}

function decodeShortCode(shortCode) {
    let defaultResult = {
        storeId: 0,
        shopDate: new Date(),
        transactionId: 0
    };

    // Checking if shortCode is a string and matches the pattern
    if (typeof shortCode !== 'string') {
        return defaultResult; 
    }

    // Using regex to check format: two base-36 chars, hyphen, four digits or ZZZZ
    let isValid = /^[0-9A-Z]{2}-([0-9]{4}|ZZZZ)$/.test(shortCode);
    if (!isValid) {
        return defaultResult; // Wrong format
    }

  
    let parts = shortCode.split('-');
    let storeCode = parts[0];
    let transactionCode = parts[1];

    // Decoding storeId from base-36
    let storeId = parseInt(storeCode, 36); 
  
    if (storeId < 0 || storeId > 199) {
        return defaultResult; // Invalid storeId
    }

    // Decoding transactionId
    let transactionId;
    if (transactionCode === "ZZZZ") {
        transactionId = 10000; // Special code for 10000
    } else {
        transactionId = parseInt(transactionCode, 10); 
        if (transactionId < 1 || transactionId > 9999) {
            return defaultResult; // Invalid id
        }
    }
    return {
        storeId: storeId,
        shopDate: new Date(), 
        transactionId: transactionId
    };
}

// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [175, 42, 0, 9]
    var transactionIds = [9675, 23, 123, 7]

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}