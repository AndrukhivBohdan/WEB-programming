(function () {
    
  const names = [
    "Bill",
    "John",
    "Jen",
    "Jason",
    "Paul",
    "Frank",
    "Steven",
    "Larry",
    "Paula",
    "Laura",
    "Jim",
  ];

  console.log("Відомий нам підхід\n\n");

  for (let n of names) {
    let letter = n.charAt(0).toLowerCase();

    if (letter === "j") {
      $bye.speak(n);
    } else {
      $hello.speak(n);
    }
  }

  console.log("\nДругий підхід вітається з іменами в залежності від другої букви імені. Якщо вона рівна 'e' то застосунок прощається словом Goodbye, в протилежному випадку вітається словом Hello.\n\n");

  for (let n of names) {
    let letter = n.charAt(1).toLowerCase();

    if (letter === "e") {
      $bye.speak(n);
    } else {
      $hello.speak(n);
    }
  }

})();
