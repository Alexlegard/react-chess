// Converts a letter (a-h) to an index (0-7)
export function letterToIndex(letter) {
    return letter.toLowerCase().charCodeAt(0) - 97;
}

// Converts an index (0-7) to a letter (a-h)
export function indexToLetter(index) {
    return String.fromCharCode(index + 97);
}