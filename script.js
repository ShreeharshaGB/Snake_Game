const board=document.querySelector('.board');
const startGamebtn=document.querySelector('.btn-start');
const restartGamebtn=document.querySelector('.btn-restart');
const modal=document.querySelector('.modal');
const startGameModal=document.querySelector('.start-game');
const restartGameModal=document.querySelector('.restart-game');

const highscoreElement=document.querySelector('#high-score');
const scoreElement=document.querySelector('#score');
const timeElement=document.querySelector('#time');

let highscore=0 || localStorage.getItem("highscore");
let score=0;
let time="00:00";

highscoreElement.innerText=highscore;

const blockHeight=50;
const blockWidth=50;

const cols=Math.floor(board.clientWidth/blockWidth);
const rows=Math.floor(board.clientHeight/blockHeight);

const blocks=[];
let snake=[{x:1,y:2}];
let direction="down";
let intervalId=null;
let timeIntervalId=null;
let food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};


for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
        const block=document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText=`(${row},${col})`block.innerText=`(${row},${col})`
        blocks[`(${row},${col})`]=block;
    }
}

function render(){
    let head=null;

    blocks[`(${food.x},${food.y})`].classList.add("food");

    

    if(direction==="left"){
        head={x:snake[0].x,y:snake[0].y-1};
    }
    else if(direction==="right"){
        head={x:snake[0].x,y:snake[0].y+1};
    }
    else if(direction==="up"){
        head={x:snake[0].x-1,y:snake[0].y};
    }
    else if(direction==="down"){
        head={x:snake[0].x+1,y:snake[0].y};
    }

    const hitself=snake.some(segment=>segment.x==head.x&&segment.y==head.y);

    if(head.x<0||head.x>=rows||head.y<0||head.y>=cols||hitself){
        // alert("Game Over");
        clearInterval(intervalId);
       modal.style.display = "flex";
       startGameModal.style.display = "none";
       restartGameModal.style.display = "flex";
        
    
        return;
    }

    if(food.x==head.x && food.y==head.y){
        blocks[`(${food.x},${food.y})`].classList.remove("food");
        food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
        snake.unshift(head);
        score+=10;
        scoreElement.innerText=score;

        if(score>highscore){
            highscore=score;
            // highscoreElement.innerText=highscore;
            localStorage.setItem("highscore",highscore.toString());
            
        }
    }

    snake.forEach(segment=>{
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })

    snake.unshift(head);
    snake.pop();

    snake.forEach(segment=>{
        blocks[`(${segment.x},${segment.y})`].classList.add("fill");
    })
}



startGamebtn.addEventListener("click",startGame);
    
    
function startGame(){
    modal.style.display="none";
    intervalId=setInterval(()=>{
    render()},300);
    timeIntervalId=setInterval(()=>{
        let[min,sec]=time.split(":").map(Number);
        if(sec>59){
            min+=1;
            sec=0;
        }
        else{
            sec+=1;
        }
        time=`${min}:${sec}`;
        timeElement.innerText=time;
},1000);
    
}

restartGamebtn.addEventListener("click",restartGame);

function restartGame(){
    score=0;
    scoreElement.innerText=score;
    time="00:00";
    timeElement.innerText=time;


    blocks[`(${food.x},${food.y})`].classList.remove("food");
    snake.forEach(segment=>{
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })
    modal.style.display="none";
    snake=[{x:1,y:2}];
    direction="down";
    food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
    intervalId=setInterval(()=>{render()},300);
}  






addEventListener("keydown",(event)=>{
    if(event.key==="ArrowUp"&&direction!=="down"){
        direction="up";
    }
    else if(event.key=="ArrowDown"&&direction!=="up"){
        direction="down";
    }
    else if(event.key=="ArrowRight"&&direction!=="left"){
        direction="right";
    }
    else if(event.key=="ArrowLeft"&&direction!=="right"){
        direction="left";
    }
})