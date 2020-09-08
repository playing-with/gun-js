console.log("If module not found, install express globally `npm i express -g`!");
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 3000;
var express = require('express');
var path = require('path');

var Gun = require('gun');
require('gun/sea');

Gun.chain.count = function (num) {
  if (typeof num === 'number') {
    this.set(num)
  }
  if (typeof num === 'function') {
    var sum = 0;
    this.map().once(function (val) {
      num(sum += val)
    })
  }
  return this
}

var app = express();
app.use(Gun.serve);
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(port);
var gun = Gun({file: 'data', web: server});
user = gun.user();

function testCount() {
  const rec = gun.get('count')
  rec.count(1)
  rec.count(console.log)
}
//testCount()

// // Get user by username
// gun.get('~@foo').once(console.log);
// // Get user by public key
// gun.user('Fr9bUlAhpHU5Gp_mkWCHB_vmqc2dfJr-f1n2-y7RjPE.G2sd_FU7J992O-RlniMigm4tMWNQU81zN18j-nuLYp4').once(console.log)

function testUser() {
  user.create('foo', 'password', ack => {
    console.log(ack)
    user.auth('foo', 'password', console.log)
  })
}
function testEnc() {
  user.auth('foo', 'password', ack => {
    var alice = {name: "Alice"};
    alice.boss = {name: "Fluffy", species: "Kitty", peon: alice};
    user.get('profile').put(alice);
  })
}
//testUser()
testEnc()

// global.Gun = Gun; /// make global to `node --inspect` - debug only
// global.gun = gun; /// make global to `node --inspect` - debug only

console.log('Server started on port ' + port + ' with /gun');