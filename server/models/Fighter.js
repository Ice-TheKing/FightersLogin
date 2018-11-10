const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let FighterModel = {};

// mongoose.Types.ObjectID is a function that converts
// string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const FighterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  health: {
    type: Number,
    min: 0,
    required: true,
  },
  
  damage: {
    type: Number,
    min: 0,
    required: true,
  },
  
  speed: {
    type: Number,
    min: 0,
    required: true,
  },
  
  armor: {
    type: Number,
    min: 0,
    required: true,
  },
  
  crit: {
    type: Number,
    min: 0,
    required: true,
  },

  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

FighterSchema.index({ name: 1, account: 1 }, { unique: true });

FighterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  health: doc.health,
  damage: doc.damage,
  speed: doc.speed,
  armor: doc.armor,
  crit: doc.crit,
});

FighterSchema.statics.findByAccount = (accountId, callback) => {
  const search = {
    account: convertId(accountId),
  };

  return FighterModel.find(search).select('name age city').exec(callback);
};

FighterSchema.statics.deleteByName = (accountId, name, callback) => {
  const search = {
    account: convertId(accountId),
    name,
  };

  return FighterModel.remove(search, callback);
};

FighterModel = mongoose.model('Fighter', FighterSchema);

module.exports.FighterModel = FighterModel;
module.exports.FighterSchema = FighterSchema;
