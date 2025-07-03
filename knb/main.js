const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width, height = canvas.height;
let entities = [], spawnInterval, animationId;
let scores = [0,0,0], gameOver = false;
let winningScore = 30, teamSize = winningScore + 10;

class Entity {
  constructor(x,y,type) {
    this.x=x; this.y=y; this.rad=8; this.speed=1.5;
    this.angle=Math.random()*Math.PI*2; this.type=type;
  }
  move() {
    this.x+=Math.cos(this.angle)*this.speed;
    this.y+=Math.sin(this.angle)*this.speed;
    if(this.x<this.rad){this.x=this.rad;this.angle=Math.PI-this.angle;}
    else if(this.x>width-this.rad){this.x=width-this.rad;this.angle=Math.PI-this.angle;}
    if(this.y<this.rad){this.y=this.rad;this.angle=-this.angle;}
    else if(this.y>height-this.rad){this.y=height-this.rad;this.angle=-this.angle;}
  }
  draw() {
    const colors=['#888','#4caf50','#f44336'];
    ctx.fillStyle=colors[this.type];
    ctx.beginPath();ctx.arc(this.x,this.y,this.rad,0,Math.PI*2);ctx.fill();
  }
}

function spawnEntities() {
  const corners=[[20,20],[width-20,20],[20,height-20]];
  let counts=[0,0,0];
  spawnInterval=setInterval(()=>{
    let done=true;
    for(let t=0;t<3;t++){
      if(counts[t]<teamSize){
        const [cx,cy]=corners[t];
        entities.push(new Entity(cx+(Math.random()-0.5)*30, cy+(Math.random()-0.5)*30, t));
        counts[t]++;done=false;
      }
    }
    if(done) clearInterval(spawnInterval);
  },1000);
}

function detectCollisions(){
  if(gameOver) return;
  entities.forEach((a,i)=>{
    for(let j=i+1;j<entities.length;j++){
      const b=entities[j]; const dx=a.x-b.x,dy=a.y-b.y;
      const dist=Math.hypot(dx,dy);
      if(dist<a.rad+b.rad){
        if(a.type===b.type){
          [a.angle,b.angle]=[b.angle,a.angle];
          const overlap=a.rad+b.rad-dist;
          const nx=dx/dist,ny=dy/dist;
          a.x+=nx*overlap/2; a.y+=ny*overlap/2;
          b.x-=nx*overlap/2; b.y-=ny*overlap/2;
        } else {
          const winType=(a.type+1)%3;
          let winner=a, loser=b;
          if(b.type===winType){winner=b;loser=a;}
          scores[winner.type]++; updateScores(); resetPosition(loser);
          checkVictory(winner.type);
        }
      }
    }
  });
}

function resetPosition(ent){
  const corners=[[20,20],[width-20,20],[20,height-20]];
  const [cx,cy]=corners[ent.type];
  ent.x=cx+(Math.random()-0.5)*30;ent.y=cy+(Math.random()-0.5)*30;
  ent.angle=Math.random()*Math.PI*2;
}

function updateScores(){
  ['rockScore','paperScore','scissorsScore'].forEach((id,i)=>{
    document.getElementById(id).textContent=scores[i];
  });
}

function checkVictory(type){
  if(scores[type]>=winningScore&&!gameOver){
    gameOver=true;clearInterval(spawnInterval);cancelAnimationFrame(animationId);
    document.getElementById('stopBtn').disabled=true;
    document.getElementById('startBtn').disabled=false;
    document.getElementById('winInput').disabled=false;
    document.getElementById('message').textContent=['Rock','Paper','Scissors'][type]+' wins!';
  }
}

function animate(){
  ctx.clearRect(0,0,width,height);
  entities.forEach(e=>{e.move();e.draw();});
  detectCollisions();
  if(!gameOver) animationId=requestAnimationFrame(animate);
}

function startGame(){
  const input=parseInt(document.getElementById('winInput').value)||30;
  winningScore=input;teamSize=winningScore+10;
  document.getElementById('winInput').disabled=true;
  resetState();gameOver=false;spawnEntities();animate();
  document.getElementById('startBtn').disabled=true;
  document.getElementById('stopBtn').disabled=false;
}
function stopGame(){
  clearInterval(spawnInterval);cancelAnimationFrame(animationId);
  entities=[];ctx.clearRect(0,0,width,height);
  document.getElementById('startBtn').disabled=false;
  document.getElementById('stopBtn').disabled=true;
  document.getElementById('winInput').disabled=false;
}
function resetState(){
  entities=[];scores=[0,0,0];updateScores();
  ctx.clearRect(0,0,width,height);
  document.getElementById('message').textContent='';
}

document.querySelector('#startBtn').addEventListener('click',startGame);
document.querySelector('#stopBtn').addEventListener('click',stopGame);