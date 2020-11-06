var express = require('express');
var router = express.Router();
var UserModel = require("../models/user");
const jwt = require('jsonwebtoken');
const redis = require("redis");
var client = redis.createClient(6379);
var async = require("async");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//To register a new user
router.post("/register", function (req, res, next) {
  console.log("inside")
  UserModel.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return next(err);
    } //SHOP NOT FOUND
    if (user == null) {
      //NEW USER --SO INSERT
      req.body.active = 'A',
        req.body.createdAt = new Date();
      UserModel.create(req.body, function (err, user) {
        if (err) {
          return next(err);
        }
        console.log("inside create")
        res.status(200);
        res.json(user);
      });
    } else {
      res.send(401, "User Already Registered");
    }
  });
});

//Used for login 
router.post('/authenticate', function (req, res, next) {
  UserModel.findOne({ "email": req.body.email }, function (err, user) {
    if (err) throw err;
    console.log(user)

    if ((user === null && typeof user === "object")) {
      raiseError(res, 401, "Authentication failed. User not found.");
    } else {
      if (req.body.password === user.password) {
        // res.status(200);
        // res.json(user);
        const token = jwt.sign(
          { userId: user._id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' });
        res.status(200).json({
          userId: user._id,
          token: token
        });
      } else {
        raiseError(res, 401, "Authentication failed. Wrong password.");
      }
    }
  });
});

router.get('/getUser', function (req, res, next) {
  if (req.headers.token) {
    const decodedToken = jwt.decode(req.headers.token, { complete: true });
    if (!decodedToken) {
      res.send(409, "Invalid Token");
    } else {
      UserModel.find({
        "_id": decodedToken.payload.userId
      }, function (err, shop) {
        if (err) return next(err);
        let dataToRedis = {
          userId: decodedToken.payload.userId,
          token: req.headers.token,
          createdAt: new Date()
        }
        dataToRedis = JSON.stringify(dataToRedis);
        client.set(decodedToken.payload.userId, dataToRedis);
        res.json(shop);
      });
    }
  } else {
    res.send(204, "Token is empty");
  }
});

router.get('/usersLoggedIn', function (req, res) {
  console.log("inside if");
  client.keys('*', function (err, data) {
    console.log("parsed data", data)
    if (!err && data) {
      console.log("parsed data inside if", data)
      // client.map(data, function (error, data) {
      async.map(data, function (key, cb) {
        client.get(key, function (error, value) {
          // var parsedData = JSON.parse(value);
          if (error) return cb(error);
          var job = {};
          job['userId']=key;
          job['data']=value;
          cb(null, job);
      }); 
  }, function (error, results) {
     if (error) return console.log(error);
     console.log(results);
     res.json({data:results});
  });

      // } else {
      //   res.status(500).json("OTP Expired")
    }

  });
});

module.exports = router;
