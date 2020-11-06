var express = require('express');
var router = express.Router();
var EmpModel = require('../models/employee')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//To register a new user
router.post("/register", function (req, res, next) {
  console.log("inside")
  EmpModel.findOne({ empId: req.body.empId }, function (err, employee) {
    if (err) {
      return next(err);
    } //SHOP NOT FOUND
    if (employee == null) {
      //NEW EMPLOYEE --SO INSERT
      req.body.active = 'A',
      req.body.createdAt= new Date();
      EmpModel.create(req.body, function (err, employee) {
        if (err) {
          return next(err);
        }
        console.log("inside create")
        res.status(200);
        res.json(employee);
      });
    } else {
      res.send(409, "Employee Already Registered");
    }
  });
});


router.get('/getEmployeeList', function (req, res, next) {
  EmpModel.find({
    "active": 'A'
  }, function (err, shop) {
    if (err) return next(err);
    res.json(shop);
  });
});


module.exports = router;
