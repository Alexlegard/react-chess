let pawnMixin = {
    getEnPassantTarget() {
        //debugger;
        return this.enPassantTarget;
    },

    getEnPassantTargetReadable() {
        //debugger;
        return this.enPassantTargetReadable;
    },

    setEnPassantTarget(file, rank) {
        //debugger;
        this.enPassantTarget = [file, rank];
        this.enPassantTargetReadable = `${file}${rank}`;
        this.constructFenString();
    },

    deselectEnPassantTarget() {
        //debugger;
        this.enPassantTarget = "-";
        this.enPassantTargetReadable = "-";
        this.constructFenString();
    },

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
    },

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
    },

    /*
    * Function that actually promotes a pawn.
    *
    * @param originalSquare - the square the pawn is moving from.
    * @param destinationSquare - the square the pawn is moving to.
    * @param promotedPiece - the kind of piece the pawn is promoting to.
    *   Accepted values are q, r, n, or b.
    */
    promotePawn(originalFile, originalRank, destinationFile, destinationRank, promotedPiece) {

        //debugger;

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

module.exports = pawnMixin;