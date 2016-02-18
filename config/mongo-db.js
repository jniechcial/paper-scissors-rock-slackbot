const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect(process.env.MONGO_URI);
};
