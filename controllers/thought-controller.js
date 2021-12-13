const { Thought, User } = require('../models');

const thoughtController = {
  getAllThought(req, res) {
    Thought
      .find({})
      .select('-__v')
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  getThoughtById({ params }, res) {
    Thought
      .findOne({ _id: params.id })
      .select('-__v')
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No thought found with this id!' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  addThought({ body }, res) {
    Thought
      .create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
      })
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No user found with this id!' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  updateThought({ params, body }, res) {
    Thought
      .findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      )
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No thought found with this id!' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  removeThought({ params }, res) {
    Thought
      .findOneAndDelete({ _id: params.id })
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No thought found with this id!' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  addReaction({ params, body }, res) {
    Thought
      .findOneAndUpdate(
        { _id: params.id },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No thought found with this id!' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  removeReaction({params}, res) {
    Thought
      .findOneAndUpdate(
        { _id: params.id },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true, runValidators: true }
      )
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No thought found with this id!' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
}

module.exports = thoughtController;
