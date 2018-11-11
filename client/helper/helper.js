const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#fighterMessage").animate({width:'toggle'},350);
};

const redirect = (response) => {
  $("#fighterMessage").animate({width:'hide'},350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

// turns an object with properties into 'key=value&key2=value2' string
const urlEncodeObject = (object) => {
  return Object.keys(object).map(key => key + '=' + object[key]).join('&');
};