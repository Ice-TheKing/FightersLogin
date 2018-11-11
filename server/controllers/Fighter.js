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
  if (!req.body.name ||
      !req.body.health ||
      !req.body.damage ||
      !req.body.speed ||
      !req.body.armor ||
      !req.body.crit) {
    return res.status(400).json({ error: 'All fighter stats required' });
  }

  const fighterData = {
    name: req.body.name,
    health: req.body.health,
    damage: req.body.damage,
    speed: req.body.speed,
    armor: req.body.armor,
    crit: req.body.crit,
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
module.exports.make = makeFighter;
module.exports.deleteFighter = deleteFighter;
