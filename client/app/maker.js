/// sends request to create fighter
const handleFighter = (e) => {
  e.preventDefault();
  
  // $("#fighterMessage").animate({width:'hide'},350);
  const sliders = getSliders();
  
  if(sliders.name == '' || 
     sliders.health == '' || 
     sliders.damage == '' ||
     sliders.speed == '' ||
     sliders.armor == '' ||
     sliders.crit == ''
    ) {
    handleError("All stats are required");
    return false;
  }
  
  sendAjax('POST', $("#fighterForm").attr("action"), $("#fighterForm").serialize(), function() {
    // loadFightersFromServer();
    // TODO: Show a success window and reset forms
  });
  
  return false;
};

/// called by the delete html button
const handleDeleteClick = (e) => {
  DeleteFighter(e);
};


// sends a delete request to the server
const DeleteFighter = (e) => {
  let csrfToken = $("#_csrf").val();
  
  // console.dir(e.target.name);
  let currentFighter = {
    name: e.target.name,
    _csrf: csrfToken,
  };
  
  sendAjax('POST', '/deleteFighter', currentFighter, function() {
    loadFightersFromServer();
  });
};

/// Create a fighter React page
const FighterForm = (props) => {
  return (
    <form id="fighterForm"
          onSubmit={handleFighter}
          name="fighterForm"
          action="/maker"
          method="POST"
          className="fighterForm"
      >
      <br></br>
      <div className="row">
        <div className="input-field col s12">
          <input id="fighterName" type="text" name="name" />
          <label for="name">Fighter Name</label>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="health">
              <input id="fighterHealth" name="health" value="1" min="1" max="15"/>
            Health</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="damage">
              <input type="range" id="fighterDamage" name="damage" min="1" max="15"/>
            Damage</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="speed">
              <input type="range" id="fighterSpeed" name="speed" min="1" max="15"/>
            Speed</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="armor">
              <input type="range" id="fighterArmor" name="armor" min="1" max="15"/>
            Armor</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="crit">
              <input type="range" id="fighterCrit" name="crit" min="1" max="15"/>
            Crit</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <h6 id="pointsField">Points Left: 31</h6>
        </div>
      </div>
      
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      <input className="waves-effect waves-light btn" type="submit" value="Create Fighter"/>
    </form>
  );
};

/// React page for change password page
const ChangePassForm = (props) => {
  return (
    <form id="changePassForm" name="changePassForm"
          onSubmit={handleChangePass}
          action="/changePass"
          method="POST"
          className="mainForm"
      >
      <label htmlFor="newPass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Submit" />
    </form>      
  );
};

/// sends change password request to server
const handleChangePass = (e) => {
  e.preventDefault();
  
  $("#fighterMessage").animate({width:'hide'},350);
  
  if($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  if($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  console.dir($("#changePassForm").serialize());
  
  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  
  return false;
};

/// Renders all fighters
const FighterList = function(props) {
  if(props.fighters.length === 0) {
    return (
      <div className="fighterList">
        <h3 className="emptyFighter">No Fighters yet</h3>
      </div>
    );
  }
  
  const fighterNodes = props.fighters.map(function(fighter) {
    return (
      <div key={fighter._id} className="fighter">
        <img src="/assets/img/domoface.jpeg" alt="fighter face" className="fighterFace" />
        <h3 className="fighterName"> Name: {fighter.name} </h3>
        <h3 className="fighterAge"> Age: {fighter.age} </h3>
        <h3 className="fighterCity"> City: {fighter.city} </h3>
        <input type="submit" value="Delete Fighter" name={fighter.name} onClick={handleDeleteClick} />
      </div>
    );
  });
  
  return (
    <div className="fighterList">
      {fighterNodes}
    </div>
  );
};

/// gets back all fighters owned by the current user from the server, then renders fighter list
const loadFightersFromServer = () => {
  sendAjax('GET', '/getFighters', null, (data) => {
    ReactDOM.render(
      <FighterList fighters={data.fighters} />,
      document.querySelector("#fighters")
    );
  });
};

/// renders the create fighter page
const setupMakerPage = function(csrf) {
  ReactDOM.render(
    <FighterForm csrf={csrf} />, document.querySelector("#makeFighter")
  );
  
  ReactDOM.render(
    // <FighterList fighters={[]} />, document.querySelector("#fighters")
    <h1></h1>, document.querySelector("#fighters")
  );
  
  // loadFightersFromServer();
  
  // setup sliders
  setupMaterializeElements();
};

/// renders the change password page
const setupChangePassPage = function(csrf) {
  ReactDOM.render(
    <h1></h1>, document.querySelector("#makeFighter")
  );
  
  ReactDOM.render(
    <ChangePassForm csrf={csrf} />, document.querySelector("#fighters")
  );
};

/// sets up click events for the navigation buttons to re-render the page with react
const setupNavButtons = function(csrf) {
  const makerButton = document.querySelector("#makerButton");
  const changePassButton = document.querySelector("#changePassButton");
  
  makerButton.addEventListener("click", (e) => {
    e.preventDefault();
    setupMakerPage(csrf);
    return false;
  });
    
  changePassButton.addEventListener("click", (e) => {
    e.preventDefault();
    setupChangePassPage(csrf);
    return false;
  });
};

/// request a csrfToken
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupNavButtons(result.csrfToken);
    setupMakerPage(result.csrfToken);
  });
};

/// as soon as the document loads
$(document).ready(function() {
  getToken();
});

/// setup the sliders with materialize and kendoui
const setupMaterializeElements = () => {
  let health = $("#fighterHealth").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let damage = $("#fighterDamage").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let speed = $("#fighterSpeed").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let armor = $("#fighterArmor").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let crit = $("#fighterCrit").kendoSlider({
    change: updatePoints,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
};

const updatePoints = () => {
  const sliders = getSliders();
  let newPoints = 36 - sliders.health - sliders.damage - sliders.speed - sliders.armor - sliders.crit;
  pointsField.textContent = `Points Left: ${newPoints}`;
};

/// helper function to easily retrieve values from the stat sliders in the creator app
const getSliders = () => {
  const sliders = {};
  sliders.name = $("#fighterName").val();
  sliders.health = $("#fighterHealth").val();
  sliders.damage = $("#fighterDamage").val();
  sliders.speed = $("#fighterSpeed").val();
  sliders.armor = $("#fighterArmor").val();
  sliders.crit = $("#fighterCrit").val();
  return sliders;
};



