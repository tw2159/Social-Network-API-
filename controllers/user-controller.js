const { User } = require('../models');
const mongoose = require('mongoose');

const userController = {
  getAllUsers(req, res) {
    User
      .find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  getUserById({ params }, res) {
    User
      .findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No user found with this id!' })
          return
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createUser({ body }, res) {
    User
      .create(body)
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });    
  },
  updateUser({ params, body }, res) {
    User
      .findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      )
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
  deleteUser({ params }, res) {
    User
      .findOneAndDelete({ _id: params.id })
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
  addFriend({ params }, res) {
    User
      .findOneAndUpdate(
        { _id: params.id },
        { $addToSet: { friends: params.friendId } },
        { new: true }
      )
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No user found with this id!' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  removeFriend({ params }, res) {
    User
      .findOneAndUpdate(
        { _id: params.id },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      )
      .then(data => {
        if(!data) {
          res.status(404).json({ message: 'Error!  No user found with this id! '});
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
}

module.exports = userController;
