const circle_color = '#4C5057',
bg_color = '#E0ECFF',
player_color = {A: '#C8433D', B: '#32B3E3'},
r = 15;
var replay_player = 'A'
var current_player = 'A';

function canvasSetup(row, col){
    c = document.getElementById("canvas"),
    ctx = c.getContext("2d");
    rows = row;
    cols = col;
    wh = c.height/rows;
    ww = c.width/cols;
    height = wh/2;
    width = ww/2;
    selected = [];
    circles = [];
    lines = [];

    document.getElementById("current-player").innerHTML = "Player "+current_player+" turn"
}


function clickedCircles() {
    elemLeft = c.offsetLeft + c.clientLeft,
    elemTop = c.offsetTop + c.clientTop;
    c.addEventListener('click', handleClick);
}


function handleClick(event) {
    let x = event.pageX - elemLeft;
    let y = event.pageY - elemTop;

    let i =  Math.floor(x / wh);
    let j = Math.floor(y / ww);

    let cx = Math.floor((wh * i)+height);
    let cy = Math.floor((ww * j)+width);

    let dx = cx - x;
    let dy = cy - y;

    if(dx*dx + dy*dy <= r*r){
        if(!circles[i][j].visited)
            inputCheck(cx, cy, i, j);
    }
}

function inputCheck(cx, cy, i, j){
    let length = selected.length;
    if(length <= 1){
        circles[i][j].visited = true;
        drawCircle(cx, cy, player_color[current_player]);
        selected.push({
            i: i,
            j: j
        });
    }
    if(length == 2 && isValidSelected(selected, cx, cy, i, j)){
        let middle = getSelected(selected, 1);
        let first = getSelected(selected, 0);
        let first_index = getSelectedIndex(selected,0);
        let middle_index = getSelectedIndex(selected,1);
        if(!Intersect(cx, cy, first.x, first.y) && !Intersect(cx, cy, middle.x, middle.y) && !Intersect(first.x, first.y, middle.x, middle.y)){
            
            circles[i][j].visited = true;

            drawCircle(cx, cy, player_color[current_player]);

            checkSubmatrix(i, j, middle_index.i, middle_index.j, current_player);
            checkSubmatrix(i, j, first_index.i, first_index.j, current_player);
            checkSubmatrix( middle_index.i, middle_index.j, first_index.i, first_index.j, current_player);

            drawLine(cx, cy, middle.x, middle.y, player_color[current_player]); 
            drawLine(cx, cy, first.x, first.y, player_color[current_player]);
            drawLine(middle.x, middle.y, first.x, first.y, player_color[current_player]);

            lines.push({
                x0: cx, 
                y0: cy,
                x1: first.x,
                y1: first.y
            },
            {
                x0: cx,
                y0: cy,
                x1: middle.x,
                y1: middle.y
            },
            {
                x0: first.x,
                y0: first.y,
                x1: middle.x,
                y1: middle.y
            });

            changePlayer(current_player);

        }
        else{
            circles[first_index.i][first_index.j].visited = false;
            circles[middle_index.i][middle_index.j].visited = false;
            circles[i][j].visited = false;
            drawCircle(first.x, first.y);
            drawCircle(middle.x, middle.y);
        }
        selected = [];
            if(!boardValid())
                endGame();
    }
}

