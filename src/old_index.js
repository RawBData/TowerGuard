
const Tower = require('./tower');
const Character = require('./characters')
const BoardTile = require('./board_tiles');
const GraphNodes = require('./graphNodes');

let game;
//
let fps = 20;
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;

let initialize = function(){
  game = new Game();
  window.setTimeout(animation, 200);
}

let animation = function(){
  window.requestAnimationFrame(animation);
  
  now = Date.now();
  delta = now - then;
  
  if (delta > interval) {
    
    then = now - (delta % interval);
      game.run();
    }
}

let mousePos = {x: -60, y: -60};
window.addEventListener('mousemove',(event)=>{
  mousePos.x = event.x;
  mousePos.y = event.y;
  console.log(mousePos)
})

class Game {
  constructor(){
    this.tiles = []
    this.towers = [];
    this.baddies = [];
    this.bullets = [];
    this.currentScore = 0;
    this.bank = 0;
    this.score= 0;
    this.currWave = 0;
    this.currentHealth = 1000;
    this.boardImg = new Image();
    this.boardImg.src = `../assets/sprites/game_board_01.png`;

    this.tiles = this.generateBoardTiles();
    


    this.board = document.createElement("canvas");
    if(!this.board || !this.board.getContext){
      throw "Issues with Canvas or Board"
    }
    this.board.width = 1200;//window.innerWidth-20;
    this.board.height = 600;//.innerHeight-20;
    document.getElementById("canv").appendChild(this.board);

    //event listeners
    this.board.addEventListener('mousemove', this.handleBoardMouseMoved, false)
    this.board.addEventListener('mouseover', this.handleBoardMouseOver, false)
    this.board.addEventListener('click', this.handleBoardMouseClick, false)


    this.ctx = this.board.getContext("2d");
    if(!this.ctx){
      throw "invalid context";
    }

    this.towerSelectors = this.createTowerSelectors();
    this.setTowerFunctions(this.towerSelectors);




    this.getBank = this.getBank.bind(this);
    this.timerOver();
  }

  getBank(){
    return this.bank;
  }

  generateBoardTiles(){
    let tilesArr = [];
    for (let i = 0; i < 5; i++) {
      const element = i;
    }
    return tilesArr;
  }

  handleBoardMouseMoved(event){
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
    if(game.towers.length < 1) return;
    if(!game.towers[game.towers.length-1].placed && game.placingTower === true){
      game.towers[game.towers.length-1].loc.y = this.mouseY;
      game.towers[game.towers.length-1].loc.x = this.mouseX;
    }
  }

  handleBoardMouseOver(){

  }

  handleBoardMouseClick(){

  }

  controlWaves() {
    if(this.wave.isWaveOver()){
      this.currentWaveNum+=1
      this.wave=new Wave(this,AllWaves[this.currentWaveNum])
    }else{
      this.wave.run()
    }
  }
  
  run(){
    this.render(this.ctx);
    //this.generateNextWave();
  }
  
  render(ctx){
      ctx.clearRect(0,0,this.board.width,this.board.height);
      //The Board
      // ctx.drawImage(this.tile, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width*6, this.height*9)
      ctx.drawImage(this.boardImg, 0, 0, this.board.width, this.board.height, 0, 0, this.board.width, this.board.height)

      for (let i = 0; i < this.baddies.length; i++) {
        const baddy= this.baddies[i];
        //console.log(baddy);
        baddy.draw(this.ctx)
        
      }
  
  }
  
  removeBullets(){
    
  }

  timerOver(){
    this.generateNextWave();
  }

  generateNextWave(){
    for (let i = 0; i < 50; i++) {
      let newBaddy = new Character();
      this.baddies.push(newBaddy);
         
    }
  }
  
  updateStats(){
      // update all the status variables
    var bank = document.getElementById("bank");
    bank.innerHTML = "฿" + this.bank;

    var score = document.getElementById("score");
    score.innerHTML = this.currentScore;

    var waveNum = document.getElementById("wave-number");
    waveNum.innerHTML = this.currWave;

    var health = document.getElementById("health");
    health.innerHTML = currentHealth;

    // highlight turrets we can purchase
    var towers = document.getElementsByClassName("tower");
    for (var i = 0; i < tower.length; i++) {
      if (currentCash >= turretValue(towers[i].id)) {
        towers[i].style.opacity = 1;
      } else {
        towers[i].style.opacity = 0.5;
      }
    }
  }

  hideImgElement(){this.style.display = "none"; }

  setTowerFunctions(towerSelectorsArray){
    towerSelectorsArray.forEach((tower, i)=>{
      tower.addEventListener('mouseover',this.selectorHoverOn, false)
      tower.addEventListener('mouseout',this.selectorHoverOff, false)
      tower.addEventListener('mousedown',this.selectorPressed, false)
      tower.addEventListener('click',this.selectorClick, false)
    })
  }

  selectorHoverOn(){
    this.style.backgroundColor = 'yellow';
  }
  selectorHoverOff(){
    this.style.backgroundColor = '#DDD';
  }
  selectorPressed(){
    this.style.backgroundColor = 'Red';
  }
  selectorClick(){
    this.style.backgroundColor = 'green';
    if (game.placingTower === true) return;
    if (game.getBank() > this.cost){
      console.log("bank was enough")
      game.createTower(this);
      game.placingTower = true;
    }else{
      console.log("not enough cheddar")
    }
  }

  createTower(selector){
    let tower = new Tower(selector.cost, selector.tSelectedImgPath, selector.tSelectedBulletImgPath);
    if (tower){
      this.towers.push(tower);
    } else {
      console.log("there was a problem with tower")
    }

  }

  createTowerSelectors(){
    let TowerSelectors = [];
    for (let i = 0; i < 5; i++) {
      let tSelector = document.createElement("div");
      let tSelectedImgPath = '../assets/tower.png';//"images/tower" + (i+1) + "sel.png";
      let tSelectedBulletImgPath = '../assets/bullet.png';//"images/b" + (i+1) + ".png";


      tSelector.tImage = new Image();
      tSelector.tImage.addEventListener('load',this.hideImgElement,false);
      tSelector.tImage.addEventListener('error', ()=>{console.log("fail tower");}, false);
      tSelector.tImage.src = tSelectedImgPath;

      tSelector.bImage = new Image();
      tSelector.bImage.addEventListener('load',this.hideImgElement,false);
      tSelector.bImage.addEventListener('error', ()=>{console.log("fail bullet");}, false);
      tSelector.bImage.src = tSelectedImgPath;

      document.getElementById("playables").append(tSelector)

      tSelector.cost = 100*i+50;
      tSelector.id = "tSel"+i;
      TowerSelectors.push(tSelector);
      let selectorImagePath= '../assets/tower.png';
      let selectorImage = new Image();
      selectorImage.addEventListener('error', ()=>{console.log("fail selector");}, false);
      selectorImage.src = selectorImagePath;
      tSelector.appendChild(selectorImage);


    }


    return TowerSelectors;
  }
  
  
}


window.addEventListener('load', initialize, false);