const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getFighters', mid.requiresLogin, controllers.Fighter.getFighters);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/changePass', mid.requiresLogin, mid.requiresSecure, controllers.Account.changePass);
  app.get('/maker', mid.requiresLogin, controllers.Fighter.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Fighter.make);
  app.post('/deleteFighter', mid.requiresLogin, controllers.Fighter.deleteFighter);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
