const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load models
const Story = mongoose.model('stories');
const User = mongoose.model('users');

//Stories index
router.get('/', (req, res)=>{
  res.render('stories/index');
});

//Add Story Form
router.get('/add', ensureAuthenticated, (req, res)=>{
  //Important:Filter story by status
  Story.find({status : public})
  .then(stories =>{
    res.render('stories/add');
  });
});

//Handle Add Post request 
router.post('/', (req, res)=>{
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  }
  else{
    allowComments = false;
  }

  //Create Story Object
  const newStory = {
    title : req.body.title,
    body : req.body.body,
    status : req.body.status,
    allowComments : allowComments,
    user: req.user.id
  }

//Create Story
new Story(newStory)
.save()
.then(story => {
  res.redirect(`/stories/show/${story.id}`)
})
});

module.exports = router;