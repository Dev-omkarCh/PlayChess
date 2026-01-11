function clearChessData(){
    localStorage.removeItem("state");
    localStorage.removeItem("reload");
    localStorage.removeItem("roomId");
    localStorage.removeItem("playerColor");
    localStorage.removeItem("gameExists");
    localStorage.removeItem("isGameActive");
    localStorage.removeItem("board");
    localStorage.removeItem("turn");
};

export default clearChessData;