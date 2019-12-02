const { db } = require('../util/admin');

// Fetch all screams
exports.getAllScreams = (req, res) => {
  db.collection('screams')
    .orderBy('createAt', 'desc')
    .get()
    .then((data) => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createAt: doc.data().createAt.body,
          commentCount: doc.data.commentCount,
        });
      });
      return res.json(screams);
    })
    .catch((err) => {
      console.error(err);
      req.status(500).json({ error: err.code });
    });
};

// Post one scream
exports.postOneScream = (req, res) => {
  if(req.body.body.trim() === '') {
    return res.status(400).json({ body: 'body must not by empty' });
  }

  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    createAt: new Date().toISOString()
  };

  db.collection('screams')
    .add(newScream)
    .then((doc) => {
      res.json({ massage: `document ${doc.id} created successfully` })
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err);
    });
};

// Fetch one scream
exports.getScream = (req, res) => {
  let screamData = {};

  db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc=> {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Scream not found' })
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db.collection('comments')
        // filter in data created
        .orderBy('createAt', 'desc')
        .where('screamId', '==', req.params.screamId)
        .get();
    })
    .then(data => {
      screamData.comments = [];
      data.forEach(doc => {
        screamData.comments.push(doc.data());
      })
      return res.json(screamData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error:err.code })
    })
};

exports.commentOnScream = (req, res) => {

}