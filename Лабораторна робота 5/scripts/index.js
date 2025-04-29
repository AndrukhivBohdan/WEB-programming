const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');
const colorSelect = document.getElementById('color');



startButton.addEventListener('click', function() {
    let score = 0;
    let timeLeft = 0;
    let intervalId = null;
    let gameActive = false;
    let initialTime = 0;

    if (colorSelect.value == 0 || difficultySelect.value == 0) {
        return;
    }

    const selectedColor = colorSelect.value.toLowerCase();
    const selectedDifficulty = parseInt(difficultySelect.value);

    document.body.innerHTML = '';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.textContent = 'Score: 0';
    scoreDisplay.style.fontSize = '24px';

    const timeDisplay = document.createElement('div');
    timeDisplay.textContent = 'Time left for click: 0';
    timeDisplay.style.fontSize = '24px';

    document.body.appendChild(scoreDisplay);
    document.body.appendChild(timeDisplay);

    const square = document.createElement('div');
    square.style.width = '30px';
    square.style.height = '30px';
    square.style.position = 'absolute';
    square.style.backgroundColor = selectedColor;
    document.body.appendChild(square);

    if (selectedDifficulty == 1) initialTime = 2;
    else if (selectedDifficulty == 2) initialTime = 3;
    else if (selectedDifficulty == 4) initialTime = 5;

    timeLeft = initialTime;
    timeDisplay.textContent = `Time left for click: ${timeLeft}`;
    gameActive = true;

    intervalId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timeDisplay.textContent = `Time left for click: ${timeLeft}`;
        } else {
            clearInterval(intervalId);
            gameActive = false;
            alert("Game over! Your score is " + score + ",congratulations! Pleace reload the page to start a new game.");
        }
    }, 1000);

    let prevX = 100;
    let prevY = 100;
    square.style.left = `${prevX}px`;
    square.style.top = `${prevY}px`;
    
    square.addEventListener('click', function () {
        if (!gameActive) return;
    
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    
        timeLeft = initialTime;
        timeDisplay.textContent = `Time left for click: ${timeLeft}`;
    
        const maxWidth = window.innerWidth - 100;
        const maxHeight = window.innerHeight - 100;
    
        let moveRange;
        if (selectedDifficulty === 4) moveRange = 500;
        else if (selectedDifficulty === 2) moveRange = 700;
        else moveRange = 1500; 
    
        const deltaX = (Math.random() - 0.5) * moveRange;
        const deltaY = (Math.random() - 0.5) * moveRange;
    
        let newX = Math.min(Math.max(prevX + deltaX, 0), maxWidth);
        let newY = Math.min(Math.max(prevY + deltaY, 0), maxHeight);
    
        square.style.left = `${newX}px`;
        square.style.top = `${newY}px`;
    
        prevX = newX;
        prevY = newY;
    });
});
