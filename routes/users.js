/*
 *
 * Title: users API
 * Description: user api to register users
 * Author: Shah Arafat
 * Date: 23-02-2021
 *
 */
// dependencies
const express = require('express');
const { User, validate } = require('../models/user');
cosnt router = express.Router()



router.post('/', async (req, res) => {
  const error = validate(req.body);  

  if (error) {
    const {
      details: [{ message }],
    } = error;
    // bad request
    res.status(400).send(message);
    return;
  }
  
  // check already registerd with this mail or not
  let user = await User.findOne({email:req.body.email});
  if(user) return res.status(400).send("User already registered. ");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password:req.body.password
  })

  await user.save();
  res.send(user);
})

// export
module.exports = router