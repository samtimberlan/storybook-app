const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load models
const Story = mongoose.model('stories');
const User = mongoose.model('users');

//Stories index
router.get('/', (req, res)=>{
   //Important:Filter story by status
   Story.find({status : 'public'})
   .populate('user')
   .then(stories =>{
     res.render('stories/index', {stories : stories});
   });
});

//Show single story
router.get('/show/:id', (req, res)=>{
  Story.findOne({
    _id : req.params.id
  })
  .populate('user')
  .then(story => {
    res.render('stories/show', {
      story : story
    });
  });
});

//Add Story Form
router.get('/add', ensureAuthenticated, (req, res)=>{
  res.render('stories/add');
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

router.get('/edit', ensureAuthenticated, (req, res)=>{
  Story.findOne({
    _id : req.params.id
  })
  .then(story => {
    res.render('stories/edit', {
      story : story
    });
  });
});

module.exports = router;