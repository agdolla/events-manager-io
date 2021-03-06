import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models';

const { User, Event } = db;

class UserController {
  /**
   * Creates a new user with a hashed password and creates a token for user
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json} registered user details
   */
  static createUser(req, res) {
    if (
      req.body.password === undefined ||
      req.body.password === null ||
      req.body.password.length < 5
    ) {
      res.status(400).send({ message: 'password is too short! - make sure it is at least 5 characters' });
    } else {
      // Hash password to save in the database
      const password = bcrypt.hashSync(req.body.password, 10);
      User
        .create({
          username: req.body.username,
          password,
          email: req.body.email,
          fullname: req.body.fullname,
          admin: false,
        })
        .then((user) => {
          const token = jwt.sign( // Create a token that lasts for an hour
            { id: user.id, admin: false },
            process.env.SECRET_KEY,
            { expiresIn: '60m' },
          );
          const safeUser = user;
          safeUser.password = 'xxxxxxxxxxxxxxxxxxxx';
          res.status(201).send({ message: 'user created!', user: safeUser, token });
        })
        .catch((err) => {
          res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
        });
    }
  }

  /**
   * Creates a session token for user
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{string} log-in status
   */
  static loginUser(req, res) {
    User
      .findOne({
        where: { username: req.body.username },
      })
      .then((user) => {
        if (user) { // If user exists
          // Compare hashed password
          bcrypt.compare(req.body.password, user.password).then((check) => {
            if (!check) { // If password does not match
              res.status(401).send({ message: 'wrong password or username!' });
            } else {
              // Create a token that lasts for an hour
              const token = jwt.sign({ id: user.id, admin: user.admin }, process.env.SECRET_KEY, { expiresIn: '60m' });
              res.status(200).send({ message: 'user logged in!', token });
            }
          });
        } else {
          res.status(401).send({ message: 'wrong password or username!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * Gets the user's details and associated events
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json} registered user details
   */
  static getUser(req, res) {
    User
      .findById(req.user.id, {
        include: [
          { model: Event, as: 'events' },
        ],
      })
      .then((user) => {
        const safeUser = user;
        safeUser.password = 'xxxxxxxxxxxxxxxxxxxx';
        res.status(200).send({ message: 'user details delivered!', user: safeUser });
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * Modify user's details
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json} registered user details
   */
  static modifyUserProfile(req, res) {
    User
      .findOne({ where: { id: req.user.id } })
      .then((user) => {
        if (user) {
          user
            .update({
              fullname: req.body.fullname || user.fullname,
              description: req.body.description || user.description,
              tagline: req.body.tagline || user.tagline,
              picture: req.body.picture || user.picture,
            })
            .then((modifiedUser) => {
              const safeUser = modifiedUser;
              safeUser.password = 'xxxxxxxxxxxxxxxxxxxx';
              res.status(200).send({ message: 'user profile updated!', user: safeUser });
            });
        } else {
          res.status(403).send({ message: 'you can only modify your own profile!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * NOTE: UNIMPLEMENTED
   * Logs out user
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json} registered user details
   */
  static logoutUser(req, res) { res.send(200).send({ message: 'user logged out!' }); }
}

export default UserController;
