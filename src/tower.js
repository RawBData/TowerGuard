
class Tower{

    constructor(cost, towerImage, bulletImage, ctx, loc){
        this.cost = cost;
        this.image = towerImage;
        this.bullet = bulletImage;
        this.location = loc;
        this.orientationAngle = 0;
        this.ctx = ctx;
        this.placed = false;
        this.visible = false;
        console.log("tower constructed")
    }

    checkForBaddies(){

    }

    run(){
        this.update();
        this.render();
    }

    update(){

    }

    render(ctx){
        ctx.save();
        ctx.translate(this.location.x,this.location.y);
        ctx.rotate(this.orientationAngle);
        if(this.visible){
            ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2)
        }
        ctx.restore();
    }


}

module.exports = Tower;