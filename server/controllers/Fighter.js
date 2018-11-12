const models = require('../models');

const Fighter = models.Fighter;

const makerPage = (req, res) => {
  Fighter.FighterModel.findByAccount(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred ' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), fighters: docs });
  });
};

const getFighters = (request, response) => {
  const req = request;
  const res = response;

  return Fighter.FighterModel.findByAccount(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    
    return res.json({ fighters: docs });
  });
};

const getAllFighters = (request, response) => {
  const req = request;
  const res = response;
  
  return Fighter.FighterModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    
    return res.json({ fighters: docs });
  });
};

const deleteFighter = (request, response) => {
  const req = request;
  const res = response;

  return Fighter.FighterModel.deleteByName(req.session.account._id, req.body.name, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ message: 'Fighter deleted successfully' });
  });
};

const makeFighter = (req, res) => {
  // cast everything as a number (except name of course)
  const name = req.body.name;
  const health = Number(req.body.health);
  const damage = Number(req.body.damage);
  const speed = Number(req.body.speed);
  const armor = Number(req.body.armor);
  const crit = Number(req.body.crit);
  
  if (!name||!health||!damage||!speed||!armor||!crit) {
    return res.status(400).json({ error: 'All fighter stats required' });
  }
  
  if(health+damage+speed+armor+crit>36) {
    return res.status(400).json({ error: 'stats must not exceed 36' });
  }

  const fighterData = {
    name,
    health,
    damage,
    speed,
    armor,
    crit,
    account: req.session.account._id,
  };

  const newFighter = new Fighter.FighterModel(fighterData);

  const fighterPromise = newFighter.save();

  fighterPromise.then(() => res.json({ redirect: '/maker' }));

  fighterPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Fighter already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return fighterPromise;
};

module.exports.makerPage = makerPage;
module.exports.getFighters = getFighters;
module.exports.getAllFighters = getAllFighters;
module.exports.make = makeFighter;
module.exports.deleteFighter = deleteFighter;
