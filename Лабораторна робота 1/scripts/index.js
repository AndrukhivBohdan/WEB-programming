console.log("Для знаходження всіх сторін та кутів прямокутного трикутника потрібно ввести:");
console.log("Два катети (leg, leg)");
console.log("Катет і гіпотенузу (leg, hypotenuse)");
console.log("Катет і прилеглий гострий кут(leg, adjacent angle)");
console.log("Катет і протилежний гострий кут (leg, opposite angle)");
console.log("Гіпотенузу і гострий кут (hypotenuse, angle)  angle - це один із заданих кутів ");
console.log("При введені кожного аргументу потрібно спочатку вказати значення, а тоді назву в дужках. При вказанні величин кутів використовувати градуси. ");
console.log("Наприклад: triangle\(4, \"leg\", 8, \"hypotenuse\"\)");

class Variable {
    constructor(value,name) {
        this.value = value;
        this.name = name;
    }
}

function triangle(value1,name1,value2,name2){

    const variable1 = new Variable(value1, name1);
    const variable2 = new Variable(value2, name2);
    let mas = [variable1,variable2];
    if(!checkName(mas)){
        console.log("Введено некоректну назву елементу або несумісну пару. Слід ще раз перечитати інструкцію. ");
        return "failed";
    }

    if(!checkValue(mas)){
        console.log("Некоректно уведені значення");
        return "failed";
    }

    for(let i = 0;i<mas.length;i++){
        const element = mas[i];
        const another = anotherElement(mas, i);
        let a,b,c,alpha,beta;

        if(element.name=="leg"){
            switch(another.name){
                case "leg": 
                    a = element.value;
                    b = another.value;
                    c=Math.sqrt(a*a+b*b);
                    alpha = radiansToDegrees(aaa);
                    beta = radiansToDegrees(bbb);
                    showData(a, b, c, alpha, beta);
                    break;
                case "hypotenuse":
                    a = element.value;
                    c=another.value;
                    b = Math.sqrt(c**2-a**2);
                    alpha =radiansToDegrees(Math.atan(a/b));
                    beta = radiansToDegrees(Math.atan(b/a));
                    showData(a, b, c, alpha, beta);
                    break;  
                case "adjacent angle":
                    a = element.value;
                    beta = another.value;
                    alpha = 90 - beta;
                    b = a*Math.tan(degreesToRadians(beta));
                    c = a/Math.cos(degreesToRadians(beta));
                    showData(a, b, c, alpha, beta);
                    break;
                case "opposite angle":
                    a = element.value;
                    alpha = another.value;
                    beta = 90 - alpha;
                    c = a/Math.sin(degreesToRadians(alpha));
                    b = a*Math.tan(degreesToRadians(beta));
                    showData(a, b, c, alpha, beta);
                    break;
            }

            return "success";
        }
        // Що краще? запис зверху чи знизу 
        else if(element.name == "angle"){
            showData(//another це гіпотинуза
                another.value*Math.sin(element.value*Math.PI/180), // a
                another.value*Math.sin(90 - element.value*Math.PI/180), // b
                another.value, // c
                element.value, // alpha
                90 - element.value // beta
            );
            
            return "success";
        }
    }

    function anotherElement(arr, index) {
        return arr[(index + 1) % arr.length];
    }

    function showData(a,b,c,alpha,beta){
        console.log("a = "+a);
        console.log("b = "+b);
        console.log("c = "+c);
        console.log("alpha = " + alpha);
        console.log("beta = " + beta);
    }

    function degreesToRadians(angle){
        return angle*Math.PI/180;
    }
    function radiansToDegrees(angle){
        return angle/Math.PI*180;
    }

    function checkValue(mas) {
        for (let i = 0; i < mas.length; i++) {
            const element = mas[i];
            const another = anotherElement(mas, i);
    
            if (element.name === "leg" && another.name === "hypotenuse" && element.value >= another.value) {
                return false;
            }
    
            switch (element.name) {
                case "leg":
                case "hypotenuse":
                    if (isNaN(element.value) || element.value <= 0 || Math.atan(element.value/another.value) > 1.57079632679) return false;
                    break;
    
                case "adjacent angle":
                case "opposite angle":
                case "angle":
                    if (element.value <= 0 || element.value >= 90) return false;
                    if (element.value < 0.000000000001) return false;
                    break;
            }
        }
        return true; 
    }
    
    function checkName(mas){
        for(let i = 0;i<mas.length;i++){
            const element = mas[i];
            const another = anotherElement(mas, i);

            if(!["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"].includes(element.name)){
                return false;
            }
            if(element.name=="leg" && another.name=="angle"){
                return false;
            }
            if(element.name=="hypotenuse" && ["adjacent angle", "opposite angle","hypotenuse"].includes(another.name)){
                return false;
            }
            if(element.name=="adjacent angle" && ["adjacent angle", "opposite angle", "hypotenuse", "angle"].includes(another.name)){
                return false;
            }
            if(element.name=="opposite angle" && ["adjacent angle", "opposite angle", "hypotenuse", "angle"].includes(another.name)){
                return false;
            }
            if(element.name=="angle" && ["adjacent angle", "opposite angle", "angle", "leg"].includes(another.name)){
                return false;
            }
        }
        return true;
    }
}