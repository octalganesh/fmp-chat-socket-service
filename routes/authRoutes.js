// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);

router.get("/health",(req,res)=>{
  res.json({"success":true})
})
router.post('/login', login);

module.exports = router;
