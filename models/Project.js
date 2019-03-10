const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  categories: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  // property ('createdBy') === path
  // ref ('User') === model
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  messages: [
    {
      messageBody: {
        type: String,
        required: true
      },
      messageDate: {
        type: Date,
        default: Date.now
      },
      messageUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
      }
    }
  ]
});

// Create index to search on all fields of projects
ProjectSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model("Project", ProjectSchema);
