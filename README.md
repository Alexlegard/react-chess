# Super Reactive Chess

I started this project in the middle of my 100 Days of Code challenge 2024. It's been a long journey, but I'm happy to say that I've developed the game to a completed state.

# Learning philosophy

There are already React chess tutorials that exist on Youtube. While I could follow one of those tutorials, I decided to take on this journey on my own (with a little help from the helpful folks at Coffee 'n' Code). I didn't want to follow a tutorial line for line because anyone can do that and I don't want to code like a robot.

# Features

The game is still pretty minimal. The players can play moves following the rules of Chess. As you'd expect, players cannot make moves that put their king in danger. Once checkmate has been reached, further moves are disabled and one player is declared the winner.

# Notable files

<b>Board component hierarchy:</b> Game, Chessboard, Square
<b>Game state class:</b> ChessboardClass
<b>Move validator (make sure king is not in danger):</b> ValidateMoveSafety
<b>Piece movement logic: </b> pawnLogic, rookLogic, knightLogic, bishopLogic, kingLogic, queenLogic
<b>Test files:</b> checkmateTest, chessboardClass, validateMoveSafety

# Most hated chess piece

Pawns, because they have so many different rules. Writing logic related to pawns has been extremely challenging.