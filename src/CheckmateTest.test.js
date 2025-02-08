import ChessboardClass from './ChessboardClass';

// 1
test("Scholar's mate is checkmate", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "k", "", "", "r"],
        ["p", "p", "p", "p", "", "Q", "p", "p"],
        ["", "", "", "", "", "n", "", ""],
        ["", "", "b", "", "p", "", "", ""],
        ["", "", "B", "", "P", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "", "N", "R"]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 2
test("Black can escape scholar's mate with a rook capture", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "k", "r", "", ""],
        ["p", "p", "p", "p", "", "Q", "p", "p"],
        ["", "", "", "", "", "n", "", ""],
        ["", "", "b", "", "p", "", "", ""],
        ["", "", "B", "", "P", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "", "N", "R"]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 3
test("Black can escape scholar's mate with a knight capture", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "k", "", "", "r"],
        ["p", "p", "p", "p", "", "Q", "p", "p"],
        ["", "", "", "", "", "", "", "n"],
        ["", "", "b", "", "p", "", "", ""],
        ["", "", "B", "", "P", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "", "N", "R"]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 4
test("Black can escape scholar's mate with a bishop capture", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "k", "", "b", "r"],
        ["p", "p", "p", "p", "", "Q", "p", "p"],
        ["", "", "", "", "", "n", "", ""],
        ["", "", "b", "", "p", "", "", ""],
        ["", "", "B", "", "P", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "", "N", "R"]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 5
test("Black can escape scholar's mate with a queen capture", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "k", "", "q", "r"],
        ["p", "p", "p", "p", "", "Q", "p", "p"],
        ["", "", "", "", "", "n", "", ""],
        ["", "", "b", "", "p", "", "", ""],
        ["", "", "B", "", "P", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "", "N", "R"]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 6
test("Black can escape scholar's mate with a king capture", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "k", "", "", "r"],
        ["p", "p", "p", "p", "", "Q", "p", "p"],
        ["", "", "", "", "", "n", "", ""],
        ["", "", "b", "", "p", "", "", ""],
        ["", "", "", "", "P", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "", "N", "R"]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 7
test("Black can escape checkmate with a pawn capture", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "", "", "", "r"],
        ["", "p", "p", "p", "", "", "p", "p"],
        ["p", "", "", "", "", "n", "", ""],
        ["k", "Q", "b", "", "p", "", "", ""],
        ["", "", "B", "", "P", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "", "N", "R"]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 8
test("Black can escape scholar's mate by moving the king to safety", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
    ["r", "n", "b", "", "k", "", "", "r"],
    ["p", "p", "p", "p", "", "Q", "p", "p"],
    ["", "", "", "", "", "n", "", ""],
    ["", "", "b", "", "p", "", "", ""],
    ["", "", "B", "", "P", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "", "P", "P", "P"],
    ["R", "N", "B", "", "K", "", "N", "R"]
]);
    expect(board.isMate()).toBe("not mate");
});

// 9
test("White is checkmated by back rank mate", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "P", "P", "P"],
        ["q", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 10
test("White can block back rank mate with a rook", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "R", "P", "P", "P"],
        ["q", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 11
test("White can block back rank mate with a knight", () => {

    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "N", "", ""],
        ["", "", "", "", "", "P", "P", "P"],
        ["q", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 12
test("White can block back rank mate with a bishop", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["B", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "P", "P", "P"],
        ["q", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 13
test("White can block back rank mate with a queen", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "Q", "", "", "", "", "", ""],
        ["", "", "", "", "", "P", "P", "P"],
        ["q", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 14
test("White can escape back rank mate by capturing the queen", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["R", "", "", "", "", "", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "P", "P", "P"],
        ["q", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 15
test("White can escape back rank mate by moving the king to safety", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "P", "P", ""],
        ["q", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("not mate");
});

// 16
test("Black is stalemated in the corner", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "Q", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("stalemate");
});

// 17
test("Black is stalemated in the corner, and has some extra pieces that can't move", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["n", "", "", "", "", "", "", "k"],
        ["", "", "p", "", "", "Q", "", ""],
        ["", "p", "P", "", "", "", "", ""],
        ["", "P", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("stalemate");
});

// 18
test("Anastasia's mate", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "N", "", "p", "k"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "R"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 19
test("Arabian mate", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["", "", "", "", "", "", "", "k"],
        ["", "", "", "", "", "", "", "R"],
        ["", "", "", "", "", "N", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 20
test("Smothered mate", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["", "", "", "", "", "", "r", "k"],
        ["", "", "", "", "", "N", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 21
test("Dovetail mate", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "p", ""],
        ["", "", "", "", "", "q", "k", ""],
        ["", "", "", "", "", "", "", "Q"],
        ["", "", "", "", "", "", "K", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 22
test("Ladder mate", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["R", "", "", "", "", "", "", "k"],
        ["", "R", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["K", "", "", "", "", "", "", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 23
test("Fool's mate (white)", () => {
    const board = new ChessboardClass();
    board.setActiveColor("b");
    board.setBoard([
        ["r", "n", "b", "q", "k", "b", "n", "r"],
        ["p", "p", "p", "p", "p", "", "", "p"],
        ["", "", "", "", "", "p", "", ""],
        ["", "", "", "", "", "", "p", "Q"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "P", "", "", ""],
        ["P", "P", "P", "P", "", "P", "P", "P"],
        ["R", "N", "B", "", "K", "B", "N", "R"]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 24
test("Fool's mate (black)", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["r", "n", "b", "", "k", "b", "n", "r"],
        ["p", "p", "p", "p", "", "p", "p", "p"],
        ["", "", "", "", "p", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "P", "q"],
        ["", "", "", "", "", "P", "", ""],
        ["P", "P", "P", "P", "P", "", "", "P"],
        ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 25 Anastasia's mate (black)
test("Anastasia's mate (black)", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["k", "", "", "", "", "", "", "r"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "n", "", "P", "K"],
        ["", "", "", "", "", "", "", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 26 Arabian mate (black)
test("Arabian mate (black)", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["k", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "n", "", ""],
        ["", "", "", "", "", "", "", "r"],
        ["", "", "", "", "", "", "", "K"]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 27 Smothered mate (black)
test("Smothered mate (black)", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["k", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "n", "P", "P"],
        ["", "", "", "", "", "", "R", "K"]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 28 Dovetail mate (black)
test("Dovetail mate (black)", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "k", "", ""],
        ["", "", "", "", "q", "", "", ""],
        ["", "", "P", "K", "", "", "", ""],
        ["", "", "", "P", "", "", "", ""],
        ["", "", "", "", "", "", "", ""]
    ]);
    expect(board.isMate()).toBe("checkmate");
});

// 29 Ladder mate (black)
test("Ladder mate (black)", () => {
    const board = new ChessboardClass();
    board.setActiveColor("w");
    board.setBoard([
        ["k", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["r", "", "", "", "", "", "", ""],
        ["", "r", "", "", "", "", "", "K"]
    ]);
    expect(board.isMate()).toBe("checkmate");
});