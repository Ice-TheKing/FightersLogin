'use strict';

/// sends request to create fighter
var handleFighter = function handleFighter(e) {
  e.preventDefault();

  // $("#fighterMessage").animate({width:'hide'},350);
  var sliders = getSliders();

  if (sliders.name == '' || sliders.health == '' || sliders.damage == '' || sliders.speed == '' || sliders.armor == '' || sliders.crit == '') {
    handleError("All stats are required");
    return false;
  }

  sendAjax('POST', $("#fighterForm").attr("action"), $("#fighterForm").serialize(), function () {
    // loadFightersFromServer();
    // TODO: Show a success window and reset forms
  });

  return false;
};

/// called by the delete html button
var handleDeleteClick = function handleDeleteClick(e) {
  DeleteFighter(e);
};

// sends a delete request to the server
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

/// Create a fighter React page
var FighterForm = function FighterForm(props) {
  return React.createElement(
    'form',
    { id: 'fighterForm',
      onSubmit: handleFighter,
      name: 'fighterForm',
      action: '/maker',
      method: 'POST',
      className: 'fighterForm'
    },
    React.createElement('br', null),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'input-field col s12' },
        React.createElement('input', { id: 'fighterName', type: 'text', name: 'name' }),
        React.createElement(
          'label',
          { 'for': 'name' },
          'Fighter Name'
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'health' },
            React.createElement('input', { id: 'fighterHealth', name: 'health', value: '1', min: '1', max: '15' }),
            'Health'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'damage' },
            React.createElement('input', { type: 'range', id: 'fighterDamage', name: 'damage', min: '1', max: '15' }),
            'Damage'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'speed' },
            React.createElement('input', { type: 'range', id: 'fighterSpeed', name: 'speed', min: '1', max: '15' }),
            'Speed'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'armor' },
            React.createElement('input', { type: 'range', id: 'fighterArmor', name: 'armor', min: '1', max: '15' }),
            'Armor'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'crit' },
            React.createElement('input', { type: 'range', id: 'fighterCrit', name: 'crit', min: '1', max: '15' }),
            'Crit'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'h6',
          { id: 'pointsField' },
          'Points Left: 31'
        )
      )
    ),
    React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'waves-effect waves-light btn', type: 'submit', value: 'Create Fighter' })
  );
};

/// React page for change password page
var ChangePassForm = function ChangePassForm(props) {
  return React.createElement(
    'form',
    { id: 'changePassForm', name: 'changePassForm',
      onSubmit: handleChangePass,
      action: '/changePass',
      method: 'POST',
      className: 'mainForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'newPass' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
    React.createElement(
      'label',
      { htmlFor: 'pass2' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Submit' })
  );
};

/// sends change password request to server
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

/// Renders all fighters
var FighterList = function FighterList(props) {
  if (props.fighters.length === 0) {
    return React.createElement(
      'div',
      { className: 'fighterList' },
      React.createElement(
        'h3',
        { className: 'emptyFighter' },
        'No Fighters yet'
      )
    );
  }

  var fighterNodes = props.fighters.map(function (fighter) {
    return React.createElement(
      'div',
      { key: fighter._id, className: 'fighter' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'fighter face', className: 'fighterFace' }),
      React.createElement(
        'h3',
        { className: 'fighterName' },
        ' Name: ',
        fighter.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'fighterAge' },
        ' Age: ',
        fighter.age,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'fighterCity' },
        ' City: ',
        fighter.city,
        ' '
      ),
      React.createElement('input', { type: 'submit', value: 'Delete Fighter', name: fighter.name, onClick: handleDeleteClick })
    );
  });

  return React.createElement(
    'div',
    { className: 'fighterList' },
    fighterNodes
  );
};

/// gets back all fighters owned by the current user from the server, then renders fighter list
var loadFightersFromServer = function loadFightersFromServer() {
  sendAjax('GET', '/getFighters', null, function (data) {
    ReactDOM.render(React.createElement(FighterList, { fighters: data.fighters }), document.querySelector("#fighters"));
  });
};

/// renders the create fighter page
var setupMakerPage = function setupMakerPage(csrf) {
  ReactDOM.render(React.createElement(FighterForm, { csrf: csrf }), document.querySelector("#makeFighter"));

  ReactDOM.render(
  // <FighterList fighters={[]} />, document.querySelector("#fighters")
  React.createElement('h1', null), document.querySelector("#fighters"));

  // loadFightersFromServer();

  // setup sliders
  setupMaterializeElements();
};

/// renders the change password page
var setupChangePassPage = function setupChangePassPage(csrf) {
  ReactDOM.render(React.createElement('h1', null), document.querySelector("#makeFighter"));

  ReactDOM.render(React.createElement(ChangePassForm, { csrf: csrf }), document.querySelector("#fighters"));
};

/// sets up click events for the navigation buttons to re-render the page with react
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

/// request a csrfToken
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupNavButtons(result.csrfToken);
    setupMakerPage(result.csrfToken);
  });
};

/// as soon as the document loads
$(document).ready(function () {
  getToken();
});

/// setup the sliders with materialize and kendoui
var setupMaterializeElements = function setupMaterializeElements() {
  var health = $("#fighterHealth").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var damage = $("#fighterDamage").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var speed = $("#fighterSpeed").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var armor = $("#fighterArmor").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var crit = $("#fighterCrit").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
};

var updatePoints = function updatePoints() {
  var sliders = getSliders();
  var newPoints = 36 - sliders.health - sliders.damage - sliders.speed - sliders.armor - sliders.crit;
  pointsField.textContent = 'Points Left: ' + newPoints;
};

/// helper function to easily retrieve values from the stat sliders in the creator app
var getSliders = function getSliders() {
  var sliders = {};
  sliders.name = $("#fighterName").val();
  sliders.health = $("#fighterHealth").val();
  sliders.damage = $("#fighterDamage").val();
  sliders.speed = $("#fighterSpeed").val();
  sliders.armor = $("#fighterArmor").val();
  sliders.crit = $("#fighterCrit").val();
  return sliders;
};
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

// turns an object with properties into 'key=value&key2=value2' string
var urlEncodeObject = function urlEncodeObject(object) {
  return Object.keys(object).map(function (key) {
    return key + '=' + object[key];
  }).join('&');
};
