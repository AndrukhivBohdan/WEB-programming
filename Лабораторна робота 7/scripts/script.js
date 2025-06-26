const content = document.getElementById('content');
const homeLink = document.getElementById('homeLink');
const catalogLink = document.getElementById('catalogLink');

homeLink.addEventListener('click', function (e) {
  e.preventDefault();
  showHome();
});

catalogLink.addEventListener('click', function (e) {
  e.preventDefault();
  loadCategories();
});

function showHome() {
  content.innerHTML = `
    <h2>Інтернет-магазин</h2>
    <p>Оберіть категорію, щоб переглянути товари</p>
  `;
}

function loadCategories() {
  $ajaxUtils.sendGetRequest("data/categories.json", function (categories) {
    content.innerHTML = `<h2>Категорії</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid';

    categories.forEach(function (cat) {
      const button = document.createElement('div');
      button.className = 'category-button';
      button.textContent = cat.name;
      button.addEventListener('click', function () {
        loadCategory(cat.shortname);
      });
      grid.appendChild(button);
    });

    const specialsButton = document.createElement('div');
    specialsButton.className = 'category-button';
    specialsButton.textContent = 'Specials';
    specialsButton.addEventListener('click', loadRandomCat);
    grid.appendChild(specialsButton);

    content.appendChild(grid);
  });
}

function loadCategory(shortname) {
  $ajaxUtils.sendGetRequest(`data/categories/${shortname}.json`, function (data) {
    content.innerHTML = `<h2>${data.categoryName}</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid';

    data.items.forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = `https://place-hold.it/200x200/ff9000/ffffff?text=${encodeURIComponent(item.shortname)}`;
      img.alt = item.name;

      const cardContent = document.createElement('div');
      cardContent.className = 'card-content';

      const title = document.createElement('h3');
      title.textContent = item.name;

      const desc = document.createElement('p');
      desc.textContent = item.description || "Опис відсутній.";

      cardContent.appendChild(title);
      cardContent.appendChild(desc);

      const footer = document.createElement('div');
      footer.className = 'card-footer';
      footer.textContent = item.price;

      card.appendChild(img);
      card.appendChild(cardContent);
      card.appendChild(footer);

      grid.appendChild(card);
    });

    content.appendChild(grid);
  });
}

function loadRandomCat() {
  $ajaxUtils.sendGetRequest("data/categories.json", function (categories) {
    const randomIndex = Math.floor(Math.random() * categories.length);
    const shortname = categories[randomIndex].shortname;
    loadCategory(shortname);
  });
}

showHome();
