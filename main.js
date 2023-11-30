const carCanvas = document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx= carCanvas.getContext("2d");
const networkCtx= networkCanvas.getContext("2d");


const road= new Road(carCanvas.width/2, carCanvas.width*0.9);

const N=200;
const cars =generateCars(N)
let bestCar= cars[0];
if(localStorage.getItem("bestBrain")){
    for (let i=0;i<cars.length;i++){

        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1), -100, 30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30,50, "DUMMY", 2),
]

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain")
}

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

    bestCar=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.75);

    road.draw(carCtx);
    traffic.map(c=>{c.draw(carCtx, "purple");});
    carCtx.globalAlpha=0.1;
    cars.map(car=>car.draw(carCtx, "blue"));
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue", true);
    carCtx.restore();

    networkCtx.lineDashOffset= time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}