/*
    * This file initializes the Firebase Admin SDK using service account credentials.
    * The credentials are loaded from an environment variable, which should contain the JSON string of the service account key.
    * The Firebase Admin SDK is configured with the project ID from the service account and is ready to be used for various Firebase services such as authentication, database, and messaging.
    * The initialized admin instance is exported for use in other parts of the application where Firebase services are needed.
*/

const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

module.exports = admin;