//sheet has 15 image columns and 5 image rows it 720px length and 267height each is 48px wide by 48px height
//
const DIRECTIONS = ["N","S","E","W"]
const inflectionY = [-30,250,425,430,535];
const inflectionX = [-15, 290, 355, 430, 490, 635, 780, 905, 980, 1050];

const GraphNodes = require('./graphNodes');

function Character(characterName, health, game) {
    this.sheetname = 'Daemon.png'

    this.board = game;
    this.character = new Image();
    this.character.src = `../assets/sprites/${this.sheetname}`;

    this.x = -14;
    this.y = 250;

    this.srcX;
    this.srcY;

    this.sheetWidth = 720;
    this.sheetHeight = 240;

    this.cols = 15;
    this.rows = 5;

    this.currentFrame = 0;

    this.speed = 5;
    this.size = 1;

    this.width = this.sheetWidth/this.cols;
    this.height = this.sheetHeight/this.rows;
    this.canChangeDirection = true;

    this.direction = "E"; ///"N" "W" "S"
    //console.log(this);

    this.health = 100;

    this.currentGridLocation = {row: 19, col: 0};

    console.log(this.board)
}

Character.prototype.changeDirection = function(directions = DIRECTIONS){
    this.direction = directions[Math.floor(Math.random()*directions.length)];
}

Character.prototype.atInflectionPoint = function(){
    if (this.x < -15){
        this.direction = "E";
    }else if (this.x > 1155){
        this.x = 1160
        this.direction = "W";
    }else if (this.y > 535){
        this.direction = "N";
    }else if (this.y < -29){
        this.direction = "S";
    }

    // if (this.canChangeDirection){
    //     inflectionX.forEach(inflY =>{
    //         if (inflY-this.y<5){
    //             inflectionX.forEach(inflX => {
    //                 if (inflX-this.x<5){
    //                     this.changeDirection();
    //                     this.canChangeDirection = false;
    //                     setTimeout(()=>{this.canChangeDirection = true}, 3000)
    //                 }
    //             });
    //         }
    //     });

    // }

    // const inflectionY = [-30,250,425,430,535];
    // const inflectionX = [-15, 290, 355, 430, 490, 635, 780, 905, 980, 1050];

    for (let i = 0; i < inflectionY.length; i++) {
        const inflY = inflectionY[i];
        if (Math.abs(inflY-this.y)<4){
            switch (inflY) {
                case -30:
                    for (let j = 0; j < inflectionX.length; j++) {
                        const inflX = inflectionX[j];
                        if (Math.abs(inflX-this.y)<4){
                            this.x = inflX;
                            this.y = inflY;
                            this.changeDirection(["S","E","W"]);
                            this.canChangeDirection = false;
                            setTimeout(()=>{this.canChangeDirection = true}, 3000)
                        }
                    }
                    break
                case 250:
                        for (let j = 0; j < inflectionX.length; j++) {
                            const inflX = inflectionX[j];
                            if (Math.abs(inflX-this.x)<4){
                                let directions;
                                if (inflX === 355 || inflX === 1050 || inflX === 430){
                                    directions = ["S","E","W"];
                                }else if(inflX === 980){
                                    directions = ["S","E","W","N"];
                                }else{
                                    directions = ["E","W","N"];
                                }
                                this.x = inflX;
                                this.y = inflY;
                                this.changeDirection(directions);
                                this.canChangeDirection = false;
                                setTimeout(()=>{this.canChangeDirection = true}, 3000)
                            }
                        }
                    break;
                case 425:
                        for (let j = 0; j < inflectionX.length; j++) {
                            const inflX = inflectionX[j];
                            if (Math.abs(inflX-this.x)<4){
                                this.x = inflX;
                                this.y = inflY;
                                this.changeDirection();
                                this.canChangeDirection = false;
                                setTimeout(()=>{this.canChangeDirection = true}, 3000)
                            }
                        }
                    break;
                case 430:
                        for (let j = 0; j < inflectionX.length; j++) {
                            const inflX = inflectionX[j];
                            if (Math.abs(inflX-this.x)<4){
                                this.x = inflX;
                                this.y = inflY;
                                this.changeDirection();
                                this.canChangeDirection = false;
                                setTimeout(()=>{this.canChangeDirection = true}, 3000)
                            }
                        }
                    break;
            
                case 535:
                    for (let j = 0; j < inflectionX.length; j++) {
                        const inflX = inflectionX[j];
                        if (Math.abs(inflX-this.x)<4){
                            this.x = inflX;
                            this.y = inflY;
                            this.changeDirection();
                            this.canChangeDirection = false;
                            setTimeout(()=>{this.canChangeDirection = true}, 3000)
                        }
                    }
                    break;
                
                default:
                    break;
            }
        }
        
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
    let smallestNeighbor = this.board.grid[this.currentGridLocation.col][this.currentGridLocation.row];
    console.log(smallestNeighbor);
    console.log(this.currentGridLocation);
    if( this.currentGridLocation.col < smallestNeighbor.j){
        this.direction = "W";
    }else if(this.currentGridLocation.col > smallestNeighbor.j){
        this.direction = "E";
    }else if(this.currentGridLocation.row < smallestNeighbor.i){
        console.log(smallestNeighbor.i)
        this.direction = "N";
    }else if(this.currentGridLocation.row > smallestNeighbor.i){
        this.direction = "S";
    }

    console.log(this.direction);

}

Character.prototype.updateFrame = function(ctx) {
    this.whichDirection();
    this.currentFrame = ++this.currentFrame%this.rows;
    this.srcY = this.currentFrame * this.height;
    switch (this.direction) {
        case "E":
            this.srcX = this.width*2
            break;
        case "N":
            this.srcX = this.width*0
            break;
        case "S":
            this.srcX = this.width*4
            break;
        case "W":
            this.srcX = this.width*2
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