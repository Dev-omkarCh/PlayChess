function clearChessData(){
    localStorage.removeItem("state");
    localStorage.removeItem("reload");
    localStorage.removeItem("roomId");
    localStorage.removeItem("playerColor");
    localStorage.removeItem("gameExists");
};

export default clearChessData;