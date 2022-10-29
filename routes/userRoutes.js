const express = require('express');
const session = require('express-session')
const router = express.Router();
const app = express();





router.use(express.json());




const userCtrl = require('../controllers/userController');
const {crossOrigin, sqlStore} = require('../configurations')
router.use(crossOrigin)



router.use(session({
    key: "userId",
    secret: "superSecret",
    resave: false,
    saveUninitialized: false,
    store: sqlStore,
    cookie:{
        expires: 60 * 60 *24
    }
}))



router.post('/saveuser', userCtrl.addupdateUser)
router.post('/loginuser', userCtrl.loginUser)
router.get('/loginuser/', userCtrl.isLoggedIn)


module.exports = router;