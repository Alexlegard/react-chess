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
        this.startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        
        this.board = this.startingBoard;
        this.fen = this.startingFen;

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

        debugger;

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

        alert(`rookSquare: ${rookSquare}`);

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
    }

    /* Checks if a square is empty.
    *
    * test params: "a", 3
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

        //Return true if distance between the 2 squares is 1 or 0
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

        // a file = 0, h file = 7
        // 8th rank = 0, 1st rank = 7
        // (there seems to be an off-by-1 error with this code)
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
        debugger;
        return this.enPassantTarget;
    }

    getEnPassantTargetReadable() {
        debugger;
        return this.enPassantTargetReadable;
    }

    setEnPassantTarget(file, rank) {
        debugger;
        this.enPassantTarget = [file, rank];
        this.enPassantTargetReadable = `${file}${rank}`;
        this.constructFenString();
    }

    deselectEnPassantTarget() {
        debugger;
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
        debugger;
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
        debugger;
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

        debugger;

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
}

module.exports = ChessboardClass;