

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

/* 
GraphNodes.prototype.construct = function(){
	
    
    this.openSet = [];
    this.closedSet = [];
    this.start;
    this.end;
	this.w;
	this.h;
    this.path = [];
	this.displayText;
	

}


GraphNodes.prototype.removeFromArray = function(arr,elt){
	for (let i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elt){
			arr.splice(i,1);
		}
	}
}

GraphNodes.prototype.heuristic = function(a,b){
	//euclidean distance
	//let d = dist(a.i,a.j,b.i,b.j);

	//taxicab distance
	let d = abs(a.i-b.i) + abs(a.j-b.j);
	return d;
}



function Local(i,j){
	//passing these in to save location in grid
	this.i = i;
	this.j = j;

	this.f = 0; 
	this.g = 0;
	this.h = 0;

	this.neighbors = [];
	this.previous = undefined;
	this.wall = false;
	this.shortestPath = [];

	//setting up obstacles
	// if (random(1) < 0.40 ){
	// 	this.wall = true;
	// }

	this.addNeighbors = function(grid){
		if(i < cols-1){
			this.neighbors.push(grid[this.i+1][this.j]);
		}
		if(i > 0){
			this.neighbors.push(grid[this.i-1][this.j]);
		}
		if(j < rows-1){
			this.neighbors.push(grid[this.i][this.j+1]);
		}
		if(j > 0){
			this.neighbors.push(grid[this.i][this.j-1]);
		}
		if(i > 0 && j > 0){
			this.neighbors.push(grid[this.i-1][this.j-1]);
		}
		if(i < cols - 1  && j > 0){
			this.neighbors.push(grid[this.i+1][this.j-1]);
		}
		if(i > 0 && j < rows-1){
			this.neighbors.push(grid[this.i-1][this.j+1]);
		}
		if(i < cols - 1 && j < rows - 1){
			this.neighbors.push(grid[this.i+1][this.j+1]);
		}
		
	}
}




GraphNodes.prototype.createGrid = function(){
	this.w = this.width/cols;
	this.h = this.height/rows;

	for (let i = 0; i < cols; i++){
		theGrid[i] = new Array(rows);
	}

	for (let i = 0; i < cols; i++){
		for (let j = 0; j < rows; j++){
			theGrid[i][j] = new Local(i,j);
		}
	}

	for (let i = 0; i < cols; i++){
		for (let j = 0; j < rows; j++){
			theGrid[i][j].addNeighbors(theGrid);
		}
	}

	this.start = theGrid[0][0];
	this.end = theGrid[rows-1][cols-1];
	this.start.wall = false;
	this.end.wall = false;
	this.openSet.push(start);
	
	console.log(theGrid);

}

function noSolution(textToPass){
	displayText = textToPass;
}

GraphNodes.prototype.run = function(){
	if (this.openSet.length > 0){

		//keep going
		let winner = 0;
		for (let i = 0; i < openSet.length; i++){
			if(openSet[i].f < openSet[winner].f){
				winner = i;
			}
		}

		let current = openSet[winner];

		if(current ===  end){

			path = [];
			let temp = current;
			path.push(current);
			while(temp.previous){
				path.push(temp.previous);
				temp = temp.previous;
			}
			noLoop();
			console.log("Done");
			console.log(path);
		}

		closedSet.push(current);
		removeFromArray(openSet,current);

		let neighbors = current.neighbors;

		for (let i = 0; i < neighbors.length; i++){
			let neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.wall){
				let tempG = current.g + 1;

				let newPath = false;
				if (openSet.includes(neighbor)){
					if (tempG < neighbor.g){
						neighbor.g = tempG;
						newPath = true;
					}
				}else{
					neighbor.g = tempG;
					newPath = true;
					openSet.push(neighbor);
				}

				if(newPath){
					neighbor.h = heuristic(neighbor,end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}
			}
		}

	}else{

		// no solution
		noLoop();
		console.log("No Solution");
		noSolution("No Solution");
		console.log(path);
		return;
	}

	for (let i = 0; i < cols; i++){
		for (let j = 0; j < rows; j++){
			theGrid[i][j];
		}
	}

	for (let i = 0; i < closedSet.length; i++){
		closedSet[i];
	}

	for (let i = 0; i < openSet.length; i++){
		openSet[i];
	}	


	path = [];
	let temp = current;
	path.push(temp);
	while(temp.previous){
		path.push(temp.previous);
		temp = temp.previous;
	}
	

	// noFill();
	// stroke(255);
	// strokeWeight(w/2);
	// beginShape();
	// for (let i = 0; i < path.length; i++){
	// 	vertex(path[i].i*w + w/2, path[i].j*h + h/2);
	// }
	// endShape();
	//console.log(path);

}













module.exports = GraphNodes;




*/

