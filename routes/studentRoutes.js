const express = require('express');
const router = express.Router();


const app = express();

router.use(express.json());


const studentCtrl = require('../controllers/studentController')
const configurations = require('../configurations')
router.use(configurations.crossOrigin)


router.post('/savestudentapplicant', studentCtrl.saveNewStudentRec)
router.post('/enrollstudent', studentCtrl.saveEnrollment)
router.get('/loadstudents', studentCtrl.loadStudents)
router.get('/searchStudentApplicant', studentCtrl.studentApplicants)

module.exports = router
