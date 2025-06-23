let allItems = [];
let buyersGlobal = [];
let simulationTimeouts = [];
let simulationRunning = false;
let simulationInterrupted = false;
let skipAnimation = false;
let playerScore = 0;
let simulationStartTime = 0;
let totalBuyers = 0;
let completedBuyers = 0;

function updateGameScore(points) {
  playerScore += points;
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = playerScore;
}

function calculateBuyerScore(buyer) {
  const itemCount = buyer.purchasedItems.length;
  if (itemCount >= 5) return 10;
  if (itemCount >= 3) return 5;
  if (itemCount >= 1) return 2;
  return -5;
}

function showGameSummary() {
  const timeElapsed = Math.floor((Date.now() - simulationStartTime) / 1000);
  const summaryHtml = `
    <div class="game-summary">
      <h2>🏁 Гру завершено!</h2>
      <p><strong>Кількість покупців:</strong> ${totalBuyers}</p>
      <p><strong>Набрані очки:</strong> ${playerScore}</p>
      <p><strong>Час проходження:</strong> ${timeElapsed} с</p>
    </div>
  `;
  const container = document.getElementById("main-content");
  container.insertAdjacentHTML("beforeend", summaryHtml);
}

function loadAllItems(callback) {
  $ajaxUtils.sendGetRequest("data/categories.json", function (categories) {
    let remaining = categories.length;
    if (remaining === 0) {
      if (callback) callback();
      return;
    }
    categories.forEach((cat) => {
      const url = `data/catalog/${cat.short_name}.json`;
      $ajaxUtils.sendGetRequest(url, function (catalogData) {
        const items = catalogData.catalog_items.map((item) => {
          item.categoryShort = cat.short_name;
          item.categoryName = cat.CategoryName;
          return item;
        });
        allItems = allItems.concat(items);
        remaining--;
        if (remaining === 0 && callback) {
          callback();
        }
      });
    });
  });
}

function simulateBuyerPurchase(buyer) {
  if (!allItems || allItems.length === 0) return;
  for (let i = 0; i < buyer.viewLimit; i++) {
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    const categoryType = randomItem.category_type || "no_discount";
    if (buyer.decideToBuy(categoryType)) {
      buyer.buy(randomItem);
    }
  }
}

function simulateBuyers(buyerCount) {
  const buyers = [];
  for (let i = 0; i < buyerCount; i++) {
    const buyer = BuyerFactory.createBuyer();
    simulateBuyerPurchase(buyer);
    buyer.assignColorClass();
    buyers.push(buyer);
  }
  return buyers;
}

function makeBuyerRemovable(buyerEl) {
  buyerEl.addEventListener("click", () => {
    const buyerId = buyerEl.dataset.buyerId;
    const buyer = buyersGlobal.find((b) => b.id == buyerId);
    if (buyer) {
      const points = calculateBuyerScore(buyer);
      updateGameScore(points);
    }
    buyerEl.remove();
    completedBuyers++;
    updateGameScore(1);

    if (completedBuyers === totalBuyers && !simulationInterrupted) {
      showGameSummary();
      simulationRunning = false;
    }
  });
}

function startSim(buyerCount) {
  if (simulationRunning) {
    alert("Симуляція вже виконується.");
    return;
  }
  simulationRunning = true;
  simulationInterrupted = false;
  skipAnimation = false;
  buyersGlobal = [];
  playerScore = 0;
  simulationStartTime = Date.now();
  totalBuyers = buyerCount;
  completedBuyers = 0;

  const container = document.getElementById("buyers-container");
  const queues = document.querySelectorAll(".queue");
  container.innerHTML = "";
  document.querySelectorAll(".game-summary").forEach((el) => el.remove());

  const scoreboard = document.getElementById("score");
  if (scoreboard) scoreboard.textContent = "0";

  loadAllItems(() => {
    if (!allItems || allItems.length === 0) {
      alert("Не вдалося завантажити товари для симуляції.");
      simulationRunning = false;
      return;
    }

    buyersGlobal = simulateBuyers(buyerCount);

    for (let i = 0; i < buyerCount; i++) {
      if (simulationInterrupted) break;

      const el = document.createElement("div");
      el.classList.add("entering-buyer");
      el.dataset.buyerId = buyersGlobal[i].id;
      makeBuyerRemovable(el);

      const offset = Math.floor(Math.random() * 40) - 20;
      el.style.left = `calc(50% + ${offset}px)`;

      const timeoutId = setTimeout(() => {
        if (simulationInterrupted || skipAnimation) return;

        container.appendChild(el);
        el.style.animation = "moveUp 3s linear forwards";

        el.addEventListener("animationend", () => {
          el.remove();
          setTimeout(() => {
            if (simulationInterrupted || skipAnimation) return;
            moveToQueue(
              queues,
              () => {
                completedBuyers++;
                updateGameScore(1);
                if (
                  completedBuyers === buyerCount &&
                  !simulationInterrupted &&
                  !skipAnimation
                ) {
                  showGameSummary();
                  simulationRunning = false;
                }
              },
              buyersGlobal[i]
            );
          }, 300 + Math.random() * 1000);
        });
      }, i * 400);
      simulationTimeouts.push(timeoutId);
    }

    if (skipAnimation) {
      buyersGlobal.forEach((b) => updateGameScore(calculateBuyerScore(b) + 1));
      showGameSummary();
      simulationRunning = false;
    }
  });
}

