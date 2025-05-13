document.addEventListener("DOMContentLoaded", function () {
    let arr = [];
    let number;
    let intervalId = null;
    let time = 0;
    let timerStarted = false;

    const timer = document.getElementById("timer");
    const count = document.getElementById("changes");

    function startTimer() {
        if (intervalId !== null) return; // таймер вже запущений
        intervalId = setInterval(() => {
            time++;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            timer.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
        timerStarted = true;
    }

    function resetTimer() {
        clearInterval(intervalId);
        intervalId = null;
        time = 0;
        timer.textContent = "Time: 0:00";
        timerStarted = false;
    }

    function loadMap(n) {
        $ajaxUtils.sendGetRequest(`maps/map${n}.json`, function (res) {
            arr = res["map"];
            document.getElementById("target").textContent = "Target: " + res["target"];
            renderField(arr);
            resetTimer(); // скидає таймер при новій/рестарт грі
        });
    }

    document.getElementById("new").addEventListener("click", function () {
        number = Math.floor(Math.random() * 3) + 1;
        loadMap(number);
    });

    document.getElementById("restart").addEventListener("click", function () {
        if (number) loadMap(number);
    });

function renderField(map) {
  const field = document.getElementById("field");
  let count = document.getElementById("changes");
  count.textContent = "Count: 0";
  let c = 0;
  let lastClick = { row: -1, col: -1,value:0};
  let alreadyDecreased = false;

  field.innerHTML = ''; // очищає тільки поле

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;

      cell.style.backgroundColor = map[i][j] === 1 ? 'white' : 'black';

      field.appendChild(cell);
    }
  }

  field.onclick = function (event) {
    if (!event.target.classList.contains("cell")) return;

    if (!timerStarted) {
        startTimer(); // запускаємо таймер при першому кліку
    }

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    // якщо клікаємо по тій самій клітинці, і ще не зменшили count
    if (lastClick.row === row && lastClick.col === col) {
      if (!alreadyDecreased) {
        c--;
        lastClick.col = -1;
        lastClick.row = -1;
        alreadyDecreased = true;
      }
    } else {
      c++;
      lastClick = { row, col };
      alreadyDecreased = false;
    }

    count.textContent = "Count: " + c;

    toggleColor(row, col);         // натиснута клітинка
    toggleColor(row - 1, col);     // верхня
    toggleColor(row + 1, col);     // нижня
    toggleColor(row, col - 1);     // ліва
    toggleColor(row, col + 1);     // права
  };

  function toggleColor(i, j) {
    const cell = field.querySelector(`[data-row="${i}"][data-col="${j}"]`);
    if (cell) {
      const currentColor = cell.style.backgroundColor;
      cell.style.backgroundColor = (currentColor === 'black') ? 'white' : 'black';
    }
  }
}

});