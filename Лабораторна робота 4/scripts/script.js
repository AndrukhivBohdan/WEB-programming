(function (global) {
  const sort = {};

  sort.checkUndefined = function (array) {
    let cleanArray = [];
    let undfCount = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i] === undefined) {
        undfCount++;
      } else {
        cleanArray.push(array[i]);
      }
    }

    if (undfCount > 0) {
      console.log("В масиві " + undfCount + " undefined-елементів");
    }

    return cleanArray;
  };

  sort.sortExchange = function (array, ascending) {
    let arr = sort.checkUndefined(array);
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons++;
        let shouldSwap = ascending ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1];
        if (shouldSwap) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
        }
      }
    }

    console.log("Обміну: Порівняння = " + comparisons + ", Обмін = " + swaps);
    return arr;
  };

  sort.sortMinElements = function (array, ascending) {
    let arr = sort.checkUndefined(array);
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      let index = i;
      for (let j = i + 1; j < arr.length; j++) {
        comparisons++;
        if (ascending) {
          if (arr[j] < arr[index]) {
            index = j;
          }
        } else {
          if (arr[j] > arr[index]) {
            index = j;
          }
        }
      }
      if (index !== i) {
        let temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
        swaps++;
      }
    }

    console.log("Мінімальних елементів: Порівняння = " + comparisons + ", Обмін = " + swaps);
    return arr;
  };

  sort.sortInserts = function (array, ascending) {
    let arr = sort.checkUndefined(array);
    let comparisons = 0;
    let shifts = 0;

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && ((ascending && arr[j] > key) || (!ascending && arr[j] < key))) {
        comparisons++;
        arr[j + 1] = arr[j];
        shifts++;
        j = j - 1;
      }
      arr[j + 1] = key;
    }

    console.log("Вставок: Порівняння = " + comparisons + ", Переміщення = " + shifts);
    return arr;
  };

  sort.sortShell = function (array, ascending) {
    let arr = sort.checkUndefined(array);
    let comparisons = 0;
    let swaps = 0;
    let gap = Math.floor(arr.length / 2);

    while (gap > 0) {
      for (let i = gap; i < arr.length; i++) {
        let temp = arr[i];
        let j = i;

        while (j >= gap && ((ascending && arr[j - gap] > temp) || (!ascending && arr[j - gap] < temp))) {
          comparisons++;
          arr[j] = arr[j - gap];
          swaps++;
          j = j - gap;
        }

        arr[j] = temp;
      }

      gap = Math.floor(gap / 2);
    }

    console.log("Шелла: Порівняння = " + comparisons + ", Обмін = " + swaps);
    return arr;
  };

  sort.sortHoare = function (array, ascending) {
    let arr = sort.checkUndefined(array);
    let comparisons = 0;
    let swaps = 0;

    function quickSort(arr) {
      if (arr.length <= 1) {
        return arr;
      }

      let pivot = arr[Math.floor(arr.length / 2)];
      let left = [];
      let right = [];
      let equal = [];

      for (let i = 0; i < arr.length; i++) {
        let num = arr[i];
        comparisons++;
        if (num < pivot) {
          ascending ? left.push(num) : right.push(num);
        } else if (num > pivot) {
          ascending ? right.push(num) : left.push(num);
        } else {
          equal.push(num);
        }
      }

      swaps += arr.length - 1;

      return quickSort(left).concat(equal).concat(quickSort(right));
    }

    let sorted = quickSort(arr);
    console.log("Хоара (швидке сортування): Порівняння = " + comparisons + ", Обмін = " + swaps);
    return sorted;
  };

  global.$sort = sort;

  // Додаємо обробник кнопки
  window.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("sortButton");
    btn.addEventListener("click", function () {
      const input = document.getElementById("arrayInput").value;
      const method = document.getElementById("sortMethod").value;
      const ascending = document.getElementById("ascending").checked;

      const numbers = input.split(",").map(function (n) {
        const trimmed = n.trim();
        return trimmed === "" ? undefined : Number(trimmed);
      });

      const result = global.$sort[method](numbers, ascending);
      const output = document.getElementById("output");
      output.innerText = "Вхідний масив: " + JSON.stringify(numbers) + "\nВідсортований масив: " + JSON.stringify(result);
    });
  });
})(window);
