let castlingMixin = {
    getWhiteCanCastleKingside() {
        return this.whiteCanCastleKingside;
    },

    setWhiteCanCastleKingside(value) {
        this.whiteCanCastleKingside = value;
        this.constructFenString();
    },

    getWhiteCanCastleQueenside() {
        return this.whiteCanCastleQueenside;
    },

    setWhiteCanCastleQueenside(value) {
        this.whiteCanCastleQueenside = value;
        this.constructFenString();
    },

    getBlackCanCastleKingside() {
        return this.blackCanCastleKingside;
    },

    setBlackCanCastleKingside(value) {
        this.blackCanCastleKingside = value;
        this.constructFenString();
    },

    getBlackCanCastleQueenside() {
        return this.blackCanCastleQueenside;
    },

    setBlackCanCastleQueenside(value) {
        this.blackCanCastleQueenside = value;
        this.constructFenString();
    },

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
    },

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
    },

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
    },

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
    },

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
    },

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
}

module.exports = castlingMixin;