(function (global) {
  const ns = {};

  const homeHtml = "snippets/home-snippet.html";
  const allCategoriesUrl = "data/categories.json";
  const categoriesTitleHtml = "snippets/categories-title-snippet.html";
  const categoryHtml = "snippets/category-snippet.html";
  const catalogItemUrl = "data/catalog/";
  const catalogItemTitleHtml = "snippets/catalog-items-title.html";
  const catalogItemHtml = "snippets/catalog-item.html";
  const simulationTitle = "snippets/simulation-title.html";

  const insertHtml = function (selector, html) {
    const targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };
  const showLoading = function (selector) {
    let html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif' alt='loading'></div>";
    insertHtml(selector, html);
  };
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content").innerHTML = responseText;
      },
      false
    );
    const toggleButton = document.getElementById("menu-toggle");
    const navList = document.getElementById("nav-list");

    if (toggleButton && navList) {
      toggleButton.addEventListener("click", function () {
        navList.classList.toggle("show");
      });
    }
  });

  const insertProperty = function (string, propName, propValue) {
    const propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  function insertPrice(html, amountPropName, item, finalPrice) {
    if (!item.discount) {
      html = insertProperty(html, amountPropName, item.price + "$");
      return html;
    }
    item =
      "<div><s>" +
      item.price +
      "$</s><span style='color: green;'> -" +
      item.discount +
      "%<span></div>";
    item += finalPrice + "$";
    html = insertProperty(html, amountPropName, item);
    return html;
  }

  const switchCatalogToActive = function () {
    let classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navCatalogButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navCatalogButton").className = classes;
    }
  };

  ns.about = function () {
    alert(
      "Про сайт\nЦей односторінковий вебсайт розроблений Андрухів Б.В., Айб О. Р., Горайчук М. О.\nЙого мета — зручно представити каталог товарів із можливістю перегляду категорій, описів та цін.\n\nДані сайту зберігаються у форматі JSON, що забезпечує швидке завантаження без використання повноцінної бази даних.\nФункціональність реалізована на JavaScript без сторонніх фреймворків, з акцентом на простоту, адаптивність і легкість підтримки."
    );
  };
  ns.loadCatalogCategories = function () {
    showLoading("#main-content");
    switchCatalogToActive();
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  ns.loadCatalogItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      catalogItemUrl + categoryShort + ".json",
      buildAndShowCatalogItemsHTML
    );
  };

  ns.initGameRulesButton = function () {
    const rulesBtn = document.getElementById("game-rules-btn");
    if (rulesBtn) {
      rulesBtn.addEventListener("click", function () {
        alert(
          "Правила гри:\n\n" +
            "Мета: Отримати якомога більше очок, обслуговуючи покупців.\n\n" +
            "Типи покупців:\n" +
            "🟥 Вигідні — купують багато, приносять до 12 очок, але займають касу довше.\n" +
            "🟧 Середні — 3–4 покупки, 5 очок.\n" +
            "🟨 Малі — 1–2 покупки, 1 очко.\n" +
            "⬛ Шкідники — не купують нічого, забирають -5 очок.\n\n" +
            "Покупці автоматично переміщуються на каси. Кожен обробляється послідовно.\n" +
            "Час обслуговування залежить від їх очкової цінності.\n\n" +
            "Натисни 'Пропустити', щоб одразу побачити результат."
        );
      });
    }
  };

  ns.loadSimulation = function () {
    showLoading("#main-content");

    $ajaxUtils.sendGetRequest(
      simulationTitle,
      function (html) {
        insertHtml("#main-content", html);
        ns.initGameRulesButton();
        const startBtn = document.getElementById("start-simulation-btn");
        if (startBtn) {
          startBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const countInput = document.getElementById("buyer-count");
            if (!countInput) {
              alert("Поле для введення кількості покупців не знайдено.");
              return;
            }

            const count = parseInt(countInput.value);
            if (isNaN(count) || count <= 0) {
              alert("Введіть коректну кількість покупців.");
              return;
            }

            startSim(count);
          });
        }
        const stopBtn = document.getElementById("stop-simulation-btn");
        if (stopBtn) {
          stopBtn.addEventListener("click", function () {
            simulationInterrupted = true;
            simulationRunning = false;

            simulationTimeouts.forEach((id) => clearTimeout(id));
            simulationTimeouts = [];

            document.getElementById("buyers-container").innerHTML = "";
            document.querySelectorAll(".buyer").forEach((b) => b.remove());
            document
              .querySelectorAll(".entering-buyer")
              .forEach((b) => b.remove());
            document
              .querySelectorAll(".simulation-stats, .simulation-analysis")
              .forEach((el) => el.remove());

            console.warn("Симуляцію зупинено");
          });
        }

        const skipBtn = document.getElementById("skip-animation-btn");

        skipBtn.addEventListener("click", () => {
          if (!simulationRunning) return;

          skipAnimation = true;
          simulationTimeouts.forEach((id) => clearTimeout(id));
          simulationTimeouts = [];

          document.getElementById("buyers-container").innerHTML = "";
          document
            .querySelectorAll(".buyer, .entering-buyer")
            .forEach((el) => el.remove());

          showGameSummary();

          simulationRunning = false;
        });
      },
      false
    );
  };

  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            const categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );
            insertHtml("#main-content", categoriesViewHtml);
          },
          false
        );
      },
      false
    );
  }

  function buildCategoriesViewHtml(
    categories,
    categoriesTitleHtml,
    categoryHtml
  ) {
    let finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row g-4' id='category-grid'>";

    for (let i = 0; i < categories.length; i++) {
      html = categoryHtml;

      const product_name = "" + categories[i].CategoryName;
      const short_name = categories[i].short_name;

      html = insertProperty(html, "product_name", product_name);
      html = insertProperty(html, "short_name", short_name);

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  function buildAndShowCatalogItemsHTML(categoryCatalogItems) {
    $ajaxUtils.sendGetRequest(
      catalogItemTitleHtml,
      function (catalogItemTitleHtml) {
        $ajaxUtils.sendGetRequest(
          catalogItemHtml,
          function (catalogItemHtml) {
            const catalogItemViewHtml = buildCatalogItemViewHtml(
              categoryCatalogItems,
              catalogItemTitleHtml,
              catalogItemHtml
            );
            insertHtml("#main-content", catalogItemViewHtml);
          },
          false
        );
      },
      false
    );
  }

  function buildCatalogItemViewHtml(
    categoryCatalogItems,
    catalogItemTitleHtml,
    catalogItemHtml
  ) {
    catalogItemTitleHtml = insertProperty(
      catalogItemTitleHtml,
      "CategoryName",
      categoryCatalogItems.category.CategoryName
    );
    catalogItemTitleHtml = insertProperty(
      catalogItemTitleHtml,
      "special_instructions",
      categoryCatalogItems.category.special_instructions
    );

    let finalHtml = catalogItemTitleHtml;
    finalHtml += "<section id = 'catalog-items-grid'>";

    const catalogItems = categoryCatalogItems.catalog_items;

    for (let i = 0; i < catalogItems.length; i++) {
      let html = catalogItemHtml;

      let finalPrice =
        catalogItems[i].price -
        (catalogItems[i].price * catalogItems[i].discount) / 100;

      html = insertProperty(
        html,
        "categoryShort_name",
        categoryCatalogItems.category.short_name
      );
      html = insertProperty(html, "short_name", catalogItems[i].short_name);
      html = insertPrice(html, "price", catalogItems[i], finalPrice);
      html = insertProperty(html, "quantity", catalogItems[i].quantity);
      html = insertProperty(html, "product_name", catalogItems[i].product_name);
      html = insertProperty(html, "description", catalogItems[i].description);

      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }
  global.$ns = ns;
})(window);
