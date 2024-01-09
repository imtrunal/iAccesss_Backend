var admin = require("firebase-admin");
// var serviceAccount = require("../../iaccessSer.json");
var serviceAccount = require("../setup/iaccess-a425a-firebase-adminsdk-tqt32-79ac70ec10.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports.admin = admin