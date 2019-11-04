const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/scream', (req, res) => {
    admin
    .firestore()
    .collection('screams')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push(doc.data());
        });
        return res.json(screams);
    })
    .catch((err) => console.error(err))
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle
    };

    admin
      .firestore()
      .collection('screams')
      .add(newScream)
      .then((doc) => {
          res.json({ massage: `document ${doc.id} created successfull` })
        })
    .catch((err) => console.error(err))
});

exports.api = functions.https.onRequest(app);