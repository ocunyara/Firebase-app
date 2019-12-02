let db = {
  users: [
    {
      userId: 'E5mjsn8TmdgVRNdwG51mmI1lNsX2',
      email: 'mainTest2@test.com',
      handle: 'mainTest2',
      createAt: '2019-11-24T14:53:32.014Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Lonodn, UK'
    }
  ],
  screams: [
    {
      userHandle: 'mainTest2',
      body: 'Scream',
      createAt: '2019-11-24T14:53:32.014Z',
      likeCount: 5,
      commentCount: 3
    }
  ],
  comments: [
    {
      userHandle: 'mainTest2',
      screamId: 'othkTLz6aOGcRAJ0b10q',
      body: 'Scream',
      createAt: '2019-11-06T18:51:43.840Z'
    }
  ],
  notifications: [
    {
      recipient: 'mainTest2',
      sender: 'john',
      read: 'true | false',
      screamId: 'othkTLz6aOGcRAJ0b10q',
      type: 'like | comment',
      createAt: '2019-11-06T18:51:43.840Z'
    }
  ]
};
const userDetails = {
  // Redux data
  credentials: {
    userId: 'E5mjsn8TmdgVRNdwG51mmI1lNsX2',
    email: 'mainTest2@test.com',
    handle: 'mainTest2',
    createAt: '2019-11-24T14:53:32.014Z',
    imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
    bio: 'Hello, my name is user, nice to meet you',
    website: 'https://user.com',
    location: 'Lonodn, UK'
  }
};