
let Projectile = function(location, enemyOrientationAngle, prjImg, velocity = 6, game){
    this.location = location;
    this.enemyOrientationAngle = enemyOrientationAngle;
    this.prjImg = prjImg;
    this.velocity = velocity;
    this.game = game;

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

    collided:function(){
        this.game.ctx.save();
        this.game.ctx.translate(this.location.x,this.location.y);
        this.game.ctx.rotate(this.enemyOrientationAngle);
        this.game.ctx.drawImage(this.prjImg, -this.prjImg.width/2, -this.prjImg.height/2)
        this.game.ctx.restore();

    },

    isOutOfBounds:function(){
        let height = this.game.height;
        let width = this.game.width;

        if (this.location.x < 0 || this.location.y < 0 || this.location.x > width || this.location.y > height) this.game.remove("projectile",this);
    },


}

module.exports = Projectile;
