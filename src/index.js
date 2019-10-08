
const Tower = require('./tower');
const Character = require('./characters')
const GraphCell = require('./graph_cell');
const Projectile = require('./projectile')

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
  //console.log(mousePos)
})

class Game {
  constructor(baddiesType = "orcs"){
    this.tiles = []
    this.towers = [];
    this.baddies = [];
    this.projectiles = [];
    this.grid = []


    this.currentScore = 0;
    this.bank = 1000;
    this.score= 0;
    this.currentHealth = 1000;
    this.wallVal = 10;


    this.currWave = 0;
    this.boardImg = new Image();
    this.boardImg.src = `../assets/sprites/game_board_01.png`;
    //dynamic homebase 
    this.homeImg = new Image();
    this.homeImg.src = `../assets/sprites_towers/home_against_${baddiesType}.png`;
    
    this.waveAmount = 5;
    this.baddiesType = baddiesType; 
    

    //Towers are created Dynamically and set on the canvas
    this.towerSelected = false;
    this.towerSelectors = this.createTowerSelectors();
    this.setTowerFunctions(this.towerSelectors);

    window.game = this;

    this.board = document.createElement("canvas");
    if(!this.board || !this.board.getContext){
      throw "Issues with Canvas or Board"
    }
    this.board.width = 1200;
    this.board.height = 600;
    document.getElementById("canv").appendChild(this.board);

    //event listeners
    this.board.addEventListener('mousemove', this.handleBoardMouseMoved, false)
    this.board.addEventListener('mouseover', this.handleBoardMouseOver, false)
    this.board.addEventListener('click', this.handleBoardMouseClick, false)


    this.ctx = this.board.getContext("2d");
    if(!this.ctx){
      throw "invalid context";
    }

    this.cellWidth = 30;
    this.gridCols = this.board.width/this.cellWidth;
    this.gridRows = this.board.height/this.cellWidth;
    this.createGrid();
    this.generateNextWave();

  }

  
  run(){
    this.render(this.ctx);
    this.collisionDetection();
    //this.generateNextWave();
  }

  
  render(ctx){
      ctx.clearRect(0,0,this.board.width,this.board.height);
      //The Board
      // ctx.drawImage(this.tile, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width*6, this.height*9)
      ctx.drawImage(this.boardImg, 0, 0, this.board.width, this.board.height, 0, 0, this.board.width, this.board.height)
      ctx.drawImage(this.homeImg, 1100, 255);

        //Put Baddies on the board
        for (let i = 0; i < this.baddies.length; i++) {
          const baddy= this.baddies[i];
          //console.log(baddy);
          baddy.draw(this)
          
        }
        
        for (let t = 0; t < this.towers.length; t++) {
          const tower = this.towers[t];
          //console.log(baddy);
          tower.run(this);
          
        }

        for (let p = 0; p < this.projectiles.length; p++) {
          const projectile = this.projectiles[p];
          //console.log(baddy);
          projectile.run(this);
          
        }


        //The Path Grid only shown for testing purposes
        for (let col = 0; col < this.gridCols; col++) {
            for (let row = 0; row < this.gridRows; row++) {
                //console.log(col,row);
                // this.grid[col][row].render();
            }   
        }

        
    }

    //Gets the amount of bank left
    getBank(){
      return this.bank;
    }

    allObjects(){
      return [].concat(this.baddies,this.projectiles);
    }

    collisionDetection(){
      let allObjects = this.allObjects();


      console.log(allObjects)
      for (let i = 0; i < this.projectiles.length; i++) {
        for (let k = 0; k < this.baddies.length; k++) {
          let element1 = this.projectiles[i];
          let element2 = this.baddies[k];
          if (element1.collided(element2)){
            let collision  = element1.collideWith(element2);
            return collision;
          }
        }
      }
    }


