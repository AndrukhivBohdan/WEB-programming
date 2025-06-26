(function (global) {
  const speakWord = "Hello";

  const hello = {};

  hello.speak = function (name) {
    console.log(speakWord + " " + name);
  };

  global.$hello = hello;
})(window);