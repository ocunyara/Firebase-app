const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const db = require('./util/admin');

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } = require('./handles/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead} = require('./handles/users');

// Screams routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/screams/:screamId', getScream);
app.get('/screams/:screamId/like', FBAuth, likeScream);
app.get('/screams/:screamId/unlike', FBAuth, unlikeScream);
app.get('/screams/"screamId/comment', FBAuth, commentOnScream);
app.delete('/screams/:screamId', FBAuth, deleteScream);

//  Users route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.post('/user', FBAuth, getAuthenticatedUser);
app.post('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);


exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
.onCreate((snapshot)  => {
  db.doc(`/scream/${snapshot.data().screamId}`).get()
    .then(doc => {
      if(doc.exists){
        return db.doc(`/notifications/${snapshot.id}`).set({
          createAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'like',
          read: false,
          screamId: doc.id
        })
      }
    })
    .then(() => {
      return;
    })
    .catch((err) => {
      console.error(err);
      return;
    })
});

exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comment/{id}')
  .onCreate((snapshot)  => {
    db.doc(`/scream/${snapshot.data().screamId}`).get()
      .then(doc => {
        if(doc.exists){
          return db.doc(`/notifications/${snapshot.id}`).set({
            createAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          })
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      })
  });

exports.deleteNotificationOnLikes = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onDelete((snapshot)  => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      })
  });
