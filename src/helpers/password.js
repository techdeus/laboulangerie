function arrayFromLowToHigh(low, high) {
    const result = [];

    for (let i = low; i <= high; ++i) {
        result.push(i);
    }
    
    return result;
}

const UPPERCASE_CHAR_CODES = arrayFromLowToHigh(65, 90);
const LOWERCASE_CHAR_CODES = arrayFromLowToHigh(97, 122);
const NUMBER_CHAR_CODES = arrayFromLowToHigh(48, 57);
const SYMBOL_CHAR_CODES = arrayFromLowToHigh(33, 47).concat(
    arrayFromLowToHigh(58, 64)
).concat(
    arrayFromLowToHigh(91, 96)
).concat(
    arrayFromLowToHigh(123, 126)
);


function generatePassword(difficulty) {
    let charCodes = LOWERCASE_CHAR_CODES;
    let characterCount;
    let newPassword = [];
    
    if (difficulty === '1') {
        charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
        characterCount = 7;
    } else if (difficulty === '2') {
        charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
        charCodes = charCodes.concat(NUMBER_CHAR_CODES);
        characterCount = 10;
    } else {
        charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
        charCodes = charCodes.concat(NUMBER_CHAR_CODES);
        charCodes = charCodes.concat(SYMBOL_CHAR_CODES);
        characterCount = 12;
    }

    for (let i = 0; i < characterCount; ++i) {
        let currentCharacter = charCodes[Math.floor(Math.random() * charCodes.length)];
        newPassword.push(String.fromCharCode(currentCharacter));
    }

    return newPassword.join('');
}

module.exports = generatePassword;