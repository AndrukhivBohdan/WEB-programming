(function (global) {
  const ajaxUtils = {};

  function getRequestObject() {
    if (global.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else {
      global.alert("Error");
      return null;
    }
  }

  ajaxUtils.sendGetRequest = function (
    requestUrl,
    responseHandler,
    isJsonResponse
  ) {
    let request = getRequestObject();
    request.onreadystatechange = function () {
      handleResponse(request, responseHandler, isJsonResponse);
    };
    request.open("GET", requestUrl, true);
    request.send(null);
  };

  function handleResponse(request, responseHandler, isJsonResponse) {
    if (request.readyState == 4) {
      if (request.status == 200) {
        if (isJsonResponse == undefined) {
          isJsonResponse = true;
        }
        if (isJsonResponse) {
          responseHandler(JSON.parse(request.responseText));
        } else {
          responseHandler(request.responseText);
        }
      } else {
        console.error("Помилка запиту:", request.status, request.responseText);
      }
    }
  }

  global.$ajaxUtils = ajaxUtils;
})(window);
