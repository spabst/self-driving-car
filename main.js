const carCanvas = document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx= carCanvas.getContext("2d");
const networkCtx= networkCanvas.getContext("2d");


const road= new Road(carCanvas.width/2, carCanvas.width*0.9);
const cars =generateCars(100)

const traffic=[
    new Car(road.getLaneCenter(1), -100, 30,50, "DUMMY", 2)
]

animate();

function generateCars(N){
    const cars=[];
    for(let i=0;i<N;i++){
        cars.push( new Car(road.getLaneCenter(1), 100, 30, 50, "AI", maxSpeed=4));
    }
    return cars
}

function animate(time){

    traffic.map(c=>{
        c.update(road.borders,[]);
    })
    cars.map(car=>car.update(road.borders, traffic));
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -cars[0].y + carCanvas.height*0.75);

    road.draw(carCtx);
    traffic.map(c=>{c.draw(carCtx, "purple");});
    carCtx.globalAlpha=0.2;
    cars.map(car=>car.draw(carCtx, "blue"));
    carCtx.globalAlpha=1;
    cars[0].draw(carCtx,"blue", true);
    carCtx.restore();

    networkCtx.lineDashOffset= time/50;
    Visualizer.drawNetwork(networkCtx, cars[0].brain);
    requestAnimationFrame(animate);
}