const canvas = document.getElementById("myCanvas");
canvas.width=200;

const ctx= canvas.getContext("2d");
const road= new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", maxSpeed=4);

const traffic=[
    new Car(road.getLaneCenter(1), -100, 30,50, "DUMMY", 2)
]

animate();

function animate(){

    traffic.map(c=>{
        c.update(road.borders,[]);
    })
    car.update(road.borders, traffic);
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.75);

    road.draw(ctx);
    traffic.map(c=>{c.draw(ctx, "purple");})
    car.draw(ctx, "blue");
    ctx.restore();
    requestAnimationFrame(animate);
}