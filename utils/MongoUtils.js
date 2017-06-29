/**
 * Created by leiyao on 16/6/1.
 */

var mongoose = require('mongoose');
mongoose.connect(conf.MONGODB.URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we\'re connected!'+conf.MONGODB.URI);
});

module.exports = {
  mongoose: mongoose,
  db: db
};
