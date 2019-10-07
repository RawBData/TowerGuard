const Projectile = require("./projectile");


class Tower{

    constructor(cost, towerImage, projectileImg, game, loc = {x:600,y:300}, firingRange=300){
        this.cost = cost;
        this.image = towerImage;
        this.projectileImg = projectileImg;
        this.location = loc;
        this.enemyOrientationAngle = 0;
        this.game = game;
        this.placed = false;
        this.shouldDraw = false;
        this.firingRange = firingRange;
        this.projectileSpeed = 6;

        this.lastFired = Date.now();
        this.reloadTime = 500;
        console.log("tower constructed")

        this.shoot = this.shoot.bind(this);
    }

    checkForBaddies(){
        let dx = this.location.x - this.game.mouseX;
        let dy = this.location.y - this.game.mouseY;

        let distanceToTarget = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))

        if (Date.now()-this.reloadTime > this.lastFired && distanceToTarget <= this.firingRange && this.placed){
            this.shoot();
            this.lastFired = Date.now();
        }
    }

    shoot(){
        console.log("shooting")
        let newProj = new Projectile({x:this.location.x, y:this.location.y}, this.enemyOrientationAngle, this.projectileImg, this.projectileSpeed, this.game)
        this.game.projectiles.push(newProj);
    }

    run(){
        this.update();
        this.checkForBaddies();
        this.draw();
    }

    update(){
        let dx = this.location.x - this.game.mouseX;
        let dy = this.location.y - this.game.mouseY;
        this.enemyOrientationAngle = Math.atan2(dx,dy)-Math.PI;
    }

    draw(){
        this.game.ctx.save();
        this.game.ctx.translate(this.location.x,this.location.y);
        if(this.shouldDraw){
            this.game.ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2)
        }
        this.game.ctx.restore();
    }


}

module.exports = Tower;