const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyAWLSSVZ5seBepk80IfGJ_EoiShCryffPY",
    authDomain: "instagram-113fe.firebaseapp.com",
    databaseURL: "https://instagram-113fe.firebaseio.com",
    projectId: "instagram-113fe",
    storageBucket: "instagram-113fe.appspot.com",
    messagingSenderId: "1031216888711",
    appId: "1:1031216888711:web:001359bfe539c35b"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/screams', (req, res) => {
    db
    .collection('screams')
    .orderBy('createAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createAt: doc.data().createAt
            });
        });
        return res.json(screams);
    })
    .catch((err) => console.error(err))
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createAt: new Date().toISOString()
    };

    db
      .collection('screams')
      .add(newScream)
      .then((doc) => {
          res.json({ massage: `document ${doc.id} created successfull` })
        })
    .catch((err) => console.error(err))
});

//  Signup route
let token, userId;

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
      .get()
      .then((doc) => {
          if (doc.exists) {
              return res.status(400).json({handle: 'this handle is already taken'});
          } else {
              return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password);
          }
      })
      .then((data) => {
          userId = data.user.uid;
          return data.user.getIdToken();
      })
      .then((idToken) => {
          token = idToken;
          const userCredentials = {
              handle: newUser.handle,
              email: newUser.email,
              createdAt: new Date().toISOString(),
              userId
          };
          return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .then(() => {
          return res.status(201).json({token});
      })
      .catch((err) => {
          console.error(err);
          if (err.code === 'auth/email-already-in-use') {
              return res.status(400).json({email: 'Email is already is use'});
          } else {
              return res
                .status(500)
                .json({general: 'Something went wrong, please try again'});
          }
      });

})

exports.api = functions.https.onRequest(app);