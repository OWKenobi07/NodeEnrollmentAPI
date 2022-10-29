
const express = require('express');
const router = express.Router();
//const cors = require('cors');

const app = express();

router.use(express.json());


const sampleCtrl = require('../controllers/sampleController');
const configurations = require('../configurations')

router.use(configurations.crossOrigin)


router.get('/', sampleCtrl.sampleDisplayMessage)
router.get('/users', sampleCtrl.sampleSqlSelect)
router.get('/users/:username', sampleCtrl.sampleSqlSelectParams)
router.post('/savesample', sampleCtrl.sampleSqlInsert)
router.post('/savesamplesp',  sampleCtrl.sampleSPInsert)
router.get('/uuid', sampleCtrl.sampleUUID)

module.exports = router;