function moveToQueue(queues, onComplete, buyerData) {
  if (simulationInterrupted) return;
  const buyer = document.createElement("div");
  buyer.classList.add("buyer");

  buyer.classList.add(buyerData.colorClass);
  buyer.dataset.buyerId = buyerData.id;
  makeBuyerRemovable(buyer);

  const targetQueue = Array.from(queues).reduce((shortest, current) =>
    current.children.length < shortest.children.length ? current : shortest
  );

  targetQueue.appendChild(buyer);
  positionBuyersInQueue(targetQueue);
  handleQueue(targetQueue, onComplete);
}

function positionBuyersInQueue(queue) {
  const buyers = queue.querySelectorAll(".buyer");
  buyers.forEach((buyer, index) => {
    buyer.style.position = "absolute";
    buyer.style.left = "50%";
    buyer.style.transform = "translateX(-50%)";
    buyer.style.bottom = `${index * 35}px`;
  });
}

function handleQueue(queue, onComplete) {
  if (simulationInterrupted || queue.dataset.serving === "true") return;
  const buyer = queue.querySelector(".buyer");
  if (!buyer) return;

  queue.dataset.serving = "true";

  const store = document.getElementById("store-layout");
  const buyerRect = buyer.getBoundingClientRect();
  const storeRect = store.getBoundingClientRect();

  const initialLeft = buyerRect.left - storeRect.left;
  const initialTop = buyerRect.top - storeRect.top;

  const buyerData = buyersGlobal.find((b) => b.id == buyer.dataset.buyerId);
  const movingBuyer = document.createElement("div");
  movingBuyer.className = "buyer " + buyerData.colorClass;
  movingBuyer.style.position = "absolute";
  movingBuyer.dataset.buyerId = buyer.dataset.buyerId;
  makeBuyerRemovable(movingBuyer);
  movingBuyer.style.left = `${initialLeft}px`;
  movingBuyer.style.top = `${initialTop}px`;

  store.appendChild(movingBuyer);
  buyer.remove();

  const cashier = queue.parentElement.querySelector(".cashier");
  const cashierRect = cashier.getBoundingClientRect();

  const targetLeft =
    cashierRect.left + cashierRect.width / 2 - storeRect.left - 10;
  const targetTop =
    cashierRect.top + cashierRect.height / 2 - storeRect.top - 10;

  movingBuyer.style.transition = "transform 1s linear";
  const dx = targetLeft - initialLeft;
  const dy = targetTop - initialTop;
  movingBuyer.style.transform = `translate(${dx}px, ${dy}px)`;

  const buyerScore = buyerData.getScore();
  const baseTime = 2000;
  const multiplier = 400;
  const randomOffset = Math.random() * 800;

  const serviceTime = Math.max(
    1000,
    baseTime + buyerScore * multiplier + randomOffset
  );

  setTimeout(() => {
    const finalLeft = initialLeft + dx;
    const finalTop = initialTop + dy;

    movingBuyer.style.transition = "none";
    movingBuyer.style.transform = "none";
    movingBuyer.style.left = `${finalLeft}px`;
    movingBuyer.style.top = `${finalTop}px`;

    requestAnimationFrame(() => {
      movingBuyer.style.transition = "top 1.5s linear";
      movingBuyer.style.top = `${finalTop + 200}px`;
    });

    setTimeout(() => {
      movingBuyer.remove();
      queue.dataset.serving = "false";
      positionBuyersInQueue(queue);
      handleQueue(queue, onComplete);

      updateGameScore(buyerScore);

      if (onComplete) onComplete();
    }, 1700);
  }, serviceTime);
}
