const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const kittySchema = mongoose.Schema({
  name: String,
})

kittySchema.methods.speak = function() {
  const greeting = this.name ? `Meow name is ${this.name}` : "I don't have a name";
  console.log(greeting); 
}

kittySchema.query.byName = function(name) {
  return this.find({name: new RegExp(name, 'i')});
}

const Kitten = mongoose.model('Kitten', kittySchema);

const silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'

const fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

// fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log('find all');
  console.log(kittens);
})

Kitten.find({name: /^fluf/}, function(err, kittens) {
  if (err) return console.error(err);
  console.log('find this all');
  console.log(kittens);
});

Kitten.findOne(function(err, kitten) {
  if (err) return console.error(err);
  console.log('find this one');
  console.log(kitten);
});

Kitten.find().byName('cart').exec(function(err, kitten) {
  console.log('test 查询助手');
  console.log(kitten);
});

Kitten.aggregate([
  { $match: { name: 'cart' } },
  // { $limit: 1 }
  // { $skip: 1 }
  { $addFields:{ totalList: { $sum: '$cartlist'}} },
  { $addFields:{ sumAll: { $add: ['$totalList', '$__v'] }}}
]).exec(function (err, turnover){ // 返回结果
  console.log('match结果', turnover);
});

