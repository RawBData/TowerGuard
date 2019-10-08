//sheet has 15 image columns and 5 image rows it 720px length and 267height each is 48px wide by 48px height
//
const DIRECTIONS = ["N","S","E","W"]
const inflectionY = [-30,250,425,430,535];
const inflectionX = [-15, 290, 355, 430, 490, 635, 780, 905, 980, 1050];
const humanUnits = ["Archer","Brigand","Catapult","Cleric","Conjurer","Peasant","Conjurer","Lothar"];
const orcUnits = ["Necrolyte","Ogre","Grunt","Raider","Skeleton","Spearman","Medivh","Warlock","GaronaGriselda"];
const allBad=["Spider","Daemon","Scorpion"];
const conjured=["Spider","Daemon","Scorpion","Skeleton","Slime","WaterElemental","FireElemental"];
const working=["Daemon","Skeleton"]


function Character(characterName, health, game, startX = -10, startY = 250, speedMulty = 1, radius = 25) {
    //this.sheetname = 'Daemon.png'
    this.sheetname = working[Math.floor(Math.random()*working.length)];
    console.log(this.sheetname);
    this.board = game;
    this.character = new Image();
    this.character.src = `../assets/sprites/${this.sheetname}.png`;
    this.gridCell;

    this.radius = radius;

    this.x = startX;
    this.y = startY;

    this.srcX;
    this.srcY;

    this.sheetWidth;// = 720;
    this.sheetHeight;// = 240;


    this.cols;// = 15;
    this.rows;// = 5;

    this.east = 2;
    this.north = 0;
    this.south = 4; 
    this.west = 2; 

    this.currentFrame = 0;

    this.health = 100;
    this.value = 100;
    if (this.sheetname === "Skeleton"){
        // skeleton sheet 640 * 187 
        // 20 columns
        this.sheetWidth = 600;
        this.sheetHeight = 150;
        this.cols = 20;
        this.rows = 5;  
        this.health = 100;
        this.value = 100;
    }else if (this.sheetname === "Spider"){
        console.log("In spider")
        // skeleton sheet 640 * 187 
        // 20 columns
        this.sheetWidth = 480;
        this.sheetHeight = 1157;

        this.cols = 5;
        this.rows = 15;

        this.east = 2;
        this.north = 0;
        this.south = 4; 
        this.west = 2; 
    }else if(this.sheetname === "Daemon"){
        this.sheetWidth = 720;
        this.sheetHeight = 240;

        this.cols = 15;
        this.rows = 5;

        this.east = 2;
        this.north = 0;
        this.south = 4; 
        this.west = 2; 

        this.health = 500;
        this.value = 1000;
    }

    this.speed = Math.floor((Math.random()*5*speedMulty)+1);
    this.size = 1.25;

    this.width = this.sheetWidth/this.cols;
    this.height = this.sheetHeight/this.rows;
    this.canChangeDirection = true;

    this.direction = "E"; ///"N" "W" "S"
    //console.log(this);

    // this.health = 100;

    this.currentGridLocation = this.board.grid[0][10];
    this.currentGridLocationCenterForTakingFire = this.currentGridLocation.center;

    console.log(this.board.home)
}

Character.prototype.changeDirection = function(directions = DIRECTIONS){
    this.direction = directions[Math.floor(Math.random()*directions.length)];
}

Character.prototype.setAnimationSheetInfo = function(){
    if (this.sheetname === "Skeleton"){
        // skeleton sheet 640 * 187 
        // 20 columns
        this.sheetWidth = 600;
        this.sheetHeight = 150;
        this.cols = 20;
        this.rows = 5;  
    }else if (this.sheetname === "Spider"){
        // skeleton sheet 640 * 187 
        // 20 columns
        this.sheetWidth = 480;
        this.sheetHeight = 160;
        this.cols = 5;
        this.rows = 15;
        this.east = 2;
        this.north = 0;
        this.south = 4  
    }
}


