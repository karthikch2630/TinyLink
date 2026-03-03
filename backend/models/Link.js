import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  target: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastClick: {
    type: Date,
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

const Link = mongoose.model('Link', linkSchema);

export default Link;
