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
  })
});

router.post('/', function(req, res) {
  passwordUtil.generateHashString(req.body.password)
    .then(hashString => {
      return models.Person.findOne({
        where: {email: req.body.email}, 
        include: [models.User]
      }).then(person => {
        if (person) {
          return person;
        }
        return models.Person.create({
          fullname: req.body.fullname,
          email: req.body.email,
          birthdate: req.body.birthdate,
          User: {
            password: hashString
          }
        }, {
          include: [models.Person.associations.User]
        });
      }).then(person => {
        res.json({id : person.User.id});
      });
    });
});


module.exports = router;
