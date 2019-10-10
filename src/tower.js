const Projectile = require("./projectile");
const Sound = require('./sound');


class Tower{

    constructor(cost, towerImage, projectileImg, game, loc = {x:600,y:300}, firingRange=300){
        this.game = game;
        this.cost = cost;
        this.image = towerImage;
        this.projectileImg = projectileImg;
        this.location = loc;
        this.enemyOrientationAngle = 0;
        this.baddies = game.baddies;
        this.placed = false;
        this.shouldDraw = false;
        this.firingRange = firingRange;
        this.projectileSpeed = 30;
        this.shootSound = new Sound('../assets/arrow.mp3');

        this.lastFired = Date.now();
        this.reloadTime = 500;

        this.shoot = this.shoot.bind(this);
    }

    checkForBaddies(target){
        let dx = this.location.x - target.x;
        let dy = this.location.y - target.y;
        // let ex = this.location.x - this.enemy

        let distanceToTarget = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))

        if (Date.now()-this.reloadTime > this.lastFired && distanceToTarget <= this.firingRange && this.placed){
            this.shoot();
            this.shootSound.play();
            this.lastFired = Date.now();
        }
    }

    shoot(){
        let newProj = new Projectile({x:this.location.x, y:this.location.y}, this.enemyOrientationAngle, this.projectileImg, this.projectileSpeed, this.game)
        this.game.projectiles.push(newProj);
    }

    run(){
        this.update();
        //this.checkForBaddies();
        this.draw();
    }

    update(){
        this.baddy = this.findBaddy()
        let dx;
        let dy;;
        if (this.baddy){
            dx = this.location.x - this.baddy.center.x;
            dy = this.location.y - this.baddy.center.y; 
            this.target = this.baddy.center;
            this.enemyOrientationAngle = Math.atan2(dx,dy)-Math.PI;

            let distanceToTarget = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );
            
            if (Date.now()-this.reloadTime > this.lastFired && distanceToTarget <= this.firingRange && this.placed){
                this.shootSound.play();
                this.shoot();
                this.lastFired = Date.now();
            }

        }else{
            dx = this.location.x - this.game.mouseX;
            dy = this.location.y - this.game.mouseY;
            this.enemyOrientationAngle = Math.atan2(dx,dy)-Math.PI;
        
        }
    }

    draw(){
        this.game.ctx.save();
        this.game.ctx.translate(this.location.x,this.location.y);
        if(this.shouldDraw){
            this.game.ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2)
        }
        this.game.ctx.restore();
    }

    findDist(pos1, pos2) {
        return Math.sqrt(
          Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        );
    }

    findBaddy(){
        for(let i=0;i<this.baddies.length;i++){
        //checking center of all baddies and attacking closest one
        let baddy = this.baddies[i]
        let distance = this.findDist(baddy.center, this.location)
          if(distance < this.firingRange){
            return this.baddies[i]
          }
        }
      }

}

module.exports = Tower;