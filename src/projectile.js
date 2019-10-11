
const Character = require('./characters');

let Projectile = function(location, enemyOrientationAngle, prjImg, velocity = 6, game, damage = 25, radius = 25, ){
    this.location = location;
    this.enemyOrientationAngle = enemyOrientationAngle;
    this.prjImg = prjImg;
    this.velocity = velocity;
    this.game = game;
    this.radius = radius;
    this.damage = damage
    

}

Projectile.prototype = {
    run:function(){
        this.update();
        this.draw();
    },
    
    update:function(){
        this.isOutOfBounds();
        this.location.x += Math.sin(this.enemyOrientationAngle)*this.velocity;
        this.location.y += Math.cos(this.enemyOrientationAngle)*this.velocity;

    },
    
    draw:function(){
        this.game.ctx.save();
        this.game.ctx.translate(this.location.x,this.location.y);
        this.game.ctx.rotate(this.enemyOrientationAngle);
        this.game.ctx.drawImage(this.prjImg, -this.prjImg.width/2, -this.prjImg.height/2)
        this.game.ctx.restore();

    },

    
    isOutOfBounds:function(){
        let height = this.game.ctx.canvas.height;
        let width = this.game.ctx.canvas.width;
        
        if (this.location.x < 0 || this.location.y < 0 || this.location.x > width || this.location.y > height){ 
            this.game.remove("projectile",this)
        };
    },
    
    collided:function(otherObject){
        let distance = this.findDist(otherObject.center,this.location)
        return (this.radius + otherObject.radius) > distance;

    },

    collideWith:function(otherObject) {
        if (otherObject instanceof Character) {
          otherObject.health -= this.damage;
          this.game.remove("projectile",this)
          return true;
        }
        return false;
    },

    findDist:function(pos1, pos2) {
        return Math.sqrt(
          Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        );
    }
      

}

module.exports = Projectile;
