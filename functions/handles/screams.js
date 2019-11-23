const { db } = require('../util/admin');

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
}