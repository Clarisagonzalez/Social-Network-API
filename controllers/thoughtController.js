const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts by all users
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().lean({ virtuals: true, getters: true }).select('-__v');
            !thoughts ? res.status(404).json({ message: 'No thoughts have been added yet.' }) :
                res.status(200).json(thoughts);
        } catch (err) {
            res.status(500).json(err.message);
        };
    },
    // Get a particular thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).lean({ virtuals: true, getters: true }).select('-__v');
            !thought ? res.status(404).json({ message: 'No thought with that ID.' }) :
                res.status(200).json(thought);
        } catch (err) {
            res.status(500).json(err.message);
        };
    },
    // Create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create({
                username: req.body.username,
                thoughtText: req.body.thoughtText
            });

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            ).lean({ virtuals: true, getters: true }).select('-__v');

            !user ? res.status(404).json({ message: 'Thought created, but found no user with that ID' }) :
                res.status(201).json({ message: `New thought with ID ${thought._id} was created and added to the user ${user.username}.` });
        } catch (err) {
            res.status(400).json(err.message);
        };
    },
    // Update a particular thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            ).lean({ virtuals: true, getters: true }).select('-__v');

            !thought ? res.status(404).json({ message: 'No Thought with this id!' }) :
                res.status(200).json(thought);
        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    // Delete a particular thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id.' });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            ).lean({ virtuals: true, getters: true }).select('-__v');

            !user ? res.status(404).json({ message: 'Thought deleted but apparently no current user authored it.' }) :
                res.status(200).json({ message: `Thought successfully deleted and the document of ${user.username} was updated.` });

        } catch (err) {
            res.status(500).json(err.message);
        };
    },
    // Add a reaction to a thought 
    async addThoughtReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            ).lean({ virtuals: true, getters: true }).select('-__v');

            !thought ? res.status(404).json({ message: 'No thought with this id.' }) :
                res.status(200).json(thought);
        } catch (err) {
            res.status(400).json(err.message);
        };
    },
    // Remove a reaction to a thought 
    async deleteThoughtReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            ).lean({ virtuals: true, getters: true }).select('-__v');

            !thought ? res.status(404).json({ message: 'No thought with the provided id.' }) :
                res.status(200).json(thought);
        } catch (err) {
            res.status(500).json(err.message);
        };
    },
};
