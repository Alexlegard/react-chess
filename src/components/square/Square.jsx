import React from 'react';
import './Square.css';
//import { useDrag, useDrop } from "react-dnd";

function Square(props) {

    const {rank, file, piece, onClick, selectedPiece} = props;
    // Define the type of the draggable item
    const droppableTypes = "PIECE";
    let isSelected;
    if(selectedPiece) {
        isSelected = (selectedPiece[0] === rank && selectedPiece[1] === file);
    }

    function letterToNumber(letter) {
        // Get the ASCII value of 'a'
        const asciiOfA = 'a'.charCodeAt(0);
        // Get the ASCII value of the input letter
        const asciiOfLetter = letter.charCodeAt(0);
        // Calculate the numeric value starting from 1
        const numericValue = asciiOfLetter - asciiOfA + 1;
        return numericValue;
    }
    let color;
    let pieceWord;
    let sum = parseInt(rank) + letterToNumber(file);
    if(sum % 2 === 0) {
        color = "dark-square";
    } else {
        color = "light-square";
    }

    let piecePath;
    switch(piece) {
        case "p":
            pieceWord = "pawn-black";
            piecePath = "/assets/images/pawn_b.png";
            break;
        case "r":
            pieceWord = "rook-black";
            piecePath = "/assets/images/rook_b.png";
            break;
        case "n":
            pieceWord = "knight-black";
            piecePath = "/assets/images/knight_b.png";
            break;
        case "b":
            pieceWord = "bishop-black";
            piecePath = "/assets/images/bishop_b.png";
            break;
        case "q":
            pieceWord = "queen-black";
            piecePath = "/assets/images/queen_b.png";
            break;
        case "k":
            pieceWord = "king-black";
            piecePath = "/assets/images/king_b.png";
            break;
        case "P":
            pieceWord = "pawn-white";
            piecePath = "/assets/images/pawn_w.png";
            break;
        case "R":
            pieceWord = "rook-white";
            piecePath = "/assets/images/rook_w.png";
            break;
        case "N":
            pieceWord = "knight-white";
            piecePath = "/assets/images/knight_w.png";
            break;
        case "B":
            pieceWord = "bishop-white";
            piecePath = "/assets/images/bishop_w.png";
            break;
        case "Q":
            pieceWord = "queen-white";
            piecePath = "/assets/images/queen_w.png";
            break;
        case "K":
            pieceWord = "king-white";
            piecePath = "/assets/images/king_w.png";
            break;
        case "":
            piecePath = undefined;
            break;
    }

    let classStr;
    // Append the piece or no-piece part of the class name
    if(piecePath === undefined) {
        classStr = color + " no-piece";
    } else {
        classStr = color + " piece";
        classStr += " " + pieceWord;
    }
    if(isSelected) {
        classStr += " selected";
    }

    const handleClick = () => {
        // I want to make an alert saying we clicked on the square
        alert("Clicked on " + file + rank);
        // Call the onClick function passed from the parent component
        onClick(rank, file, piece);
    };

    return (
        <div className={classStr} onClick={handleClick} style={isSelected ? {backgroundColor: 'yellow'} : {}}>
            {piecePath ? <img src={piecePath} width="70" height="70" /> : null}
        </div>
    );
}

export default Square;