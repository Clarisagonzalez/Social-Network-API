const { User, Thought } = require('../models');

module.exports = {
    // Get all users.
    async getUsers(req, res) {
        try {
            const users = await User.find().lean({ virtuals: true, getters: true }).select('-__v');
            !users ? res.status(404).json({ message: 'No users have yet subscribed to the app.' }) :
                res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err.message);
        };
    },
    // Get Single User
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId }).lean({ virtuals: true, getters: true }).select('-__v');
            !user ? res.status(404).json({ message: 'No user with that ID.' }) : 
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err.message);
        }
    },
    // Create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }).lean({ virtuals: true, getters: true }).select('-__v');

            !user ? res.status(404).json({ message: 'No user found with that ID.' }) :
                res.status(200).json(user);
        } catch (err) {
            res.status(400).json(err.message);
        };
    },
    // Delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete(
                { _id: req.params.userId},
                { returnOriginal: true}
            );
            
            if(!user) res.status(404).json({ message: 'No user found with that id.'});
            //This part of the code deletes all thoughts that were authored by the already deleted user.
            await Thought.deleteMany({ username: user.username}).then(result => res.status(200)
            .json({ message: `The user ${user.username} and his/her associated ${result.deletedCount} thoughts were deleted.` }));
        } catch(err) {
            res.status(500).json(err.message);
        };
    },
    // Add a friend to a user's friends list
    async addFriend(req, res) {
        try{
            const friend = await User.findOne({ _id: req.params.friendId }).lean({ virtuals: true, getters: true });

            if(!friend) res.status(404).json({ message: 'Your friend is not currently a user.'});

             const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId }},
                { runValidators: true, new: true }
            ).lean({ virtuals: true, getters: true }).select('-__v');

            !user ? res.status(404).json({ message: 'No user with the provided userId.' }) :
                res.status(200).json(user);
        } catch(err) {
            res.status(400).json(err.message);
        };
    },
    // Delete a friend from a user's friends list
    async deleteFriend(req, res) {
        try{
            const friend = await User.findOne({ _id: req.params.friendId }).lean({ virtuals: true, getters: true });

            if(!friend) res.status(404).json({ message: 'Your friend is not currently a user.'});

             const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            ).lean({ virtuals: true, getters: true }).select('-__v');

            !user ? res.status(404).json({ message: 'No user with the provided userId.' }) :
                res.status(200).json(user);
        } catch(err) {
            res.status(400).json(err.message);
        };
    }
};
