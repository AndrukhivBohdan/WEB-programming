(function (global) {
  const speakWord = "GoodBye";

  const bye = {};

  bye.speak = function (name) {
    console.log(speakWord + " " + name);
  };

  global.$bye = bye;
})(window);