function drawCircle(x, y, color = circle_color){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function drawLine(c1_x,c1_y, c2_x, c2_y, color = circle_color) {
    ctx.beginPath();
    ctx.moveTo(c1_x, c1_y);
    ctx.lineTo(c2_x, c2_y);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.lineWidth = 1;
}

function isValidSelected(selected, cx, cy, i, j){
    let first = getSelected(selected,0);
    let middle = getSelected(selected,1);
    let f_index = getSelectedIndex(selected,0);
    let m_index = getSelectedIndex(selected,1);

    if(cols != rows){
        if(Math.abs(m_index.i - f_index.i) == Math.abs(m_index.j - f_index.j)
            && Math.abs(m_index.i - i) == Math.abs(m_index.j - j) 
            && Math.abs(f_index.i - i) == Math.abs(f_index.j - j))
            return false;
        else
            return true;
    }

    m1 = Math.abs((middle.y - first.y)/(middle.x - first.x));
    m2 = Math.abs((cy - middle.y)/(cx - middle.x));
    if(m1 === m2)
        return false; 
    console.log(m1,m2);
    return true;
}

function checkSubmatrix(i1,j1,i2,j2, player){
    if((i1-i2)^2 > 1 || (j1-j2)^2 > 1){
        let x_begin= Math.min(i1,i2);
        let x_end = Math.max(i1,i2);
        let y_begin = Math.min(j1,j2);
        let y_end = Math.max(j1,j2);
        if(i1 == i2){
            for (let i = y_begin+1; i < y_end; i++) {
                if(!circles[i1][i].visited){
                    drawCircle(circles[i1][i].x, circles[i1][i].y, player_color[player] + '70');
                    circles[i1][i].visited = true;
                }
            } 
        }
        else if(j1 == j2){
            for (let i = x_begin+1; i < x_end; i++) {
                if(!circles[i][j1].visited){
                    drawCircle(circles[i][j1].x, circles[i][j1].y, player_color[player] + '70');
                    circles[i][j1].visited = true;
                }
            } 
        }
        else{
            for(let i = x_begin; i <= x_end; i++) {
                for(let j = y_begin; j <= y_end; j++){
                    let line_begin = circles[i1][j1];
                    let line_end = circles[i2][j2];
                    if(!circles[i][j].visited && circleIntersection(line_begin.x,line_begin.y,line_end.x,line_end.y, circles[i][j].x, circles[i][j].y, r)){
                        drawCircle(circles[i][j].x, circles[i][j].y, player_color[player] + '70');
                        circles[i][j].visited = true;
                    }
                }
            } 
        }
    }
}


function circleIntersection(x0,y0,x1,y1,cx,cy){
    if((x0 == cx && y0 == cy) ||(x1 == cx && y1 == cy))
        return false

    var dx=cx-x0;
    var dy=cy-y0;

    var dxx=x1-x0;
    var dyy=y1-y0;

    var t=(dx*dxx+dy*dyy)/(dxx*dxx+dyy*dyy);

    var x=x0+dxx*t;
    var y=y0+dyy*t;
    
    if(t<0){x=x0;y=y0;}
    if(t>1){x=x1;y=y1;}

    return( (cx-x)*(cx-x)+(cy-y)*(cy-y) < r*r );
}

//Code from https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
function lineIntersection(x0,y0,x1,y1,x2,y2,x3,y3){
    if ((x0 === x2 && y0 === y2)
     || (x1 === x2 && y1 === y2)
     || (x0 === x3 && y0 === y3)
     || (x1 === x3 && y1 === y3)) {
        return false;
    }

    d = ((y3 - y2) * (x1 - x0) - (x3 - x2) * (y1 - y0));

    if (d === 0) {
        return false;
    }

    let ua = ((x3 - x2) * (y0 - y2) - (y3 - y2) * (x0 - x2)) / d;
    let ub = ((x1 - x0) * (y0 - y2) - (y1 - y0) * (x0 - x2)) / d;

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }
    return true;
}


function Intersect(x0, y0, x1, y1) {
    if (lines.length < 1){
        return false;
    }
    for(let i = 0; i < lines.length; i++){
        let x2 = lines[i].x0,
            y2 = lines[i].y0,
            x3 = lines[i].x1,
            y3 = lines[i].y1;
        if(lineIntersection(x0,y0,x1,y1,x2, y2, x3, y3)
            || circleIntersection(x0, y0, x1, y1, x2, y2)
            || circleIntersection(x0, y0, x1, y1, x3, y3)){
            return true;
        }
    }
    return false;
}


function getSelected(selected, index){
    return circles[selected[index].i][selected[index].j];
}

function getSelectedIndex(selected,index){
    return {i: selected[index].i, j: selected[index].j};
}

function changePlayer(){
    if(current_player == 'A') 
        current_player = 'B'
    else current_player = 'A'
    document.getElementById("current-player").innerHTML = "Player "+ current_player +" turn";
    document.getElementById("canvas").style.borderColor = player_color[current_player];     
}

function boardValid() {
    let valid = []
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++) {
            valid = [];
            if(!circles[i][j].visited){
                for(let k = 0; k < rows; k++){
                    for(let l = 0; l< cols; l++){
                        if(k != i || l != j){
                            if(!circles[k][l].visited && !Intersect(circles[i][j].x,circles[i][j].y, circles[k][l].x, circles[k][l].y)){
                                valid.push(circles[k][l]);
                            }  
                        }

                    }
                }
            }
            for(let n = 0; n < valid.length-1; n++){
                for(let m = n+1; m<valid.length; m++){
                	m1 = Math.abs((valid[n].y - valid[m].y)/(valid[n].x - valid[m].x));
	    			m2 = Math.abs((circles[i][j].y - valid[n].y)/(circles[i][j].x - valid[n].x));
	   				if(m1 === m2)
	   					continue;
                    if(!Intersect(valid[n].x, valid[n].y, valid[m].x, valid[m].y))
                        return true;


                }
            }
        }
    }
    return false;
}

function endGame(){
    changePlayer(current_player);
    document.getElementById("current-player").innerHTML = "Player "+ current_player + " won! Congratulations!" + '<button id = "btn" onClick="restart()">Restart</button>';
    c.removeEventListener('click', handleClick);
}
function restart(){
    ctx.clearRect(0, 0, c.width, c.height);
    startGame(rows, cols);
    if(replay_player == 'A') 
        replay_player = 'B'
    else replay_player = 'A'
}