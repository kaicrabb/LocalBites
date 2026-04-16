const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKeys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

module.exports = admin;