// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors=require('cors')
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use(cors())

const url="mongodb+srv://rajk0723577:12321@usersdata.jhubsuj.mongodb.net/emplyee-attendence?retryWrites=true&w=majority"

mongoose.connect(url).then(res=>{
    console.log("connected database sucessfully")
}).catch((err)=>{
    console.log(err)

})
// Define Mongoose Schema for Employee and Attendance
const employeeSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
});

const attendanceSchema = new mongoose.Schema({
  employeeEmail: { type: String, required: true },
  date:{type:Date},
  checkIn: { type: Date, },

  checkOut:{ type: Date, } ,
});

const Employee = mongoose.model('Employee', employeeSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// API endpoints
app.get('/',(req,res)=>{
  res.send("hello from attendence")
})
app.post('/api/employees', async (req, res) => {
  try {
    const { email, name } = req.body;
    const newEmployee = new Employee({ email, name });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { email, checkIn, checkOut } = req.body;
    const newAttendance = new Attendance({ employeeEmail: email, checkIn, checkOut });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const attendanceData = await Attendance.find({ employeeEmail: email });
    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/attendance/all', async (req, res) => {
  try {
    const allAttendanceData = await Attendance.findAll({});
    res.status(200).json(allAttendanceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
