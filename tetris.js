let can = document.getElementById("can");
let con = can.getContext("2d");

/*----------サイズ・座標などなど----------*/
//フィールドのサイズ
const FIELD_X = 10;
const FIELD_Y = 20;
//ブロックのサイズ
const BLOCK_SIZE = 30;
//スクリーンのサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_X;
const SCREEN_H = BLOCK_SIZE * FIELD_Y;
//キャンパスのサイズ・枠
can.width  = SCREEN_W;
can.height = SCREEN_H;
can.style.border ="4px solid #555";
//テトロミノのサイズ
const TETRO_SIZE = 4;
//テトロミノの座標・形
const START_X = FIELD_X/2 - TETRO_SIZE/2;
let tetro_x = START_X;    //横の位置
let tetro_y = 0;    //縦の位置
let tetro_t;        //テトロミノの形
//ゲームスピード
let GAME_SPEED = 500;
//ゲームオーバー
let over = false;
/*----------関数の定義----------*/
//フィールドの描画 関数
function drawField() {
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);    //一旦全消し
    for(let y=0; y<FIELD_Y; y++) {
        for(let x=0; x<FIELD_X; x++) {
            if(field[y][x]) {
                drawBlock(x, y, field[y][x]);
            }
        }
    }
}
//テトロミノの描画 関数
function drawTetro(px, py) {
    for(let y=0; y<TETRO_SIZE; y++) {
        for(let x=0; x<TETRO_SIZE; x++) {
            if(tetro[y][x]) {
                drawBlock(tetro_x + x, tetro_y + y, tetro_t);
            }
        }
    }
}
//ブロックの描画 関数
function drawBlock(x, y, c) {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
    con.fillStyle=TETRO_COLORS[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeStyle="black";
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}
//全部を描画 関数
function drawAll() {
    drawField();
    drawTetro();
    if(over) {
        let end ="GAME OVER";
        con.font = "40px 'ゴシック'";
        let w = con.measureText(end).width;
        let x = SCREEN_W/2 - w/2;
        let y = SCREEN_H/2 - 20;
        con.lineWidth = 4;
        con.strokeText(end, x, y);
        con.fillStyle="white";
        con.fillText(end, x, y);
    }
}
//当たり判定 関数
function checkMove(mx, my, nTetro) {
    if( nTetro == undefined){
        nTetro = tetro;
    }
    for(let y=0; y<TETRO_SIZE; y++) {
        for(let x=0; x<TETRO_SIZE; x++) {
            let nx = tetro_x + x + mx;
            let ny = tetro_y + y + my;
            if(nTetro[y][x]) {
                if( ny < 0 ||
                    nx < 0 ||
                    ny >= FIELD_Y ||
                    nx >= FIELD_X ||
                    field[ny][nx]) {
                    return false;
                }
            }
        }
    }
    return true;
}
//テトロミノ回転 右90度 関数
function rotate() {
    let nTetro = [];
    for(let y=0; y<TETRO_SIZE; y++) {
        nTetro[y] = [];
        for(let x=0; x<TETRO_SIZE; x++) {
            nTetro[y][x] = tetro[TETRO_SIZE-1-x][y];
        }
    }
    return nTetro;
}
//テトロミノが落ちていく 関数
function dropTetro() {
    if(over){return;}
    if(checkMove(0, 1)) {
        tetro_y++;
    } else {
        fixTetro();
        checkLine();
        tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length-1)) +1;
        tetro = TETRO_TYPES[tetro_t];
        tetro_y = 0;
        tetro_x = START_X;
        if(!checkMove(0,0)) {
            over=true;
        }
    }
    
    drawAll();
}
//テトロミノ落下後固定 関数
function fixTetro() {
    for(let y=0; y<TETRO_SIZE; y++) {
        for(let x=0; x<TETRO_SIZE; x++) {
            if(tetro[y][x]) {
                field[tetro_y+y][tetro_x+x] = tetro_t;
            }
        }
    }
}
//揃ったかチェックして消す
function checkLine() {
    let lineC = 0;
    for(let y=0; y<FIELD_Y; y++) {
        let flag = true;
        for(let x=0; x<FIELD_X; x++) {
            if(!field[y][x]) {
                flag = false;
                break;
            }
        }
        if(flag){
            lineC++;
            for(let ny = y; ny>0; ny--) {
                for(let nx=0; nx<FIELD_X; nx++) {
                    field[ny][nx] = field[ny-1][nx];
                }
            }
        }
    }
}

/*----------フィールドの形----------*/
let field = [];
for(let y=0; y<FIELD_Y; y++){
    field[y] = [];
    for(let x=0; x<FIELD_X; x++){
        field[y][x] = 0;
    }
}

/*----------テトロミノの色・形----------*/
//テトロミノの色
const TETRO_COLORS = [
    "#fff",                //0.空
    "#6cf",                //1.水色
    "#f92",                //2.オレンジ
    "#66f",                //3.青
    "#c5c",                //4.紫
    "#fd2",                //5.黄色
    "#f44",                //6.赤
    "#5b5",                //7.緑
];
//テトロミノの形
const TETRO_TYPES = [
    [],                 //空
    [                   //1.I
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [                   //2.L
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [                   //3.J
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [                   //4.T
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [                   //5.O
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [                   //6.z
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [                   //7.S
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ]
];
tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length-1)) +1;
tetro = TETRO_TYPES[tetro_t];

/*----------キーボード操作----------*/
document.onkeydown = function(e) {
    if(over){return;}
    switch(e.keyCode) {
        case 37:        //左
            if(checkMove(-1, 0,)){tetro_x--;}
            break;
        case 38:        //上（右回転）
            let nTetro = rotate();
            if(checkMove(0, 0, nTetro)){
            tetro = nTetro;
            }
            break;
        case 39:        //右
            if(checkMove(1, 0)){tetro_x++;}
            break;
        case 40:        //下
            if(checkMove(0, 1)){tetro_y++;}
            break;
        case 32:        //スペース（スタート）
            drawAll();
            break;
    }

drawAll();
}

/*----------最初----------*/
drawAll();
setInterval(dropTetro, GAME_SPEED)

