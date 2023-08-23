function startGame(row, col){
    canvasSetup(row, col);
    drawBoard();
    clickedCircles();
}

function drawBoard(){
    for (let i = 0; i < rows; i++) {
        circles[i] = [];
        for (let j = 0; j < cols; j++) {
            drawCircle(Math.floor((wh * i) + height), Math.floor((ww * j) + width), circle_color);
            circles[i].push({
                x: Math.floor((wh * i) + height),
                y: Math.floor((ww * j) + width),
                visited: false
            });
        }
    }   
}
