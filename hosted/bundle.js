"use strict";

var handleFighter = function handleFighter(e) {
  e.preventDefault();

  $("#fighterMessage").animate({ width: 'hide' }, 350);

  if ($("#fighterName").val() == '' || $("#fighterHealth").val() == '' || $("#fighterDamage").val() == '' || $("#fighterSpeed").val() == '' || $("#fighterArmor").val() == '' || $("#fighterCrit").val() == '') {
    handleError("All stats are required");
    return false;
  }

  console.log($("#fighterForm").serialize());

  sendAjax('POST', $("#fighterForm").attr("action"), $("#fighterForm").serialize(), function () {
    loadFightersFromServer();
  });

  return false;
};

var handleDeleteClick = function handleDeleteClick(e) {
  DeleteFighter(e);
};

var DeleteFighter = function DeleteFighter(e) {
  var csrfToken = $("#_csrf").val();

  // console.dir(e.target.name);
  var currentFighter = {
    name: e.target.name,
    _csrf: csrfToken
  };

  sendAjax('POST', '/deleteFighter', currentFighter, function () {
    loadFightersFromServer();
  });
};

var FighterForm = function FighterForm(props) {
  return React.createElement(
    "form",
    { id: "fighterForm",
      onSubmit: handleFighter,
      name: "fighterForm",
      action: "/maker",
      method: "POST",
      className: "fighterForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "fighterName", type: "text", name: "name", placeholder: "Fighter Name" }),
    React.createElement(
      "label",
      { "for": "health" },
      "Health: "
    ),
    React.createElement("input", { id: "fighterHealth", type: "number", name: "health", min: "1", max: "15", step: "1", value: "1" }),
    React.createElement(
      "label",
      { "for": "damage" },
      "Damage: "
    ),
    React.createElement("input", { id: "fighterDamage", type: "number", name: "damage", min: "1", max: "15", step: "1", value: "1" }),
    React.createElement(
      "label",
      { "for": "speed" },
      "Speed: "
    ),
    React.createElement("input", { id: "fighterSpeed", type: "number", name: "speed", min: "1", max: "15", step: "1", value: "1" }),
    React.createElement(
      "label",
      { "for": "armor" },
      "Armor: "
    ),
    React.createElement("input", { id: "fighterArmor", type: "number", name: "armor", min: "1", max: "15", step: "1", value: "1" }),
    React.createElement(
      "label",
      { "for": "crit" },
      "Crit: "
    ),
    React.createElement("input", { id: "fighterCrit", type: "number", name: "crit", min: "1", max: "15", step: "1", value: "1" }),
    React.createElement("input", { type: "hidden", id: "_csrf", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeFighterSubmit", type: "submit", value: "Create Fighter" })
  );
};

var ChangePassForm = function ChangePassForm(props) {
  return React.createElement(
    "form",
    { id: "changePassForm", name: "changePassForm",
      onSubmit: handleChangePass,
      action: "/changePass",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "newPass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Submit" })
  );
};

var handleChangePass = function handleChangePass(e) {
  e.preventDefault();

  $("#fighterMessage").animate({ width: 'hide' }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! All fields are required");
    return false;
  }

  console.dir($("#changePassForm").serialize());

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

  return false;
};

var FighterList = function FighterList(props) {
  if (props.fighters.length === 0) {
    return React.createElement(
      "div",
      { className: "fighterList" },
      React.createElement(
        "h3",
        { className: "emptyFighter" },
        "No Fighters yet"
      )
    );
  }

  var fighterNodes = props.fighters.map(function (fighter) {
    return React.createElement(
      "div",
      { key: fighter._id, className: "fighter" },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "fighter face", className: "fighterFace" }),
      React.createElement(
        "h3",
        { className: "fighterName" },
        " Name: ",
        fighter.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "fighterAge" },
        " Age: ",
        fighter.age,
        " "
      ),
      React.createElement(
        "h3",
        { className: "fighterCity" },
        " City: ",
        fighter.city,
        " "
      ),
      React.createElement("input", { type: "submit", value: "Delete Fighter", name: fighter.name, onClick: handleDeleteClick })
    );
  });

  return React.createElement(
    "div",
    { className: "fighterList" },
    fighterNodes
  );
};

var loadFightersFromServer = function loadFightersFromServer() {
  sendAjax('GET', '/getFighters', null, function (data) {
    ReactDOM.render(React.createElement(FighterList, { fighters: data.fighters }), document.querySelector("#fighters"));
  });
};

var setupMakerPage = function setupMakerPage(csrf) {
  ReactDOM.render(React.createElement(FighterForm, { csrf: csrf }), document.querySelector("#makeFighter"));

  ReactDOM.render(React.createElement(FighterList, { fighters: [] }), document.querySelector("#fighters"));

  loadFightersFromServer();
};

var setupChangePassPage = function setupChangePassPage(csrf) {
  ReactDOM.render(React.createElement("h1", null), document.querySelector("#makeFighter"));

  ReactDOM.render(React.createElement(ChangePassForm, { csrf: csrf }), document.querySelector("#fighters"));
};

var setupNavButtons = function setupNavButtons(csrf) {
  var makerButton = document.querySelector("#makerButton");
  var changePassButton = document.querySelector("#changePassButton");

  makerButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupMakerPage(csrf);
    return false;
  });

  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupChangePassPage(csrf);
    return false;
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupNavButtons(result.csrfToken);
    setupMakerPage(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#fighterMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#fighterMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
