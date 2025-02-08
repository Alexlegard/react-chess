const { indexToLetter, sameCase, isInBounds } = require('./utils.js');
const { validateMoveSafety, canAnyBlackPieceAttackSquare, canAnyWhitePieceAttackSquare } = require("./validateMoveSafety");

/*
Starting board

["r", "n", "b", "q", "k", "b", "n", "r"],
["p", "p", "p", "p", "p", "p", "p", "p"],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["P", "P", "P", "P", "P", "P", "P", "P"],
["R", "N", "B", "Q", "K", "B", "N", "R"]
*/
class ChessboardClass {
    constructor() {
        this.startingBoard = [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"]
        ];
        this.startingFen = "rnbqk2r/pppppQpp/8/2b1p3/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1";
        
        this.board = this.startingBoard;
        this.fen = this.startingFen;
        this.result = "in progress";

        // Set of squares under attack by white and black in the chess board's starting position.
        this.whiteAttackedSquares = [
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["X", "X", "X", "X", "X", "X", "X", "X"],
            ["X", "X", "X", "X", "X", "X", "X", "X"],
            ["O", "X", "X", "X", "X", "X", "X", "O"]
        ];

        this.blackAttackedSquares = [
            ["O", "X", "X", "X", "X", "X", "X", "O"],
            ["X", "X", "X", "X", "X", "X", "X", "X"],
            ["X", "X", "X", "X", "X", "X", "X", "X"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O", "O"]
        ];

        // Important FEN properties
        this.activeColor = "w";
        this.whiteCanCastleKingside = true;
        this.whiteCanCastleQueenside = true;
        this.blackCanCastleKingside = true;
        this.blackCanCastleQueenside = true;
        this.enPassantTarget = "-";
        this.enPassantTargetReadable = "-";
        this.halfmoveClock = 0;
        this.fullmoveNumber = 1;
    }

    getBoard() {
        return this.board;
    }

    // When we change the board, we also have to
    // update the fen string behind the scenes.
    setBoard(newBoard) {
        this.board = newBoard;
        this.constructFenString();
    }

    getFen() {
        return this.fen;
    }

    getActiveColor() {
        return this.activeColor;
    }

    setActiveColor(newColor) {
        this.activeColor = newColor;
        this.constructFenString();
    }

    getWhiteCanCastleKingside() {
        return this.whiteCanCastleKingside;
    }

    setWhiteCanCastleKingside(value) {
        this.whiteCanCastleKingside = value;
        this.constructFenString();
    }

    getWhiteCanCastleQueenside() {
        return this.whiteCanCastleQueenside;
    }

    setWhiteCanCastleQueenside(value) {
        this.whiteCanCastleQueenside = value;
        this.constructFenString();
    }

    getBlackCanCastleKingside() {
        return this.blackCanCastleKingside;
    }

    setBlackCanCastleKingside(value) {
        this.blackCanCastleKingside = value;
        this.constructFenString();
    }

    getBlackCanCastleQueenside() {
        return this.blackCanCastleQueenside;
    }

    setBlackCanCastleQueenside(value) {
        this.blackCanCastleQueenside = value;
        this.constructFenString();
    }

    getCastlingRights() {
        let result = "";
        if(this.whiteCanCastleKingside) {
            result += "K";
        }
        if(this.whiteCanCastleQueenside) {
            result += "Q";
        }
        if(this.blackCanCastleKingside) {
            result += "k";
        }
        if(this.blackCanCastleQueenside) {
            result += "q";
        }
        if(result === "") {
            result = "-";
        }
        return result;
    }

    /* Removes castling rights the first time a king or rook moves.
    *  Has only 1 parameter when a king moves, 2 when a rook moves.
    *  
    *  @param color - Color of the moved piece: "w" for white, "b" for black
    *  @param rookOriginalSquare -  Optional parameter, the original square of the moved rook.
    *
    */
    removeCastlingRights(color, rookOriginalSquare) {

        

        // King move remove castling logic
        if(rookOriginalSquare === undefined) {
            if(color === "w") {
                this.whiteCanCastleKingside = false;
                this.whiteCanCastleQueenside = false;
                return;
            } else {
                this.blackCanCastleKingside = false;
                this.blackCanCastleQueenside = false;
                return;
            }
        }
        // Rook move castling logic
        let rookSquare = "";
        rookSquare += rookOriginalSquare[1];
        rookSquare += rookOriginalSquare[0];

        switch(rookSquare) {
            case "a1":
                this.whiteCanCastleQueenside = false;
                return;
            case "a8":
                this.blackCanCastleQueenside = false;
                return;
            case "h1":
                this.whiteCanCastleKingside = false;
                return;
            case "h8":
                this.blackCanCastleKingside = false;
                return;
        }
    }

    castleWhiteKingside() {
        // Clear the king and rook from their original squares.
        this.board[7][4] = "";
        this.board[7][7] = "";

        // The king and rook appear on their new squares.
        this.board[7][5] = "R";
        this.board[7][6] = "K";

        this.whiteCanCastleKingside = false;
        this.whiteCanCastleQueenside = false;
        this.nextHalfmove();
        this.enPassantTarget = "-";
    }

    castleWhiteQueenside() {
        // Clear the king and rook from their original squares.
        this.board[7][0] = "";
        this.board[7][4] = "";

        // The king and rook appear on their new squares.
        this.board[7][2] = "K";
        this.board[7][3] = "R";

        this.whiteCanCastleKingside = false;
        this.whiteCanCastleQueenside = false;
        this.nextHalfmove();
        this.enPassantTarget = "-";
    }

    castleBlackKingside() {
        // Clear the king and rook from their original squares.
        this.board[0][4] = "";
        this.board[0][7] = "";

        // The king and rook appear on their new squares.
        this.board[0][5] = "r";
        this.board[0][6] = "k";

        this.blackCanCastleKingside = false;
        this.blackCanCastleQueenside = false;
        this.nextHalfmove();
        this.enPassantTarget = "-";
    }

    castleBlackQueenside() {
        // Clear the king and rook from their original squares.
        this.board[0][0] = "";
        this.board[0][4] = "";

        // The king and rook appear on their new squares.
        this.board[0][2] = "k";
        this.board[0][3] = "r";

        this.blackCanCastleKingside = false;
        this.blackCanCastleQueenside = false;
        this.nextHalfmove();
        this.enPassantTarget = "-";
    }

    /*
    * Checks if a square is empty. Example input: ["c", 6]
    * 
    * @param file: letter representing the file eg. "a"
    * @param rank: number representing the rank, starting with 1 = first rank
    */
    isSquareEmpty(file, rank) {
        
        //Check if file is a string
        if (typeof file !== 'string') {
            return true;
        }
        
        const fileIndex = file.toLowerCase().charCodeAt(0) - 96;
        const rankIndex = 8 - rank;

        const piece = this.board[rankIndex][fileIndex-1];
        return piece === "";

        return true;
    }

    /*
    * @param originalFile - Letter representing the original square's file.
    * @param originalRank - Number representing the original square's rank (starting from 1)
    * @param destinationFile - Letter representing the destination square's file
    * @param destinationRank - Number representing the destination square's rank (starting from 1)
    * @param piece - Letter representing the piece. A capital letter is a white piece while a
    *   lowercase letter is a black piece.
    */
    isSquareOccupiedByEnemyPiece(originalFile, originalRank, destinationFile, destinationRank, piece) {

        
        // Convert files (letters) into numeric values which are the correct index
        const originalFileIndex = originalFile.toLowerCase().charCodeAt(0) - 97;
        const destinationFileIndex = destinationFile.toLowerCase().charCodeAt(0) - 97;

        // Correctly calculate the index for the ranks as well
        const originalRankIndex = 8 - originalRank;
        const destinationRankIndex = 8 - destinationRank;

        const destinationSqPiece = this.board[destinationRankIndex][destinationFileIndex];

        // Calculate if both letters are different capitalization.
        // Check if the destination square is empty as well.
        const isOriginalSqPieceUpperCase = piece === piece.toUpperCase();
        const isDestinationSqPieceUpperCase = destinationSqPiece === destinationSqPiece.toUpperCase();
        const differentColor = isOriginalSqPieceUpperCase !== isDestinationSqPieceUpperCase;
        const isSquareEmpty = destinationSqPiece === "";

        // If the piece is empty string (empty square) or same capitalization (friendly piece), return false
        if(!isSquareEmpty && differentColor) {
            return true;
        }
        return false;      
    }

    
    /* 
     * When moving any kind of longrange piece, we usually have to check if all the squares
     * between both squares are empty (non-inclusive of the squares themselves)
     *
     * @param originalSquare    - Rank, then file (ex. 1, a)
     * @param destinationSquare - Rank, then file (ex. 8, a)
    */
    isPathEmpty(originalSquare, destinationSquare) {

        

        // It's a file if the letters are the same, but the numbers are different
        if(originalSquare[1] === destinationSquare[1] && originalSquare[0] !== destinationSquare[0]) {
            return this.isFilePathEmpty(originalSquare, destinationSquare);
        }

        // It's a rank if the letters are different, but the numbers are the same
        if(originalSquare[1] !== destinationSquare[1] && originalSquare[0] === destinationSquare[0]) {
            return this.isRankPathEmpty(originalSquare, destinationSquare);
        }

        // Logic for checking diagonals...
        // Not checking if it's a proper diagonal at this moment because
        // I already check that in the bishopLogic function.
        if(originalSquare[1] !== destinationSquare[1] && originalSquare[0] !== destinationSquare[0]) {
            return this.isDiagonalPathEmpty(originalSquare, destinationSquare);
        }
    }

    /*
    * @param originalSquare: Array representing the original square
    * @param destinationSquare: Array representing the destination square
    *
    * Both squares are on the same file and are valid for a rook,
    * queen, or 2-square pawn move.
    */
    isFilePathEmpty(originalSquare, destinationSquare) {

        let distance = undefined;

        distance = Math.abs(originalSquare[0] - destinationSquare[0]);
        
        //Return true if distance between the 2 squares is 1 or 0
        if(distance < 2) {
            return true;
        }

        // Determine lowSquare and highSquare
        let lowSquare, highSquare;
        if (originalSquare[0] < destinationSquare[0]) {
            lowSquare = originalSquare;
            highSquare = destinationSquare;
        } else {
            lowSquare = destinationSquare;
            highSquare = originalSquare;
        }

        
        //Loop through the squares on the file (column)
        for (let i = parseInt(lowSquare[0]) + 1; i < highSquare[0]; i++) {
            
            let lowSquareLetter = lowSquare[1];
            if (!this.isSquareEmpty(lowSquareLetter, i)) { // Should be a, 3
                return false;
            }
        }
        return true;
    }

    isRankPathEmpty(originalSquare, destinationSquare) {

        

        let distance = undefined;

        const asciiOfOriginalSquare = originalSquare[1].charCodeAt(0) - 97;
        const asciiOfDestinationSquare = destinationSquare[1].charCodeAt(0) - 97;

        distance = asciiOfOriginalSquare - asciiOfDestinationSquare;

        //Return true if distance between the 2 squares is 1 or 
        if(distance < 2) {
            return true;
        }

        // Determine leftSquare and rightSquare
        let leftSquare, rightSquare, leftSquareFileIndex, rightSquareFileIndex;
        if(asciiOfOriginalSquare < asciiOfDestinationSquare) {
            leftSquare = originalSquare;
            leftSquareFileIndex = leftSquare[1].charCodeAt(0) - 97;
            rightSquare = destinationSquare;
            rightSquareFileIndex = rightSquare[1].charCodeAt(0) - 97;
        } else {
            leftSquare = destinationSquare;
            rightSquare = originalSquare;
        }

        // Loop through the squares on the rank
        for( let i = leftSquareFileIndex + 1; i < rightSquareFileIndex; i++ ) {

            let leftSquareLetter = leftSquare[1];
            if (!this.isSquareEmpty(leftSquareLetter, i)) { // Should be a, 3
                return false;
            }
        }
        return true;
    }

    /*
    * @param originalSquare: Array representing the original square.      eg [1, "f", "B"]
    * @param destinationSquare: Array representing the destination square eg [4, "c"]
    *
    * Both squares are on the same diagonal and are valid for a bishop or queen move.
    */
    isDiagonalPathEmpty(originalSquare, destinationSquare) {

        

        // Calculate distance between both squares, and return true if the
        // distance between the 2 squares is 1 or 0
        let distance = undefined;
        distance = Math.abs(originalSquare[0] - destinationSquare[0]);

        if(distance < 2) {
            return true;
        }

        
        const originalFileIndex = originalSquare[1].toLowerCase().charCodeAt(0) - 96;
        const originalRankIndex = 8 - originalSquare[0];
        const destinationFileIndex = destinationSquare[1].toLowerCase().charCodeAt(0) - 96;
        const destinationRankIndex = 8 - destinationSquare[0];

        let lowSquare, highSquare;

        if(originalRankIndex > destinationRankIndex) {
            lowSquare = originalSquare;
            highSquare = destinationSquare
        } else {
            lowSquare = destinationSquare;
            highSquare = originalSquare;
        }

        if(lowSquare[1] > highSquare[1]) {
            return this.isBottomRightToTopLeftDiagonalEmpty(lowSquare, highSquare);
        } else {
            return this.isBottomLeftToTopRightDiagonalEmpty(lowSquare, highSquare);
        }
    }

    /* Helper function for isDiagonalPathEmpty.
    * 
    * @param lowSquare  - square that's closer to the 1st rank ex. [1, "f"]
    * @param highSquare - square that's closer to the 8th rank ex. [4, "c"]
    */
    isBottomRightToTopLeftDiagonalEmpty(lowSquare, highSquare) {
        

        const lowFileIndex = lowSquare[1].toLowerCase().charCodeAt(0) - 97;
        const lowRankIndex = 8 - lowSquare[0];
        const highFileIndex = highSquare[1].toLowerCase().charCodeAt(0) - 97;
        const highRankIndex = 8 - highSquare[0];

        for( let rank = highRankIndex + 1, file = highFileIndex + 1; rank < lowRankIndex; rank++, file++ ) {

            let square = this.board[rank][file];

            // Check if the square is empty
            if (square !== "") {
                return false;
            }
        }

        return true;
    }

    /* Helper function for isDiagonalPathEmpty
    *
    * @param lowSquare  - square that's closer to the 1st rank ex. [1, "f"]
    * @param highSquare - square that's closer to the 8th rank ex. [4, "c"]
    */
    isBottomLeftToTopRightDiagonalEmpty(lowSquare, highSquare) {
        

        const lowFileIndex = lowSquare[1].toLowerCase().charCodeAt(0) - 97;
        const lowRankIndex = 8 - lowSquare[0];
        const highFileIndex = highSquare[1].toLowerCase().charCodeAt(0) - 97;
        const highRankIndex = 8 - highSquare[0];

        // Let's make a for loop. It seems logical to start at rank = highRankIndex + 1
        // and end the loop at lowRankIndex - 1

        for(let rank = highRankIndex + 1, file = highFileIndex - 1; rank < lowRankIndex; rank++, file--) {

            let square = this.board[rank][file];

            if(square !== "") {
                return false;
            }
        }

        return true;
    }

    /*
     * @param {String} piece - Lowercase letter representing the piece on the original square
     * @param {int} destinationFile - Letter of the file going from a to h.
     * @param {int} destinationRank - index of the rank starting with 1=1  going up to 8=8
     */
    // isDestinationSquareOccupiedByFriendlyPiece(piece, destinationFile, destinationRank) {
    //     alert("test");
    //     if(this.isSquareEmpty(destinationFile, destinationRank)) {
    //         return undefined;
    //     }    
    //     const fileIndex = destinationFile.charCodeAt(0) - 97; // Convert 'a' to 0, ..., 'h' to 7
    //     const rankIndex = destinationRank - 1;
    //     const pieceOnDestinationSquare = this.board[rankIndex][fileIndex];
    //     alert("pieceOnDestinationSquare: " + pieceOnDestinationSquare);
    //     if(this.activeColor === "w") {
    //         if(pieceOnDestinationSquare === pieceOnDestinationSquare.toUpperCase()) {
    //             return true;
    //         }
    //         return false;
    //     } else {
    //         if(pieceOnDestinationSquare === pieceOnDestinationSquare.toLowerCase()) {
    //             return true;
    //         } return false;
    //     }
    // }

    getEnPassantTarget() {
        
        return this.enPassantTarget;
    }

    getEnPassantTargetReadable() {
        
        return this.enPassantTargetReadable;
    }

    setEnPassantTarget(file, rank) {
        
        this.enPassantTarget = [file, rank];
        this.enPassantTargetReadable = `${file}${rank}`;
        this.constructFenString();
    }

    deselectEnPassantTarget() {
        
        this.enPassantTarget = "-";
        this.enPassantTargetReadable = "-";
        this.constructFenString();
    }

    getHalfmoveClock() {
        return this.halfmoveClock;
    }

    setHalfmoveClock(value) {
        this.halfmoveClock = value;
        this.constructFenString();
    }

    getFullmoveNumber() {
        return this.fullmoveNumber;
    }

    setFullmoveNumber(value) {
        this.fullmoveNumber = value;
        this.constructFenString();
    }

    constructPiecePlacement() {
        let fenPiecePlacement = "";

        for(let i = 0; i < this.board.length; i++) {
            let emptyCount = 0;

            for(let j = 0; j < this.board[i].length; j++) {
                const piece = this.board[i][j];

                if(piece === "") {
                    emptyCount++;
                } else {
                    if(emptyCount > 0) {
                        fenPiecePlacement += emptyCount;
                        emptyCount = 0;
                    }
                    fenPiecePlacement += piece;
                }
            }

            // If there is an empty piece at the end of the row add that as well
            if (emptyCount > 0) {
                fenPiecePlacement += emptyCount;
            }

            // Add a slash to properly create fen notation
            if (i < this.board.length - 1) {
                fenPiecePlacement += "/";
            }
        }
        return fenPiecePlacement;
    }

    // Update the class's fen string using the current class state
    constructFenString() {
        
        // The fen string consists of six smaller strings: Piece placement, active color,
        // castling rights, en passant target, halfmove clock, and fullmove number.
        let piecePlacement = this.constructPiecePlacement();
        let activeColor = this.activeColor;
        let castlingRights = this.getCastlingRights();
        let enPassantTarget = this.enPassantTargetReadable;
        let halfmoveClock = this.halfmoveClock;
        let fullmoveNumber = this.fullmoveNumber;
        let newFen;
        
        newFen = `${piecePlacement} ${activeColor} ${castlingRights} ${enPassantTarget} ${halfmoveClock} ${fullmoveNumber}`;

        this.fen = newFen;
    }

    /*
    * @param originalFile - Letter representing the original square's file.
    * @param originalRank - Number representing the original square's rank (starting from 1)
    * @param destinationFile - Letter representing the destination square's file
    * @param destinationRank - Number representing the destination square's rank (starting from 1)
    * @param piece - Letter representing the piece. A capital letter is a white piece while a
    *   lowercase letter is a black piece.
    */
    movePieceToEmptySquare(originalFile, originalRank, destinationFile, destinationRank, piece) {
        
        // Convert letter into a numeric value
        const originalFileIndex = originalFile.toLowerCase().charCodeAt(0) - 97;
        const destinationFileIndex = destinationFile.toLowerCase().charCodeAt(0) - 97;

        // Correctly calculate the index for the ranks as well
        const originalRankIndex = 8 - originalRank;
        const destinationRankIndex = 8 - destinationRank;

        // Whenever we move a piece, we turn the square it occupied into an empty square.
        this.board[originalRankIndex][originalFileIndex] = "";

        // Then we have to change the destination square to "piece"
        this.board[destinationRankIndex][destinationFileIndex] = piece;

        // Whenever we move a piece, we also need to make sure we're performing a halfmove.
        this.nextHalfmove();

        // Reset en passant target if necessary
        if (piece !== "p" && piece !== "P") {
            this.enPassantTarget = "-";
        }

        this.constructFenString();
        return;
    }

    /*
    * @param originalFile - Letter representing the original square's file.
    * @param originalRank - Number representing the original square's rank (starting from 1)
    * @param destinationFile - Letter representing the destination square's file
    * @param destinationRank - Number representing the destination square's rank (starting from 1)
    * @param piece - Letter representing the piece. A capital letter is a white piece while a
    *   lowercase letter is a black piece.
    * 
    * The logic for capturing an enemy piece, in theory should be the same as moving to an empty square.
    */
    captureEnemyPiece(originalFile, originalRank, destinationFile, destinationRank, piece) {

        this.movePieceToEmptySquare(originalFile, originalRank, destinationFile, destinationRank, piece);

        // After we make the move, we should check if we have to remove castling rights
        // if we captured a rook on its home corner square.

        if(this.whiteCanCastleQueenside && this.board[7][0] !== "R") {
            this.whiteCanCastleQueenside = false;
            return;
        }
        if(this.whiteCanCastleKingside && this.board[7][7] !== "R") {
            this.whiteCanCastleKingside = false;
            return;
        }
        if(this.blackCanCastleQueenside && this.board[0][0] !== "r") {
            this.blackCanCastleQueenside = false;
            return;
        }
        if(this.blackCanCastleKingside && this.board[0][7] !== "r") {
            this.blackCanCastleKingside = false;
            return;
        }

    }

    /*
    * Capture an enemy piece with a pawn en passant.
    *
    * @param originalSquare    - The pawn's original square ex. [5, "b"]
    * @param destinationSquare - The pawn's destination ex. [6, "c"]
    */
    captureEnPassant(originalSquare, destinationSquare) {

        // Remove the pawn behind the capturing pawn from the board.
        let rank;
        let file = destinationSquare[1].toLowerCase().charCodeAt(0) - 97;
        if(this.activeColor === "w") {
            rank = 3;
        } else {
            rank = 4;
        }
        this.board[rank][file] = "";

        // Move the capturing pawn to the correct square.
        if(this.activeColor === "w") {
            this.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], "P");
        }
        else {
            this.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], "p");
        }
        this.enPassantTarget = "-";
        this.enPassantTargetReadable = "-";
    }

    /*
    * Performs a halfmove. Updates activeColor, enPassantTarget, halfmoveClock, and fullmoveNumber.
    */
    nextHalfmove(enPassantTarget = "-", reset50MoveRule = false) {
        // activeColor is the player whose move it is
        if(this.activeColor === "w") {
            this.activeColor = "b";
        } else {
            this.activeColor = "w";
            this.fullmoveNumber++;
        }

        // halfmoveClock is the number of halfmoves since the last piece capture or pawn move.
        // Used to enforce the 50-move rule.
        if(reset50MoveRule === true) {
            this.halfmoveClock = 0;
        } else {
            this.halfmoveClock++;
        }
    }

    /*
    * If the passed square is on the 8th rank for white, or the 1st rank for black, the pawn
    * is promoting, so return true.
    * 
    * @param destinationRank - Number representing the square's rank
    */
    isPawnPromoting(destinationRank) {

        

        if(this.activeColor === "w") {
            if(destinationRank === "8") {
                return true;
            }
            return false;
        }
        // Active color must be black
        else {
            if(destinationRank === "1") {
                return true;
            }
            return false;
        }
    }

    /*
    * Function that actually promotes a pawn.
    *
    * @param originalSquare - the square the pawn is moving from.
    * @param destinationSquare - the square the pawn is moving to.
    * @param promotedPiece - the kind of piece the pawn is promoting to.
    *   Accepted values are q, r, n, or b.
    */
    promotePawn(originalFile, originalRank, destinationFile, destinationRank, promotedPiece) {

        // Convert letter into a numeric value
        const originalFileIndex = originalFile.toLowerCase().charCodeAt(0) - 97;
        const destinationFileIndex = destinationFile.toLowerCase().charCodeAt(0) - 97;

        // Correctly calculate the index for the ranks as well
        const originalRankIndex = 8 - originalRank;
        const destinationRankIndex = 8 - destinationRank;

        // Whenever we move a piece, we turn the square it occupied into an empty square.
        this.board[originalRankIndex][originalFileIndex] = "";

        // Letter becomes uppercase if it's white's turn, or lowercase if it's black's turn.
        if( this.activeColor === "w" ) {
            promotedPiece = promotedPiece.toUpperCase();
        } else {
            promotedPiece = promotedPiece.toLowerCase();
        }

        // Then we have to change the destination square to "promotedPiece"
        this.board[destinationRankIndex][destinationFileIndex] = promotedPiece;

        // Whenever we move a piece, we also need to make sure we're performing a halfmove.
        this.nextHalfmove();

        this.constructFenString();
        return;
    }

    /*
    * Returns "not mate" if there is no mate,
    * "checkmate" if active player won by checkmate,
    * or "stalemate" if active player stalemated their opponent.
    * If there is a mate, modify this.result to log the game
    * result.
    */
    isMate() {

        let kingPosition;
        if(this.activeColor === "w") {
            kingPosition = this.findWhiteKing();
        } else if(this.activeColor === "b") {
            kingPosition = this.findBlackKing();
        }

        let isThereAValidMove;
        let playerChecked = this.isPlayerChecked();
        if(this.activeColor === "w") {
            isThereAValidMove = this.findAValidWhiteMove(kingPosition);
        } else if(this.activeColor === "b") {
            isThereAValidMove = this.findAValidBlackMove(kingPosition);
        }

        console.log(`isMate vars: ${isThereAValidMove}, ${playerChecked}`);
        
        if(!isThereAValidMove && playerChecked) {
            if(this.activeColor === "w") {
                this.result = "Black won by checkmate";
            } else if(this.activeColor === "b") {
                this.result = "White won by checkmate";
            }
            return "checkmate";
        }
        if(!isThereAValidMove && !this.isPlayerChecked()) {
            this.result = "stalemate";
            return "stalemate";
        }
        return "not mate";
    }

    //TODO: This function tries every square to see if there's a piece
    //TODO: of the same color as active player. There will be a switch
    //TODO: statement for various pieces then we should simulate all
    //TODO: the possible moves for that piece.
    /*
    * Returns true if there is a legal move for white.
    */
    findAValidWhiteMove(kingPosition) {
        let piece;
        // These 2 loops are going through the 64 squares
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                console.log(`Checking ${i}${j} square.`);
                piece = this.board[i][j];
                switch(piece) {
                    case "P":
                        if(this.findAValidWhitePawnMove([i, j])) {
                            return true;
                        }
                        break;
                    case "R":
                        if(this.findAValidRookMove([i, j])) {
                            return true;
                        }
                        break;
                    case "N":
                        if(this.findAValidKnightMove([i, j])) {
                            return true;
                        }
                        break;
                    case "B":
                        if(this.findAValidBishopMove([i, j])) {
                            return true;
                        }
                        break;
                    case "Q":
                        if(this.findAValidQueenMove([i, j])) {
                            return true;
                        }
                        break;
                    case "K":
                        if(this.findAValidKingMove([i, j])) {
                            return true;
                        }
                        break;
                    default: // Empty square or black piece
                        break;
                }
            }
        }
        return false;
    }

    /*
    * Returns true if there is a legal move for black.
    */
    findAValidBlackMove() {
        let piece;
        // Double-loop to iterate over all the squares on the board
        // For current test: I'm looking for i = 1 and j = 2
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                piece = this.board[i][j];
                switch(piece) {
                    case "p":
                        if(this.findAValidBlackPawnMove([i, j])) {
                            return true;
                        }
                        break;
                    case "r":
                        if(this.findAValidRookMove([i, j])) {
                            return true;
                        }
                        break;
                    case "n":
                        if(this.findAValidKnightMove([i, j])) {
                            return true;
                        }
                        break;
                    case "b":
                        if(this.findAValidBishopMove([i, j])) {
                            return true;
                        }
                        break;
                    case "q":
                        if(this.findAValidQueenMove([i, j])) {
                            return true;
                        }
                        break;
                    case "k":
                        if(this.findAValidKingMove([i, j])) {
                            return true;
                        }
                        break;
                    default: // Empty square or white piece
                        break;
                }
            }
        }
        return false;
    }

    /*
    * Returns true if active player's king is under attack.
    */
    isPlayerChecked() {

        let kingPosition;
        if(this.activeColor === "w") {
            kingPosition = this.findWhiteKing();
            return this.isWhitePlayerChecked(kingPosition);
        } else if(this.activeColor === "b") {
            kingPosition = this.findBlackKing();
            return this.isBlackPlayerChecked(kingPosition);
        }
    }

    /*
    * Returns true if the white player's king is under attack.
    */
    isWhitePlayerChecked(kingPosition) {
        return canAnyBlackPieceAttackSquare(this.board, kingPosition);
    }

    /*
    * Returns true if the black player's king is under attack.
    */
    isBlackPlayerChecked(kingPosition) {
        return canAnyWhitePieceAttackSquare(this.board, kingPosition);
    }

    /*
    * Returns an array containing indices of the white king's location
    */
    findWhiteKing() {
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                if(this.board[i][j] === "K") {
                    return [i, j];
                }
            }
        }
        throw new Error("White King was not found.");
    }

    /*
    * Returns an array containing indices of the black king's location
    */
    findBlackKing() {
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                if(this.board[i][j] === "k") {
                    return [i, j];
                }
            }
        }
        throw new Error("Black King was not found.");
    }

    //TODO: Finish the "findAValidWhitePawnMove" and "findAValidBlackPawnMove" function
    //TODO: The game still runs but I'm still not detecting checkmate as intended. Why?

    /*
    * Returns true if a white pawn on the given square has a valid move.
    *
    * @param pawnPosition - coordinates of the pawn. eg. [0, 6] is a2.
    */
    findAValidWhitePawnMove(pawnPosition) {
        // Create a var that represents whether a forward pawn move has been found,
        // and another var that represents whether a capture has been found. Return
        // true if either has been found.
        const thereIsValidForwardMove = this.findAValidWhiteForwardPawnMove(pawnPosition);
        const thereIsValidCapture = this.findAValidWhitePawnCapture(pawnPosition);
        return thereIsValidForwardMove || thereIsValidCapture;
    }

    /*
    * Returns true if the white pawn on the given square has a valid forward pawn move.
    *
    * @param pawnPosition - coordinates of the pawn. eg. [0, 6] is a2.
    */
    //TODO: This function is problematic during fool's mate, 1.f3 e6 2.g4 Qh4#
    findAValidWhiteForwardPawnMove(pawnPosition) {
        let candidateSquares = [];
        
        if(pawnPosition[0] === 6) {
            // The white pawn is on the second rank, meaning it can move two squares
            candidateSquares.push([3, indexToLetter(pawnPosition[1])]);
            candidateSquares.push([4, indexToLetter(pawnPosition[1])]);
        }
        else {
            // The white pawn is on another rank, meaning it can only move one square.
            candidateSquares.push([9 - pawnPosition[0], indexToLetter(pawnPosition[1])]);
        }
        for(let square of candidateSquares) {
            let convertedOriginalSquare = [8 - pawnPosition[0], indexToLetter(pawnPosition[1])];
            if(this.isSquareEmpty(square[1], square[0])) {
                if(this.isPathEmpty([8 - pawnPosition[0], indexToLetter(pawnPosition[1])], 
                [square[0], indexToLetter(square[1])])) {
                    if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, [...square], "P", this.activeColor)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /*
    * Returns true if the pawn on the given square has a valid capture.
    *
    * @param pawnPosition - coordinates of the pawn. eg. [0, 6] is a2.
    */
   //TODO: Finish this function to tick off my last test case
    findAValidWhitePawnCapture(pawnPosition) {
        let candidateSquares = [];
        
        // Helper function to validate rank and file coordinates
        function isValidCoordinate(rank, file) {
            return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
        }

        const rank = pawnPosition[0] - 1;
        const fileRight = pawnPosition[1] + 1;
        const fileLeft = pawnPosition[1] - 1;

        if (isValidCoordinate(rank, fileRight)) {
            candidateSquares.push([8-rank, indexToLetter(fileRight)]);
        }
    
        if (isValidCoordinate(rank, fileLeft)) {
            candidateSquares.push([8-rank, indexToLetter(fileLeft)]);
        }

        for(let square of candidateSquares) {
            let convertedOriginalSquare = [8 - pawnPosition[0], indexToLetter(pawnPosition[1])];
            if(this.isSquareOccupiedByEnemyPiece(convertedOriginalSquare[1], convertedOriginalSquare[0], square[1], square[0], "P")) {
                if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, [...square], "P", this.activeColor)) {
                    return true;
                }
            }
        }
        return false;
    }

    /*
    * Returns true if a black pawn on the given square has a valid move.
    *
    * @param pawnPosition - coordinates of the pawn. eg. [0, 6] is a2.
    */
    findAValidBlackPawnMove(pawnPosition) {
        const thereIsValidForwardMove = this.findAValidBlackForwardPawnMove(pawnPosition);
        const thereIsValidCapture = this.findAValidBlackPawnCapture(pawnPosition);
        return thereIsValidForwardMove || thereIsValidCapture;
    }

    /*
    * Returns true if a black pawn on the given square has a valid forward move.
    *
    * @param pawnPosition - coordinates of the pawn. eg. [0, 6] is a2.
    */
    findAValidBlackForwardPawnMove(pawnPosition) {
        //alert(`Looking for valid pawn move for ${pawnPosition[0]}${pawnPosition[1]} square.`);
        // candidateSquares array should hold squares in the format [5, "e"]
        let candidateSquares = [];

        if(pawnPosition[0] === 1) {
            // The black pawn is on the seventh rank, meaning it can move two squares
            candidateSquares.push([6, indexToLetter(pawnPosition[1])]);
            candidateSquares.push([5, indexToLetter(pawnPosition[1])]);
        }
        else {
            // The black pawn is on another rank, meaning it can only move one square.
            candidateSquares.push([7 - pawnPosition[0], indexToLetter(pawnPosition[1])]);
        }

        for(let square of candidateSquares) {
            let convertedOriginalSquare = [8 - pawnPosition[0], indexToLetter(pawnPosition[1])];
            //TODO: Make sure the candidate square is empty, the path to that square is empty, and call validateMoveSafety
            if(this.isSquareEmpty(square[1], square[0])) {
                if(this.isPathEmpty([8 - pawnPosition[0], indexToLetter(pawnPosition[1])], 
                [square[0], indexToLetter(square[1])])) {
                    if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, [...square], "P", this.activeColor)) {
                        //TODO: This must be returning true when it shouldn't.
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //TODO: Finish this function to tick off my last test case
    findAValidBlackPawnCapture(pawnPosition) {
        let candidateSquares = [];
        
        // Helper function to validate rank and file coordinates
        function isValidCoordinate(rank, file) {
            return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
        }

        const rank = pawnPosition[0] + 1;
        const fileRight = pawnPosition[1] + 1;
        const fileLeft = pawnPosition[1] - 1;

        if (isValidCoordinate(rank, fileRight)) {
            candidateSquares.push([8-rank, indexToLetter(fileRight)]);
        }
    
        if (isValidCoordinate(rank, fileLeft)) {
            candidateSquares.push([8-rank, indexToLetter(fileLeft)]);
        }

        for(let square of candidateSquares) {
            let convertedOriginalSquare = [8 - pawnPosition[0], indexToLetter(pawnPosition[1])];
            if(this.isSquareOccupiedByEnemyPiece(convertedOriginalSquare[1], convertedOriginalSquare[0], square[1], square[0], "p")) {
                if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, [...square], "p", this.activeColor)) {
                    return true;
                }
            }
        }
        return false;
    }

    /*
    * Returns true if a rook on the given square has a valid move.
    * Let's say the rook can only capture black pieces if
    * activeColor is w or white pieces if activeColor is b
    * 
    * @param rookPosition - coordinates of the rook. eg. [0, 7] is h8.
    */
    findAValidRookMove(rookPosition) {

        // candidateSquares should hold potential destination squares in
        // the format [6, "b"]
        let candidateSquares = [];
        let rank = rookPosition[0];
        let file = rookPosition[1];

        let rookLetter;
        if(this.activeColor === "w") {
            rookLetter = "R";
        } else if(this.activeColor === "b") {
            rookLetter = "r";
        }

        const directions = [
            [1, 0], // Down
            [0, 1], // Right
            [-1, 0], // Up
            [0, -1] // Left
        ];

        // Iterate through each direction
        directions.forEach(([dx, dy]) => {
            let i = 1;
            while(true) {
                let newRank = rank + (i * dx);
                let newFile = file + (i * dy);
                // First check the square is in bounds
                if(!isInBounds(newRank, newFile)) {
                    break;
                }
                // Second break if the rook moves onto a friendly piece
                let pieceOnDest = this.board[newRank][newFile];
                if(pieceOnDest !== "") {
                    if(sameCase(rookLetter, pieceOnDest)) {
                        break;
                    }
                }
                // Third, push to candidateSquares
                candidateSquares.push([8 - newRank, indexToLetter(newFile)]);

                // Fourth, break if the rook moves onto ANY piece
                if(pieceOnDest !== "") {
                    break;
                }
                i++;
            }
        });
        
        const convertedOriginalSquare = [8 - rookPosition[0], indexToLetter(rookPosition[1])];

        for(let square of candidateSquares) {
            if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, square, rookLetter, this.activeColor)) {
                return true;
            }
        }
        return false;
    }

    /*
    * Returns true if a knight on the given square has a valid move.
    *
    * @param knightPosition - coordinates of the knight. eg. [1, 7] is b1.
    */
    findAValidKnightMove(knightPosition) {
        let candidateSquares = [];

        // Helper function to determine if the coordinates are in bounds
        const isInBounds = (x, y) => x >= 0 && x <= 7 && y >= 0 && y <= 7;

        let knightLetter;
        if(this.activeColor === "w") {
            knightLetter = "N";
        } else if(this.activeColor === "b") {
            knightLetter = "n";
        }
        let whiteKnight = knightLetter === "N";
        let blackKnight = knightLetter === "n";

        let potentialMoves = [
            [knightPosition[0] + 2, knightPosition[1] + 1],
            [knightPosition[0] + 2, knightPosition[1] - 1],
            [knightPosition[0] + 1, knightPosition[1] + 2],
            [knightPosition[0] + 1, knightPosition[1] - 2],
            [knightPosition[0] - 1, knightPosition[1] + 2],
            [knightPosition[0] - 1, knightPosition[1] - 2],
            [knightPosition[0] - 2, knightPosition[1] + 1],
            [knightPosition[0] - 2, knightPosition[1] - 1]
        ];

        for(let move of potentialMoves) {
            if(isInBounds(move[0], move[1])) {
                let thisSq = this.board[move[0]][move[1]];
                let isEmpty = move === "";
                let isUpperCase = thisSq === thisSq.toUpperCase();
                let isLowerCase = thisSq === thisSq.toLowerCase();
                
                if(whiteKnight && (isEmpty || isLowerCase)) {
                    candidateSquares.push([8 - move[0], indexToLetter(move[1])]);
                }
                
                else if(blackKnight && (isEmpty || isUpperCase)) {
                    candidateSquares.push([8 - move[0], indexToLetter(move[1])]);
                }
            }
        }

        for(let square of candidateSquares) {
            const convertedOriginalSquare = [8 - knightPosition[0], indexToLetter(knightPosition[1])];
            if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, square, knightLetter, this.activeColor)) {
                return true;
            }
        }
        return false;
    }

    /*
    * Returns true if a bishop on the given square has a valid move.
    *
    * @param bishopPosition - coordinates of the bishop. eg. [2, 7] is c1.
    */
    findAValidBishopMove(bishopPosition) {
        // candidateSquares should hold potential squares in the format [5, "c"]
        let candidateSquares = [];
        let rank = bishopPosition[0];
        let file = bishopPosition[1];
        let bishopLetter;
        if(this.activeColor === "w") {
            bishopLetter = "B";
        } else if(this.activeColor === "b") {
            bishopLetter = "b";
        }

        // Directional vectors for the bishop
        const directions = [
            [1, 1], // Down-right
            [1, -1], // Down-left
            [-1, 1], // Up-right
            [-1, -1] // Up-left
        ];

        // Iterate through each direction
        directions.forEach(([dx, dy]) => {
            let i = 1;
            while(true) {
                let newRank = rank + (i * dx);
                let newFile = file + (i * dy);
                // First check the square is on bounds
                if(!isInBounds(newRank, newFile)) {
                    break;
                }
                // Second break if the bishop moves onto a friendly piece
                let pieceOnDest = this.board[newRank][newFile];
                if(pieceOnDest !== "") {
                    if(sameCase(bishopLetter, pieceOnDest)) {
                        break;
                    }
                }
                // Third, push to candidateSquares
                candidateSquares.push([8 - newRank, indexToLetter(newFile)]);

                // Fourth, break if the bishop moves onto ANY piece
                if(pieceOnDest !== "") {
                    break;
                }
                i++;
            }
        });

        for(let square of candidateSquares) {
            const convertedOriginalSquare = [8 - bishopPosition[0], indexToLetter(bishopPosition[1])];

            if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, square, bishopLetter, this.activeColor)) {
                return true;
            }
        }
        return false;
    }

    /*
    * Returns true of a queen on the given square has a valid move.
    *
    * @param queenPosition - coordinates of the queen. eg. [3, 7] is d1.
    */
    findAValidQueenMove(queenPosition) {
        // candidateSquares should hold potential squares in the format [5, "c"]
        let candidateSquares = [];
        let rank = queenPosition[0];
        let file = queenPosition[1];
        let queenLetter;
        if(this.activeColor === "w") {
            queenLetter = "Q";
        } else if(this.activeColor === "b") {
            queenLetter = "q";
        }

        // Directional vectors for the bishop
        const directions = [
            [1, 1], // Down-right
            [1, 0], // Down
            [1, -1], // Down-left
            [0, -1], // Left
            [-1, -1], // Up-left
            [-1, 0], // Up
            [-1, 1], // Up-right
            [0, 1] // Right
        ];

        // Iterate through each direction
        directions.forEach(([dx, dy]) => {
            let i = 1;
            while(true) {
                let newRank = rank + (i * dx);
                let newFile = file + (i * dy);
                // First check the square is in bounds
                if(!isInBounds(newRank, newFile)) {
                    break;
                }
                // Second break if the piece moved onto a friendly piece
                let pieceOnDest = this.board[newRank][newFile];
                if(pieceOnDest !== "") {
                    if(sameCase(queenLetter, pieceOnDest)) {
                        break;
                    }
                }
                // Third, push to candidateSquares
                candidateSquares.push([8 - newRank, indexToLetter(newFile)]);

                // Fourth, break if the queen moved onto ANY piece
                if(pieceOnDest !== "") {
                    break;
                }
                i++;
            }
        });

        for(let square of candidateSquares) {
            const convertedOriginalSquare = [8 - queenPosition[0], indexToLetter(queenPosition[1])];

            if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, square, queenLetter, this.activeColor)) {
                return true;
            }
        }
        
        return false;
    }

    /*
    * Returns true of the king on the given square has a valid move.
    *
    * @param kingPosition - coordinates of the king. eg. [4, 7] is e1.
    */
    findAValidKingMove(kingPosition) {
        
        // candidateSquares should hold potential squares in the format [5, "c"]
        let candidateSquares = [];
        let rank = kingPosition[0];
        let file = kingPosition[1];
        let kingLetter;
        if(this.activeColor === "w") {
            kingLetter = "K";
        } else if(this.activeColor === "b") {
            kingLetter = "k";
        }

        // Directional vectors for the bishop
        const directions = [
            [1, 1], // Down-right
            [1, 0], // Down
            [1, -1], // Down-left
            [0, -1], // Left
            [-1, -1], // Up-left
            [-1, 0], // Up
            [-1, 1], // Up-right
            [0, 1] // Right
        ];

        for (let [dx, dy] of directions) {
            let newRank = rank + dx;
            let newFile = file + dy;
        
            // Skip this direction if the square is out of bounds
            if (!isInBounds(newRank, newFile)) {
                continue;
            }
        
            let pieceOnDest = this.board[newRank][newFile];
            // Skip this direction if the square contains a friendly piece
            if (pieceOnDest !== "" && sameCase(kingLetter, pieceOnDest)) {
                continue;
            }
        
            // Add to candidateSquares if the square is valid
            candidateSquares.push([8 - newRank, indexToLetter(newFile)]);
        }

        for(let square of candidateSquares) {
            const convertedOriginalSquare = [8 - kingPosition[0], indexToLetter(kingPosition[1])];

            if(validateMoveSafety(this.board.map(row => [...row]), convertedOriginalSquare, square, kingLetter, this.activeColor)) {
                return true;
            }
        }
        
        return false;
    }

    // Implement checkmate detection and end the game
    // 1) Create the isMate function
    // 2) isCheckmateOrStalemate calls findAValidMove to make sure there's at least
    // one valid move for the current player.
    // 3) This function tries every square until it finds a piece belonging to
    // that player. Then it calls the function getAllPossibleMovesForPiece.
    // 4) Depending on which piece it is passed, getAllPossibleMovesForPiece calls
    // the piece-specific function getAllPossiblePawnMoves, getAllPossibleRookMoves,
    // and so forth.
    // 5) I'll think about the specific details of these piece-specific functions later.
}

module.exports = ChessboardClass;