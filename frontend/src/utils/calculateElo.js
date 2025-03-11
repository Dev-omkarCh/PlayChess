import { useFriend } from "../hooks/useFriend";
import useChessStore from "../store/chessStore";
import useSocketStore from "../store/socketStore";
import useAuth from "../store/useAuth";
import useFriendStore from "../store/useFriendStore";

export function calculateElo(playerRating, opponentRating, result, k = 32) {
  // const saveGame = useFriend().saveGame;
  // const saveGame = useFriendStore.getState().saveGame;

  console.log(playerRating, typeof(playerRating))
  console.log(opponentRating, typeof(opponentRating))

    const authUser = useAuth.getState().authUser;
    const opponent = useFriendStore.getState().opponent;
    const playerColor = useChessStore.getState().playerColor;

    let newResult = 0;
    if(result === "win") newResult = 1;
    else if(result === "draw") newResult = 0.5;
    else if(result === "lose") newResult = 0;
  
    
    // Step 1: Calculate Expected Score
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    
    // Step 2: Calculate New Rating
    const newRating = playerRating + k * (newResult - expectedScore);
    
    // saveGame(room, white, black,notation,newResult,playerRating, newRating);
    return { newRating : Math.round(newRating), isRise : newResult, ratingCal : Math.round(newRating - playerRating) }
  }