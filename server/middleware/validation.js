import bcrypt from 'bcrypt';
import db from '../models';

const { User, EventCenter } = db;

class Validation {
  /**
   * Checks if password matches the one sent by user
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static checkPasswordMatch(req, res, next) {
    User
      .findOne({
        where: { username: req.body.username },
      })
      .then((user) => {
        // Compare hashed password
        bcrypt.compare(req.body.password, user.password).then((check) => {
          if (!check) {
            res.status(401).send({ status: 401, message: 'Wrong password or username!' });
          } else next();
        });
      })
      .catch(err => res.status(400).send({ status: 400, message: err.errors[0].messsge || err }));
  }

  /**
   * Checks if request body contains required keys
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static checkBodyContains(...params) {
    return (req, res, next) => {
      params.forEach((p) => {
        if (req.body[p] === undefined) {
          res.status(400).send({ status: 400, message: `${p} required in body!` });
        }
      });
      next();
    };
  }

  /**
   * Trims body keys
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static trimBodyKeys(req, res, next) {
    // trim body keys
    Object.keys(req.body).forEach((k) => {
      req.body[k.trim()] = req.body[k];
    });
    next();
  }

  /**
   * Trims body values passed to it
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static trimBodyValues(...params) {
    return (req, res, next) => {
      // trim body values
      params.forEach((p) => {
        if (req.body[p] !== undefined) req.body[p] = req.body[p].trim(); // trim value if body exist
      });
      next();
    };
  }

  /**
   * Checks if username already exists
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static checkUsernameExists(req, res, next) {
    User
      .findOne({
        where: { username: req.body.username },
      })
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'Username does not exist!' });
        } else next();
      })
      .catch(err => res.status(400).send({ message: err.errors[0].messsge || err }));
  }

  /**
   * Checks if username already exists
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static checkUsernameNotExists(req, res, next) {
    User
      .findOne({
        where: { username: req.body.username },
      })
      .then((user) => {
        if (user) {
          res.status(409).send({ message: 'Username already taken!' });
        } else next();
      })
      .catch(err => res.status(400).send({ message: err.errors[0].messsge || err }));
  }

  /**
   * Checks if email already exists
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static checkEmailNotExists(req, res, next) {
    User
      .findOne({
        where: { email: req.body.email },
      })
      .then((user) => {
        if (user) {
          res.status(409).send({ message: 'Email already taken!' });
        } else next();
      })
      .catch(err => res.status(400).send({ message: err.errors[0].messsge || err }));
  }

  /**
   * Checks if center already exists
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static checkParamsValid(req, res, next) {
    if (!Number.isInteger(parseInt(req.params.centerId, 10))) {
      res.status(404).send({ message: 'Param type is not invalid!' });
    } else next();
  }

  /**
   * Checks if center already exists
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @param{Function} next - next middleware
   * @return{undefined}
   */
  static checkCenterExists(req, res, next) {
    EventCenter
      .findOne({
        where: { id: req.params.centerId },
      })
      .then((center) => {
        if (center === undefined || center === null) {
          res.status(404).send({ message: 'Cannot find specified event center!' });
        } else next();
      })
      .catch(err => res.status(400).send({ message: err.errors[0].messsge || err }));
  }
}

export default Validation;
