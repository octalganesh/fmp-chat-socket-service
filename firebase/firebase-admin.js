// firebase/firebase-admin.js

const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require(path.resolve(
  __dirname,
  'firebase-admin-sdk.json'
));



// Initialize only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// 👇 FIX: export admin.messaging()
const messaging = admin.messaging();

module.exports = { admin, messaging };