Character.prototype.whichDirection = function(){
    if (this.x < -15){
        this.direction = "E";
    }else if (this.x > 1180){
        this.x = 1160
        this.direction = "W";
    }else if (this.y > 535){
        this.direction = "N";
    }else if (this.y < -30){
        this.direction = "S";
    }
    this.currentGridLocation.col = Math.floor((this.x+30)/30);
    this.currentGridLocation.row = Math.floor((this.y+30)/30);
    let smallestNeighbor = this.board.grid[this.currentGridLocation.col][this.currentGridLocation.row].smallestNeighbor;

    if( this.currentGridLocation.col < smallestNeighbor.j){
        this.direction = "E";
    }else if(this.currentGridLocation.col > smallestNeighbor.j){
        this.direction = "W";
    }else if(this.currentGridLocation.row < smallestNeighbor.i){
        this.direction = "S";
    }else if(this.currentGridLocation.row > smallestNeighbor.i){
        this.direction = "N";
    }

    // if smallestNeighbor === 
    //console.log(this.direction);

}

Character.prototype.getGridCenter = function(ctx) {
    this.currentGridLocation.col = Math.floor((this.x+30)/30);
    this.currentGridLocation.row = Math.floor((this.y+30)/30);
    this.center = this.board.grid[this.currentGridLocation.col][this.currentGridLocation.row].center;
}

Character.prototype.updateFrame = function(ctx) {
    this.getGridCenter();
    this.characterDead();
    this.whichDirection();
    this.currentFrame = ++this.currentFrame%this.rows;
    this.srcY = this.currentFrame * this.height;
    switch (this.direction) {
        case "E":
            this.srcX = this.width*this.east;//2
            break;
        case "N":
            this.srcX = this.width*this.north;//0
            break;
        case "S":
            this.srcX = this.width*this.south;//4
            break;
        case "W":
            this.srcX = this.width*this.west;//2
            break;
        default:
            break;
    }

    if (this.direction === "E"){
        this.x += this.speed;
    }else if (this.direction === "W"){
        this.x -= this.speed;
    }else if (this.direction === "N"){
        this.y -= this.speed;
    }else if (this.direction === "S"){
        this.y += this.speed;
    }
    
}

Character.prototype.draw = function(game){
    
    let ctx = game.ctx;

    this.updateFrame(ctx);
    if (this.direction === "W"){
        ctx.save();
        ctx.scale(-1,1);
        ctx.drawImage(this.character, this.srcX, this.srcY, this.width, this.height, -this.x, this.y, this.width*this.size, this.height*this.size)
        ctx.restore();
    }else{
        ctx.drawImage(this.character, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width*this.size, this.height*this.size)
    }
}

Character.prototype.characterDead = function(){
    let homeBase = {row: this.board.home.i, col: this.board.home.j};
    let hRow = this.board.home.i;
    let hCol = this.board.home.j;
    let cRow = this.currentGridLocation.row;
    let cCol = this.currentGridLocation.col;
    //console.log(homeBase)
    if ((hRow-cRow < 2 && hCol-cCol < 2)){
        console.log("baddy made to home tower character")
        this.board.remove("baddy",this);
    }
    if (this.health < 1){
        console.log("Character was blasted off of screen")
        this.board.bank += this.value;
        this.board.remove("baddy",this);
    }
}

Character.prototype.collided = function(otherObject){
    console.log(this.center);
    console.log(otherObjects)

}

Character.prototype.collideWith = function(otherObject) {
    if (otherObject instanceof Projectile) {
      this.health -= 50;
      return true;
    }
    return false;
  },

module.exports = Character;












// let sheetname = 'Daemon.png'

// let character = new Image();
// character.src = "../assets/sprites/Daemon"

// let x = 0;
// let y = 0;

// let srcX;
// let srcY;

// sheetWidth = 720;
// sheetHeight = 240;

// let cols = 15;
// let rows = 5;

// let width = sheetWidth/cols;
// let height = sheetHeight/rows;

// let currentFrame = 0;