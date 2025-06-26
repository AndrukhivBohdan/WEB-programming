//3
const car1 = new Object();
car1.color = "green";
car1.maxSpeed = 90;
car1.driver = {name:"Андрухів Богдан",category:"C",personalLimitations:"No driving at night"};
car1.tuning = true;
car1.numberOfAccindents = 0;

//4
const car2 = {
    color: "red",
    maxSpeed: 110,
    driver:{name:"Андрухів Богдан",category:"B",personalLimitations: null},
    tuning: false,
    numberOfAccindents: 2
}

//5
car1.drive = function(){
    return console.log("I am not driving at night");
}
car1.drive();

//6
car2.drive = function(){
    return console.log("I can drive anytime");
}
car2.drive();

//7
function Truck(color,weight,avgSpeed,brand,model){
    this.color = color;
    this.weight = weight;
    this.avgSpeed = avgSpeed;
    this.brand = brand;
    this.model = model;

    //9
    this.trip = function(){
        
        if(!this.driver){
            console.log("No driver assigned");
        }else{
            console.log(
                `Driver ${this.driver.name} ` + 
                (this.driver.nightDriving ? "drives at night" : "does not drive at night") + 
                ` and has ${this.driver.experience} years of experience.`
            );
        }
    }
}

//8
Truck.prototype.AssignDriver = function(name,nightDriving,experience){
    this.driver = {
        name:name,
        nightDriving:nightDriving,
        experience:experience
    };
};

//10
let truck1 = new Truck("red",10,120,"Web",2);
let truck2 = new Truck("blue",21,90,"Ford","Mustang");

truck1.AssignDriver("Вова",true,10);
truck1.AssignDriver("Бодя",false,5);

truck1.trip();
truck2.trip();

//12-15
class Square{
    constructor(a){
        this.a = a;
    }
    
    static help() {
        console.log("Квадрат — це чотирикутник із чотирма рівними сторонами.");
        console.log("У квадрата всі кути прямі (по 90 градусів).");
        console.log("Діагоналі квадрата рівні та перетинаються під прямим кутом.");
        console.log("Формула площі квадрата: S = a * a, де a — сторона квадрата.");
    }
    length (){
        return this.a*4;
    }
    square(){
        return this.a*this.a;
    }
    info(){
        console.log("Довжина всіх 4 сторін: " + this.a);
        console.log("Величини всіх 4 кутів: 90");
        console.log("Сума довжин всіх сторін: " + this.length());
        console.log("Площа: " + this.square());
    }
}

//16-17
class Rectangle extends Square{
    constructor(a,b){
        super(a);
        this.b = b;
    }
    static help(){
    console.log("Прямокутник — чотирикутник із паралельними сторонами.");
    console.log("У прямокутника всі кути прямі.");
    console.log("Формула площі прямокутника: S = width * height.");
    console.log("Формула периметру прямокутника: P = 2 * (width + height).");
    }
    length(){
        return 2 * (this.a + this.b);
    }

    square(){
        return this.a * this.b;
    }
    info(){
        console.log("Ширина: " + this.a);
        console.log("Висота: " + this.b);
        console.log("Величини кожного кута: 90");
        console.log("Сума довжин всіх чотирьох сторін: " + this.length()); 
        console.log("Площа: " + this.square()); 
    }

    //22
    get A(){return this.a};
    set A(a){this.a = a};

    get B(){return this.b};
    set B(b){this.b = b};
}

//18-19
class Rhombus extends Square{
    constructor(a,alpha,beta){
        super(a);
        this.alpha = alpha;
        this.beta = beta;
    }
    static help(){
        console.log("Ромб — чотирикутник із рівними сторонами.");
        console.log("У ромба всі сторони рівні, а кути — парами рівні.");
        console.log("Формула площі ромба: S = (d1 * d2)/2.");
        console.log("Формула периметру ромба: P = 4 * a.");
    }
    length(){
        return this.a *4;
    }
    square(){
        return this.a*this.a * Math.sin(this.alpha * Math.PI / 180);
    }
        info(){
        console.log("Довжина всіх 4 сторін: " + this.a);
        console.log("Величини кута alpha: " + this.alpha);
        console.log("Величини кута beta: " + this.beta);
        console.log("Сума довжин всіх чотирьох сторін: " + this.length()); 
        console.log("Площа: " + this.square()); 
    }
}

//20-21
class Parallelogram extends Rhombus{

    constructor(a,b,alpha,beta){
        super(a,alpha,beta)
        this.b = b;
    }
    static help(){
        console.log("Паралелограм - це чотирикутник, у якого протилежні сторони попарно паралельні");
    }
    length(){
        return 2*this.a+2*this.b;
    }
    square(){
        return this.a * this.b * Math.sin(this.alpha * Math.PI / 180);
    }
    info(){
        console.log("Довжина всіх 4 сторін: " + this.a);
        console.log("Величини кута alpha: " + this.alpha);
        console.log("Величини кута beta: " + this.beta);
        console.log("Сума довжин всіх чотирьох сторін: " + this.length()); 
        console.log("Площа: " + this.square()); 
    }
}

//23
Square.help();
Rectangle.help();
Rhombus.help();
Parallelogram.help();

//24
let square = new Square(5);
let rectangle = new Rectangle(5,7);
let rhombus = new Rhombus(3,40,50);
let parallelogram = new Parallelogram(5, 8, 100, 53);

square.info();
rectangle.info();
rhombus.info();
parallelogram.info();

//25
function Triangular(a = 3,b = 4,c = 5){
    return {a,b,c};
}

//26
console.log("Triangular1 ",Triangular(1,4,6));
console.log("Triangular2 ",Triangular());
console.log("Triangular3 ",Triangular(1,1,1));

//27
function PiMultiplier(a){
    return function(){
        return Math.PI*a;
    }
}

//28
let firstF = PiMultiplier(2);
let secondF = PiMultiplier(2/3);
let thirdF = PiMultiplier(1/2);

console.log(`FirstF = ${firstF()}\tSecondF = ${secondF()}\tThirdF = ${thirdF()}`)

//29
function Painter(color){
    return function(obj){
        console.log(color+" color");
        if (obj.type) {
            console.log(obj.type+" type");
        } else {
            console.log("«No ‘type’ property occurred!»");
        }
    }
}

//30
let PaintBlue = Painter("Blue");
let PaintRed = Painter("Red");
let PaintYellow = Painter("Yellow");

let obj1 = { maxSpeed: 280, type: "Sportcar", color: "magenta" };
let obj2 = { type: "Truck", avgSpeed: 90, loadCapacity: 2400 };
let obj3 = { maxSpeed: 180, color: "purple", isCar: true };

//31
PaintBlue(obj1);
PaintRed(obj2);
PaintYellow(obj3);
