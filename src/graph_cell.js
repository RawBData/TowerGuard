

function GraphCell(board, id, i, j) {
    this.id = id;
    this.board = board;
    this.cellWidth = this.board.cellWidth;
    this.location = {x: i*this.cellWidth ,y: j*this.cellWidth}
    this.parentNode = "";
    this.context = this.board.ctx;

    //Currently flipped becuase in game we created colums first and populated them
    this.i = j;
	this.j = i;

	this.f = 0; 
	this.g = 0;
	this.h = 0;

    this.neighbors = [];
    this.smallestNeighbor;
    this.directionFromNearestNeighbor = "E";
	this.previous = undefined;
    this.shortestPath = [];
    
	this.wall = false;
    this.walkingPath = false;
	this.startingArea = false;
	this.isTower = false;
    this.pathScore = -1;
}




GraphCell.prototype.addNeighbors = function(){

    let col = this.j;
    let row = this.i;
    let grid = this.board.grid;

    if(row > 0 && !this.wall && !grid[col][row-1].wall){
        this.neighbors.push(grid[col][row-1]);
    }
    if(col < grid.length-1 && !this.wall && !grid[col+1][row].wall){
        this.neighbors.push(grid[col+1][row]);
    }
    if(row < grid[col].length-1 && !this.wall && !grid[col][row+1].wall){
        this.neighbors.push(grid[col][row+1]);
    }
    if(col > 0 && !this.wall && !grid[col-1][row].wall){
        this.neighbors.push(grid[col-1][row]);
    }
}

GraphCell.prototype.render = function(){
    if (this.wall){
        this.context.fillStyle = "#8c1d35";
    }else{
        this.context.fillStyle = "#42f5b3";
    }
    this.context.strokeStyle = "#2e5244";
    this.context.fillRect(this.location.x, this.location.y, this.cellWidth, this.cellWidth);
    this.context.strokeRect(this.location.x, this.location.y, this.cellWidth, this.cellWidth);
    this.context.font = "10px Arial";
    this.context.fillStyle="#000000";
    this.context.fillText(this.pathScore,this.location.x+5,this.location.y+15);

}

GraphCell.prototype.getLeastNeighborPath = function(){
    let smallestScore = 64000;
    this.neighbors.forEach((flanders,idx) => {
        if(flanders.pathScore < smallestScore){
            smallestScore = flanders.pathScore;
            this.smallestIdx = idx;
        }
    })

    this.smallestNeighbor = this.neighbors[this.smallestIdx];
}

module.exports = GraphCell;


