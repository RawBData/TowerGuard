
const Tower = require('./tower');
const Character = require('./characters')
const BoardTile = require('./board_tiles');
const GraphNodes = require('./graphNodes');
const GraphCell = require('./graph_cell');

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
  constructor(){
    this.tiles = []
    this.towers = [];
    this.baddies = [];
    this.bullets = [];
    this.grid = []
    this.currentScore = 0;
    this.bank = 0;
    this.score= 0;
    this.currWave = 0;
    this.currentHealth = 1000;
    this.boardImg = new Image();
    this.boardImg.src = `../assets/sprites/game_board_01.png`;    

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

    this.generateNextWave();

    this.cellWidth = 30;
    this.gridCols = this.board.width/this.cellWidth;
    this.gridRows = this.board.height/this.cellWidth;
    this.createGrid();
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
          baddy.draw(this)
          
        }
        
        //The Path Grid
        for (let col = 0; col < this.gridCols; col++) {
            for (let row = 0; row < this.gridRows; row++) {
                //console.log(col,row);
                //this.grid[col][row].render();
            }   
        }

        
    }
    
    
    createGrid(){
        let id = 0
        console.log(this);
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

        this.home = this.grid[0][0];
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
                    flanders.pathScore = currentCell.pathScore+1;
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
    for (let i = 0; i < 1; i++) {
      let newBaddy = new Character(0,0,this);
      this.baddies.push(newBaddy);
         
    }
  }
  


  
  
}


window.addEventListener('load', initialize, false);