const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  roll: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
  },
  address: {
    city: {
      required: true,
      type: String,
    },
    state: {
      required: true,
      type: String,
    },
  },
})

// removing _v from mongoose schema and making _id to id (transforming mongoose)
studentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Student', studentSchema)
