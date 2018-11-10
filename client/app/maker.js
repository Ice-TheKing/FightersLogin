const handleFighter = (e) => {
  e.preventDefault();
  
  $("#fighterMessage").animate({width:'hide'},350);
  
  if($("#fighterName").val() == '' || 
     $("#fighterHealth").val() == '' || 
     $("#fighterDamage").val() == '' ||
     $("#fighterSpeed").val() == '' ||
     $("#fighterArmor").val() == '' ||
     $("#fighterCrit").val() == ''
    ) {
    handleError("All stats are required");
    return false;
  }

  console.log($("#fighterForm").serialize());
  
  sendAjax('POST', $("#fighterForm").attr("action"), $("#fighterForm").serialize(), function() {
    loadFightersFromServer();
  });
  
  return false;
};

const handleDeleteClick = (e) => {
  DeleteFighter(e);
};

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

const FighterForm = (props) => {
  return (
    <form id="fighterForm"
          onSubmit={handleFighter}
          name="fighterForm"
          action="/maker"
          method="POST"
          className="fighterForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="fighterName" type="text" name="name" placeholder="Fighter Name"/>
      <label for="health">Health: </label>
      <input id="fighterHealth" type="number" name="health" min="1" max="15" step="1" value="1"/>
      <label for="damage">Damage: </label>
      <input id="fighterDamage" type="number" name="damage" min="1" max="15" step="1" value="1"/>
      <label for="speed">Speed: </label>
      <input id="fighterSpeed" type="number" name="speed" min="1" max="15" step="1" value="1"/>
      <label for="armor">Armor: </label>
      <input id="fighterArmor" type="number" name="armor" min="1" max="15" step="1" value="1"/>
      <label for="crit">Crit: </label>
      <input id="fighterCrit" type="number" name="crit" min="1" max="15" step="1" value="1"/>
      
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      <input className="makeFighterSubmit" type="submit" value="Create Fighter"/>
    </form>
  );
};

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

const loadFightersFromServer = () => {
  sendAjax('GET', '/getFighters', null, (data) => {
    ReactDOM.render(
      <FighterList fighters={data.fighters} />,
      document.querySelector("#fighters")
    );
  });
};

const setupMakerPage = function(csrf) {
  ReactDOM.render(
    <FighterForm csrf={csrf} />, document.querySelector("#makeFighter")
  );
  
  ReactDOM.render(
    <FighterList fighters={[]} />, document.querySelector("#fighters")
  );
  
  loadFightersFromServer();
};

const setupChangePassPage = function(csrf) {
  ReactDOM.render(
    <h1></h1>, document.querySelector("#makeFighter")
  );
  
  ReactDOM.render(
    <ChangePassForm csrf={csrf} />, document.querySelector("#fighters")
  );
};

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

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupNavButtons(result.csrfToken);
    setupMakerPage(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
