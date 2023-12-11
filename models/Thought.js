const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const formatDate  = require('../utils/formatDate');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const mongooseLeanGetters = require('mongoose-lean-getters');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function () {
                return formatDate(this.createdAt);
            }
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });

thoughtSchema.plugin(mongooseLeanVirtuals);
thoughtSchema.plugin(mongooseLeanGetters);

const Thought = model('thought', thoughtSchema);

module.exports = Thought;