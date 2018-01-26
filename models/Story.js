const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title : {
    type : String,
    required : true
  },
  allowComments : {
    type : Boolean,
    default : true
  },
  comments : [{
    commentBody : {
      type: String,
      required : true
    }, 
    commentDate : {
      type : Date,
      default : Date.now()
    },
    commentUser : {
      type : Schema.Types.ObjectId,
      ref : 'users'
    }
  }],
  user : {
    type : Schema.Types.ObjectId,
    ref : 'users'
  },
  date : {
    type : Date,
    default : Date.now()
  },
  body : {
    type : String
  },
  status : {
     type: String,
     default : 'public'
  }
});

// Create collection and add schema
mongoose.model('stories', StorySchema, 'stories');