class Car{
    constructor(x,y,width, height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=4;
        this.friction=0.05;

        this.angle=0;
        this.damaged=false;

        this.sensor = new Sensor(this)
        this.controls= new Controls()
    }

    update(roadBorders){
        this.#move();
        this.polygon= this.#createPolygon()
        this.damaged=this.#assessDamage(roadBorders);
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders){
        const damages = roadBorders.some(border=>{
            return polysIntersect(this.polygon, border);
        })
        return damages? true: false;
    }

    #createPolygon(){
        const points=[];
        const radius=Math.hypot(this.width, this.height)/2;
        const alpha= Math.atan2(this.width, this.height);
        // top-right angle
        points.push({
            x: this.x-Math.sin(this.angle-alpha)*radius,
            y: this.y-Math.cos(this.angle-alpha)*radius,
        });
        points.push({
            x: this.x-Math.sin(this.angle+alpha)*radius,
            y: this.y-Math.cos(this.angle+alpha)*radius,
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-alpha)*radius,
            y: this.y-Math.cos(Math.PI+this.angle-alpha)*radius,
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+alpha)*radius,
            y: this.y-Math.cos(Math.PI+this.angle+alpha)*radius,
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if (this.speed> this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if (this.speed<- this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)< this.friction){this.speed=0;}

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;

            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }

        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        if(this.damaged)(
            ctx.fillStyle="gray"
        )
        else{
            ctx.fillStyle="blue"
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        this.polygon.slice(1).map(point=>{
            ctx.lineTo(point.x, point.y);
        })
        ctx.fill();

        this.sensor.draw(ctx)

    }
}