import useChessStore from "../store/chessStore";
import useAuth from "../store/useAuth";
import useFriendStore from "../store/useFriendStore";

export function calculateElo(playerRating, opponentRating, result, k = 32) {
  
    let newResult = 0;
    if(result === "win") newResult = 1;
    else if(result === "draw") newResult = 0.5;
    else if(result === "lose") newResult = 0;
  
    
    // Step 1: Calculate Expected Score
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    
    // Step 2: Calculate New Rating
    const newRating = playerRating + k * (newResult - expectedScore);

    console.log(`newRating: ${newRating},
      isRise: ${newResult},
      ratingCal: ${Math.round(newRating - playerRating)},
      `);
    
    // saveGame(room, white, black,notation,newResult,playerRating, newRating);
    return { newRating : Math.round(newRating), isRise : newResult, ratingCal : Math.round(newRating - playerRating) }
  }