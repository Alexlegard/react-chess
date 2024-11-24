// Converts a letter (a-h) to an index (0-7)
export function letterToIndex(letter) {
    return letter.toLowerCase().charCodeAt(0) - 97;
}

// Converts an index (0-7) to a letter (a-h)
export function indexToLetter(index) {
    return String.fromCharCode(index + 97);
}

// Check if two letters are both uppercase or both lowercase
export function sameCase(a, b) {
    const aIsUpper = a === a.toUpperCase();
    const bIsUpper = b === b.toUpperCase();
    return aIsUpper === bIsUpper;
}

// Function used by my "findAValidXMove" functions to check if a
// square is in the bounds of the chessboard
export function isInBounds(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}