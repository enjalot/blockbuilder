// fix users with numeric _id properties
db = connect("localhost:27017/building-blocks");
var usersNumeric = {}
var usersString = {}
var user;

//var NUMERIC = 1 //mongo 2.6, ids are doubles not ints
var NUMERIC = 16 //mongo 3.0, ids are ints

cursor = db.users.find({_id: {$type: NUMERIC} }); //numeric _id
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

print("found", Object.keys(usersNumeric).length, "numeric id users");
print("found", Object.keys(usersString).length, "string id users");
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
})
// manually removing all _id: $type:1 users (numeric) with:
// db.users.remove({_id: {$type: 16}})