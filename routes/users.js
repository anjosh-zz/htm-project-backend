var models  = require('../models');
var express = require('express');
var router  = express.Router();

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
  models.User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => {
    res.json({id : user.id});
  });
});

router.get('/:user_id/destroy', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.post('/:user_id/guests/create', function (req, res) {
  models.User.create({
    title: req.body.title,
    UserId: req.params.user_id
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/guests/:guest_id/destroy', function (req, res) {
  models.User.destroy({
    where: {
      id: req.params.guest_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


module.exports = router;
