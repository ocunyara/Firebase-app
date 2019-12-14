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

exports.createNotificationOnLike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot)  => {
    return db.doc(`/scream/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
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
      .catch((err) => {
        console.error(err);
        return;
      })
});

exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comment/{id}')
  .onCreate((snapshot)  => {
     return db.doc(`/scream/${snapshot.data().screamId}`).get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
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


exports.onUserImageChange = functions.region('europe-west1').firestore.document('/users/{userId}')
  .onUpdate((change) => {

    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db.collection('screams').where('userHandle', '==', change.before.data().handle).get()
        .then((data) => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl});
          })
          return batch.commit();
        })
    } else return true;
  });

exports.onScreamDeleted = functions
  .region('europe-west1').firestore.document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db.collection('comments').where('screamId', '==', screamId).get()
      .then((data) => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        })
        return db.collection('likes').where('screamId', '==', screamId).get()
      })
      .then((data) => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        })
        return db.collection('notifications').where('screamId', '==', screamId).get()
      })
      .then((data) => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        })
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
        return;
      })
  });