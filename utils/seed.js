const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomUserName, getRandomThought, getRandomReactions, getRandomDomain, getRandomArrItem } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection('thoughts');
  }

  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  const users = [];
  const allThoughts = [];

  for (let i = 0; i < 10; i++) {
    const username = getRandomUserName();
    const email = `${username}@${getRandomDomain()}.com`;
    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
      const thoughtText = getRandomThought(5);
      const thought = {
        thoughtText,
        username,
      };

      allThoughts.push(thought);
    };
    const user = {
      username,
      email
    };

    users.push(user);
  };
//Using the .insertMany Mongoose method in order to populate the 'thoughts' collection with documents that map in 1-1 fashion to the thought-objects that are the elements of the allThoughts array.
  await Thought.collection.insertMany(allThoughts);

  for (const user of users) {
    user.thoughts = allThoughts.filter(thought => thought.username === user.username).map(({ _id }) => _id);
  };

  await User.collection.insertMany(users);

  const userData = await User.find().lean();
  const userIds = userData.map(user => user._id);
//Iterate through the userIds array in order to add a new friend (other than him/herself) to each user
  for (const id of userIds) {
    const otherIds = userIds.filter(_id => _id !== id);
    const newFriend = getRandomArrItem(otherIds);

    await User.findOneAndUpdate({ _id: id }, { friends: [newFriend] });
  };
//We retrieve all thought-related documents and create an array of all available usernames in the database.
  const thoughtData = await Thought.find().lean();
  const userNames = userData.map(user => user.username);
//We use the previous two arrays in order to give each thought a randomly generated reaction by a user other than the author of the tought.
  for (const thought of thoughtData) {
    const otherUserNames = userNames.filter(name => name !== thought.username);
    await Thought.findOneAndUpdate({ _id: thought._id }, { reactions: getRandomReactions(1, otherUserNames) });
  };
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
