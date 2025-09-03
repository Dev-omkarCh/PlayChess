

const saveGame = async ( gameData ) =>{
    // this function will run every time the game page is reloaded and when a result is declared
    // it will in save game on first reload with initailBoard, playerTurn("white"), gameStatus("ongoing"), winner(null), moveHistory({ you: [], opponent: [] }), capturedPieces({ you: [], opponent: [] }),
    // if reload happens then only it will save the game else, on the end of the game it will update the game with final board, gameStatus("won" or "lost" or "draw"), winner("white" or "black" or "draw"), moveHistory, capturedPieces
    
    // all Data to store
    // 1. roomId
    // 2. board
    // 3. playerTurn
    // 4. gameStatus
    // 5. winner
    // 6. moveHistory
    // 7. capturedPieces
    // 8. whitePlayerId
    // 9. blackPlayerId
    // 10. playerColor

    // gameData = { roomId, board, playerTurn, gameStatus, winner, moveHistory, capturedPieces, whitePlayerId, blackPlayerId, playerColor }

    

};

const saveGameState = ( gameData ) => {

};

export {
    saveGameState,
    saveGameState
};