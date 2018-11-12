const handleError = (message) => {
  M.toast({html: `${message}`});
};

/// same thing as handle error. Just replacing it
const sendToast = (message) => {
  M.toast({html: `${message}`});
}

const redirect = (response) => {
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
      sendToast(messageObj.error || messageObj.err || messageObj.er);
    }
  });
};

// turns an object with properties into 'key=value&key2=value2' string
const urlEncodeObject = (object) => {
  return Object.keys(object).map(key => key + '=' + object[key]).join('&');
};

const updateUrl = (url) => {
  
};