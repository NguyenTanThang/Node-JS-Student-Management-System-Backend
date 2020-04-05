var express = require('express');
var router = express.Router();
const {
    getAdminByID,
    getAllAdmins,
    addAdmin,
    editAdmin,
    login
} = require("../controllers/adminController");

router.get('/', getAllAdmins);

router.get('/:id', getAdminByID);

router.post('/add', addAdmin);

router.put('/edit/:id', editAdmin);

router.post("/login", login)

module.exports = router;
