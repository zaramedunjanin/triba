function startGame(row, col){
    canvasSetup(row, col);
    drawBoard();
    clickedCircles();
}
function drawBoard(){
    for (let i = 0; i < rows; i++) {
        circles[i] = [];
        for (let j = 0; j < rows; j++) {
            if(j > i + (rows/2) || j < i - (rows/2) || j < rows - i - (rows/2 + 1) || j > rows - i + (rows/2 -1)) {
                ctx.strokeStyle = bg_color;
                ctx.strokeRect(Math.floor((wh * i) + height), Math.floor((ww * j) + width), r, r);
                circles[i].push({
                    x: Math.floor((wh * i) + height),
                    y: Math.floor((ww * j) + width),
                    visited: true
                });
                
            }
            else{
                drawCircle(Math.floor((wh * i) + height), Math.floor((ww * j) + width), circle_color);
                circles[i].push({
                    x: Math.floor((wh * i) + height),
                    y: Math.floor((ww * j) + width),
                    visited: false
                });
            }
        }
    } 
}