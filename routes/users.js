const express = require('express');
const router  = express.Router();

const passwordUtil = require('../utils/password');
const models  = require('../models');

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.get('/', function(req, res) {
  models.User.findAll().then(users => {
    res.json(users);
  });
});

router.post('/', async function(req, res) {
  try {
    let person = await models.Person.findOne({
      where: {email: req.body.email},
      include: [models.User]
    });

    if (!person || !person.User) {

      let password = req.body.password;
      let hashString = await passwordUtil.generateHashString(req.body.password);
      if (!person) {
        person = await models.Person.create({
          fullname: req.body.fullname,
          email: req.body.email,
          birthdate: req.body.birthdate,
          User: {
            password: hashString
          }
        }, {
          include: [models.Person.associations.User]
        });
      } else {
        let user = await models.User.create({password: hashString});
        person = await person.setUser(user);
      }
    }

    let error = await new Promise(function(resolve, reject) {
      req.login(person.User, resolve);
    });

    if (error) {
      throw error;
    }

    res.json({id : person.User.id});
  } catch (e) {
    console.log(e);
    res.json({error: e});
  }
});


module.exports = router;