    //Tower Display, Selection and Dropping
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
      if (game.towerSelected === true) return;
      if (game.getBank() > this.cost){
        console.log("bank was enough")
        game.createTower(this);
        game.towerSelected = true;
      }else{
        console.log("not enough cheddar")
      }
    }


    createTower(selector){
      let tower = new Tower(selector.cost, selector.tImage, selector.bImage, game);
      if (tower){
        console.log(tower);
        this.towers.push(tower);
      } else {
        console.log("there was a problem with tower")
      }
  
    }


    createTowerSelectors(){
      let TowerSelectors = [];
      for (let i = 0; i < 5; i++) {
        let tSelector = document.createElement("div");
        let tSelectedImgPath = `../assets/sprites_towers/tower_against_${this.baddiesType}_0${i+1}.png`;
        let tSelectedBulletImgPath = `../assets/sprites_bullets/B${i+1}.png`;
  
  
        tSelector.tImage = new Image();
        tSelector.tImage.addEventListener('load',this.hideImgElement,false);
        tSelector.tImage.addEventListener('error', ()=>{console.log("fail tower");}, false);
        tSelector.tImage.src = tSelectedImgPath;
  
        tSelector.bImage = new Image();
        tSelector.bImage.addEventListener('load',this.hideImgElement,false);
        tSelector.bImage.addEventListener('error', ()=>{console.log("fail bullet");}, false);
        tSelector.bImage.src = tSelectedBulletImgPath;
  
        document.getElementById("playables").append(tSelector)
  
        tSelector.cost = 100*i+50;
        tSelector.id = "tSel"+i;
        TowerSelectors.push(tSelector);
        let selectorImagePath= `../assets/sprites_towers/tower_against_${this.baddiesType}_0${i+1}.png`;
        let selectorImage = new Image();
        selectorImage.addEventListener('error', ()=>{console.log("fail selector");}, false);
        selectorImage.src = selectorImagePath;
        tSelector.appendChild(selectorImage);
      }
  
  
      return TowerSelectors;
    }



    //Game logic to add towers to canvas
    handleBoardMouseMoved(event){
      game.mouseX = event.offsetX;
      game.mouseY = event.offsetY;
      this.mouseX = event.offsetX;
      this.mouseY = event.offsetY;
      if(game.towers.length < 1) return;
      if(!game.towers[game.towers.length-1].placed && game.towerSelected === true){
        game.towers[game.towers.length-1].location.y = this.mouseY;
        game.towers[game.towers.length-1].location.x = this.mouseX;
      }
    }
  
    handleBoardMouseOver(){
        if(game.towers.length < 1) return;
        game.towers[game.towers.length-1].shouldDraw = true;
    }
  
    handleBoardMouseClick(event){
      console.log(event);
      let row = Math.floor(event.offsetY/game.cellWidth);
      let col = Math.floor(event.offsetX/game.cellWidth);
      let node = game.grid[col][row];
      console.log(node)
      
      if(game.towerSelected && game.nodeAvailable(node)){
      game.putTower(node);
      }

      else if(!game.towerSelected && !node.hasTower) {
          // putting walls on the board
          if (!node.wall && game.getBank() >= game.wallVal){
              game.bankValue -= game.wallVal;
              node.wall = true;
          } else if(!node.wall) {
              alert("Not Enough Dinero");
              }
          else {
              game.bankValue += game.wallVal;
              node.wall = false;
          }
          //game.brushfire(game.undo(node));   // all new distances and parents
        }
    }

    nodeAvailable(node) {

      // add conditions before allowing user to place turret
      // Some money required but also cannot place tower on a node
      // of the grid that is occupied or is the root node
      if(game.towerSelected) {
          if(!node.wall && !node.isTower && node != game.home){
            return true;
          }
        return(false);
      }
    }


    putTower(node){
      // console.log("Testing");
      // console.log(node)
        game.towers[game.towers.length-1].location = {
          x: ((node.j*this.cellWidth)+this.cellWidth/2),
          y: ((node.i*this.cellWidth)+this.cellWidth/2)
        };

        game.towers[game.towers.length-1].placed = true;
        node.isTower = true;
        game.towerSelected = false;

    }

    //Wave Logic including brushfire grid and baddy generation
    createGrid(){
        let id = 0
        for (let i = 0; i < this.gridCols; i++) {
          this.grid.push([]);
          for (let j = 0; j < this.gridRows; j++) {
              this.grid[i].push(new GraphCell(this,++id, i, j))
          }
  
        }


      for (let col = 0; col < this.gridCols; col++) {
            for (let row = 0; row < this.gridRows; row++) {
                //console.log(col,row);
                this.grid[col][row].addNeighbors();
            }   
        }

        this.home = this.grid[this.gridCols-1][this.gridRows/2];
        this.home.wall = false;
        this.home.pathScore = 0;

        this.createPaths();
    }


    createPaths(){
        //I will be using the brushfire design with end goal in mind
        let checkFifo = [this.home];
        while (checkFifo.length > 0){
            let currentCell = checkFifo.shift();
            currentCell.neighbors.forEach(flanders => {
                if (flanders.pathScore === -1){
                    checkFifo.push(flanders); 
                    flanders.pathScore = currentCell.pathScore+30;
                }
            })
        }


        for (let col = 0; col < this.gridCols; col++) {
            for (let row = 0; row < this.gridRows; row++) {
                //console.log(col,row);
                if(!this.grid[col][row].wall){
                    this.grid[col][row].getLeastNeighborPath();
                }
            }   
        }
    }

  generateNextWave(){
    for (let i = 0; i < this.waveAmount; i++) {
        let newX = Math.floor(Math.random()*1200);
        let newY = Math.floor(Math.random()*600);
      let newBaddy = new Character(0,0,this,newX, newY);
      this.baddies.push(newBaddy);
         
    }
  }
  

  remove(objectType, item){
    if (objectType === "projectile"){
      this.projectiles.splice(this.projectiles.indexOf(item), 1);
    }else if (objectType === "baddy"){
      this.baddies.splice(this.baddies.indexOf(item), 1);
    }
  }
  
  
}


window.addEventListener('load', initialize, false);