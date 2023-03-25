const validator = require('email-validator')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted Id' })
  } else if (error.code === 11000) {
    return response
      .status(400)
      .json({ error: 'Student or roll already exists' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const validMailConfig = (request, response, next) => {
  const email = request.body.email
  if (!validator.validate(email)) {
    return response.status(400).json({
      error: 'Invalid Email',
    })
  }

  if (email.split('@')[1] !== 'kiit.ac.in') {
    {
      return response.status(400).json({
        error: 'Invalid KIIT-Email',
      })
    }
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  validMailConfig,
}
