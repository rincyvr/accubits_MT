var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    empId : String,
    contactNo: String,
    firstName:String,
    lastName:String,
    salary: String,
    active: String,
    createdBy: String,
    createdAt: Date,
    modifiedBy: String,
    modifiedAt: Date
});
module.exports = mongoose.model('employee', EmployeeSchema);