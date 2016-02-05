// fix users with numeric _id properties
db = connect("localhost:27017/building-blocks");
var usersNumeric = {}
var usersString = {}
var user;

cursor = db.users.find({_id: {$type: 1} }); //numeric _id
while ( cursor.hasNext() ) {
  user = cursor.next();
  //printjson(user);
  usersNumeric[user._id] = user;
}

cursor = db.users.find({_id: {$type: 2} }); //string _id
while ( cursor.hasNext() ) {
  user = cursor.next();
  //printjson(user);
  usersString[user._id] = user;
}

Object.keys(usersNumeric).forEach(function(nid) {
  var user = usersNumeric[nid];
  var sid = nid +""
  if(usersString[sid]) {
    // already have this user
    print("already have", user.login, nid)
  } else {
    // don't have recent version, create one with string id
    print("dont have", user.login, nid)
    user._id = sid;
    db.users.insert(user)
  }
  //db.users.remove({_id: {$and: [{_id: nid}, {_id: {$type: 1}} ] }})
})