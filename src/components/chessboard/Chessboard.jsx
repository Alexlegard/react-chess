import React from 'react';
import Square from '../square/Square';
import './Chessboard.css';

function Chessboard(props) {

    const {fen, board, onClick, selectedPiece} = props;

    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const verticalAxis = ["8", "7", "6", "5", "4", "3", "2", "1"];
    let squares = [];
    let squareName;

    for(let j = 0; j < verticalAxis.length; j++) {
        for(let i = 0; i < horizontalAxis.length; i++) {
            
            // Make a Square
            squares.push(
                <Square
                    rank={verticalAxis[j]}
                    file={horizontalAxis[i]}
                    piece={board[j][i]}
                    onClick={onClick}
                    selectedPiece={selectedPiece}
                    key={`${j}${i}`} />
            );
        }
    }

    console.log(board);

    return (
        <div className="chessboard">
            { squares }
        </div>
    );
}

export default Chessboard;