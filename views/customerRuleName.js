var dbcustname = 'Mayflower Holidays Sdn Bhd';
//dbcustname = heDecodeIfNotNull(dbcustname);
dbcustname = convertAccentedChar(dbcustname);
dbcustname = removeSpacesAndSpecialSymbol(dbcustname);
// var custnameOrder = permute(dbcustname);

var checkFields = {
    "a": "Mayflower HOLIDAYS sdn bhd"
}

var custNameFound;
var custNameRemark;

for (let key in checkFields) {
    let field = checkFields[key];                                
    field = field ? removeSpacesAndSpecialSymbol(field) : field;

    if(field && matchPattern(field, dbcustname)){
        custNameFound = 'Y';
        custNameRemark = `Found in ${key}, value: ${field}, DB value: ${dbcustname}`;
        break;
    }
}     

if(custNameFound != 'Y'){
    custNameFound = 'N';
    custNameRemark = 'No Customer Name found in OCR.';
}

console.log("custNameFound", custNameFound);
console.log("custNameRemark", custNameRemark);


function convertAccentedChar(str){
    if(str){
        str = str.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "")
    }

    return str;
}

function wordBlockMatching(keyword, str){
    const regex = new RegExp("\\b" + keyword + "\\b", "i");

    if (regex.test(str)) {
		return true;
	} else {
		return false;
	}
}

function regexSearch(regexstr, str) {

    // Convert str to string if it's not already a string
    // str = str ? JSON.stringify(str) : "";

    // Construct RegExp object from the provided regex string
    const regex = new RegExp(regexstr, 'gi');

    // Execute the regex on the input string and store the matches
    let matches = str.match(regex);

    // Check if matches were found
    if (matches && matches.length > 0) {
        // Join the matches into a single string separated by commas
        return matches.join(', ');
    } else {
        // Return undefined if no matches were found
        return undefined;
    }
}

//get all order combination of a word, eg. 'test 1 2', will get result 'test 1 2', 'test 2 1', '1 test 2', etc
function permute(input) {
    const words = input.split(' ');
    const results = [];

    function permuteHelper(arr, memo = []) {
        if (arr.length === 0) {
            results.push(memo.join(' '));
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            const newArr = arr.slice(0, i).concat(arr.slice(i + 1));
            const newMemo = memo.concat(arr[i]);
            permuteHelper(newArr, newMemo);
        }
    }

    permuteHelper(words);
    return results;
}

// function heDecodeIfNotNull(value){
//     if(typeof value === 'string' && value != '' && value != null ){
//         var decoded = he.decode(value.toString());
//         return decoded;
//     }else{
//         return value;
//     }
// }

function  removeSpacesAndSpecialSymbol(str) {
    // Define regular expressions for special characters and spaces
    const specialCharsRegex = /[ ~,@#\$%&*'\(\)\.\!\n™®©℠]/g;
    const dashRegex = /-/g;

    // Decode XML entities if necessary
    //str = heDecodeIfNotNull(str);

    // Remove special symbols
    str = str.replace(specialCharsRegex, '');

    // Remove dashes
    str = str.replace(dashRegex, '');

    return str;
}

function matchPattern(inputString, pattern) {
    // function "LIKE" in javascript
    const regex = new RegExp(pattern, 'i');

    return regex.test(inputString);
}

function removeCompanyPhrasesFromName(str) {
    // Trim the input string and convert it to lowercase
    let trimmedStr = str.trim().toLowerCase();

    // Define an array of company phrases in lowercase
    const companyPhrases = [        
        'limitedpartnership',
        'companylimited', 'privatelimited',
        'incorporated',
        'colimited',
        'ltdpart', 'limited',
        'pvtltd', 'incorp', 'pteltd', 'ptyltd',
        'coltd',
        'gmbh', 'corp', 'sarl', 'cokg',
        'ltd', 'inc', 'llc', 'llp', 'spa',
        'bv', 'co', 'sa', 'ag'
    ];

    // Iterate over the company phrases and remove any matches from the end of the string
    for (const phrase of companyPhrases) {
        if (trimmedStr.endsWith(phrase)) {
            trimmedStr = trimmedStr.slice(0, -phrase.length);
            break; // Exit the loop after removing the first match
        }
    }

    return trimmedStr.trim(); // Trim the result before returning
}

function convertToNormalNumber(number, digit) {
    // Parse the number as a float and round to two decimal places
	
	var decimaldivide = 0;	
    if(digit == 1)
        decimaldivide = 10;
    else if(digit == 2)
        decimaldivide = 100;

    var parsedNumber = parseFloat(number)
	parsedNumber = decimaldivide ? parsedNumber / decimaldivide : parsedNumber
    
    // Check if the parsed number is a valid float
    if (!isNaN(parsedNumber)) {
        return parsedNumber.toFixed(2); // Round to two decimal places
    } else {
        return number; // Return the original string if it couldn't be converted
    }
}

function findLastSeparatorWithDigits(str) {
    // Reverse the string to search from the end
    var reversedStr = str.split('').reverse().join('');
    // Find the index of the first occurrence of ".", ",", or " "
    var index = reversedStr.search(/[., ]/);
    if (index !== -1) {
        // If found, extract the substring from the index to the end
        var substr = reversedStr.substring(0, index);
        // Count the number of digits in the substring
        var digitsCount = substr.match(/\d+/g) ? substr.match(/\d+/g)[0].length : 0;
        
        return digitsCount;
    } else {
        // If not found, return null
        return null;
    }
}



