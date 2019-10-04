//sheet has 19 image columns and 20 image rows it 720px length and 267height each is 48px wide by 48px height
//


function BoardTile(tileName, health, walk) {
    this.sheetname = 'BoardTiles.png'

    this.name;

    this.tile = new Image();
    this.tile.src = `../assets/sprites/${this.sheetname}`;
    
    this.x = 0;
    this.y = 0;
    
    this.srcX;
    this.srcY;
    
    this.sheetWidth = 626;
    this.sheetHeight = 659;
    
    theFrame = 0;
    
    this.cols = 19;
    this.rows = 20;
    
    this.width = this.sheetWidth/this.cols;
    this.height = this.sheetHeight/this.rows;

    //starts at 0 at 10 rows and zero columns
    if (this.name === "dirt"){

    }


}


// Character.prototype.updateFrame = function(ctx) {
//     this.currentFrame = ++this.currentFrame%this.rows;
//     this.srcY = this.currentFrame * this.height;
//     switch (this.direction) {
//         case "E":
//             this.srcX = this.width*2
//             break;
//         case "N":
//             this.srcX = this.width*0
//             break;
//         case "S":
//             this.srcX = this.width*4
//             break;
//         case "W":
//             this.srcX = this.width*2
//             break;
//         default:
//             break;
//     }
//     this.x += this.speed;
// }

BoardTile.prototype.draw = function(ctx){
    ctx.drawImage(this.tile, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width*6, this.height*9)
}

module.exports = BoardTile;












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