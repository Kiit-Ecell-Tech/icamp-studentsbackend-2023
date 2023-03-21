const studentRouter = require('express').Router()
const Student = require('../models/student')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const path = require('path')
const validator = require('email-validator')

studentRouter.get('/', async (request, response) => {
  const students = await Student.find({})
  response.json(students)
})

studentRouter.post('/', (request, response) => {
  const body = request.body
  const student = new Student({ ...body })

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  let MailGenerator = new Mailgen({
    theme: {
      path: path.resolve('theme.html'),
    },
    product: {
      name: 'Icamp',
      link: 'https://www.instagram.com/ecell_kiit/',
      student: body.name
    },
  })

  let mail = MailGenerator.generate({ body:{} })
  console.log(body.email, process.env.EMAIL_PASSWORD, process.env.EMAIL_USER)

  let message = {
    from: process.env.EMAIL_USER,
    to: body.email,
    subject: 'Thank You for Registering for the Internship Camp’23',
    html: mail,
  }

  if (!body.name || !body.email ) {
    return response.status(400).json({
      error: 'name or email missing'
    })
  }
  // email validator
  if(!validator.validate(body.email)){
    return response.status(400).json({
      error: 'Wrong student email'
    })
  }

  student
    .save()
    .then(() => transporter.sendMail(message))
    .then(() => response.status(200).json({ success: 'successful' }))
    .catch((err) => {
      if(err.code === 11000){
        return response.status(400).json({
          error: 'Student or roll already exist.'
        })
      }
      return  response.status(500).send(err)})
})

studentRouter.get('/:id', async (request, response) => {
  const student = await Student.findById(request.params.id)
  if (student) {
    response.json(student)
  } else {
    response.status(404).end()
  }
})

studentRouter.delete('/:id', async (request, response) => {
  await Student.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

studentRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const student = {
    name: body.content,
  }
  Student.findByIdAndUpdate(request.params.id, student, { new: true })
    .then((updatedCompany) => {
      response.json(updatedCompany)
    })
    .catch((error) => next(error))
})

module.exports = studentRouter
