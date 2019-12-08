const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } = require('./handles/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handles/users');

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


exports.api = functions.https.onRequest(app);