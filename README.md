# Tower Guard


_A Javascript Tower Defense Game._

[Tower Guard Live](https://rawbdata.github.io/TowerGuard/dist/ "Tower Guard")

![Splash](./docs/towerguard.gif)

***
## Background and Overview
***

Tower Guard is a JavaScript game using Warcraft sprites with the an original tower defense design and implementation. 


- Realtime: over 10 different sprite characters with up to 1000 individual renders.

- Seamless: Towers's cost, placement, tracking and animation are optimized to ensure smooth gameplay

- Collision Detection: Circular collision detection of projectiles and enemies works even if projeciles miss one character but intersect another.


Towerguard is built using Pure DOM manipulation to showcase a fundamental understaning of the DOM, HTML and JavaScript.


***
## Functionality
***

- [ ] Users can choose towers and place them on the board

    ```javascript
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

    ```
- [ ] Game keeps track of enemies killed, current bank, health and the wave number

    ```javascript
        for (let i = 0; i < 5; i++) {
                switch (statsTypesArr[i]) {
                case "health": 
                statTitle = document.createTextNode("Health");
                htmlInner = this.health;
                break;

                case "bank":
                    statTitle = document.createTextNode("Bank");
                    htmlInner = this.bank;
                break;

                case "wave":
                    statTitle = document.createTextNode("Wave");
                    htmlInner = this.currWave;
                break;

                case "enemiesLeft":
                    statTitle = document.createTextNode("Enemies");
                    htmlInner = this.baddies.length;
                break;

                case "total-killed":
                    statTitle = document.createTextNode("Dead");
                    htmlInner = this.baddiesDefeated;
                break;
                
                default:
                break;
                }
    ```
- [ ] Enemies are generated and animated randomly on the left side of the board
- [ ] Enemies use a pathfinding algorithm to direct themselves throughout the board to get to home castle
    ```javascript
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
                if(!this.grid[col][row].wall){
                    this.grid[col][row].getLeastNeighborPath();
                }
            }   
        }
    }
    ```
- [ ] Towers track and attack enemies with animated projectiles
- [ ] Collision detection lowers the health of enemies until they are removed from the board or the enemy reach the home castle


### Bonus Features

- [ ] Option to toggle sound effects and/or music
    ```javascript
        document.getElementById("sound-div").addEventListener("click",      function() {
                document.getElementById("sound-div").className = document.getElementById("sound-div").className === "sound-div-on"?
                "sound-div-off"
                :
                "sound-div-on";
        });
    ```
- [ ] Over 10 different enemy sprites that are timed and curated specifically for this game


***
## Challenges
The most challenging aspects of this game are:
- [] Pathfind algorithm and sprite directions derived from this algorithm
- [] Smooth sprite animation from different sizes of sprite sheets
- [] Collision detection and removal of enemies and projectiles
***

### Architecture

Trivialand is built using Dom manipulation of nodes, primarily Canvas and animation of the canvas.

The overall architecture is summarized in the diagram below:

![Splash](./docs/DOM-Node-Tree.png)

***
## UI/UX
***

The goal is to create a unique player experience that is intuitive to use and quick to pick up. Enemy waves are increased by a certain percentage at every wave. Each enemy removed from the board gives the player more health and more coins to buy more towers. The players health decreases everytime an enemy makes it to the home castle. 

Players can click choose from a variety of tower to click place the towers on the board. Enemies will always take the shortest path no matter what is in their way.

The game ends when the players runs out of health.

***
## Overall Project Experience
***

This project was alot of fun to do because of the game animation aspect of sprites, rendering and timing. With the complexity of the pathfinding algorithm and use of the cardinal directions, it was a challenge to align the enemies while at the same time animating them. I learned alot of about collision detection as well and how to effectively remove dead objects from the screen.
***
## Creator
***

Benjamin Rawner


