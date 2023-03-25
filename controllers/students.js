const studentRouter = require('express').Router()
const Student = require('../models/student')
const middleware = require('../utils/middleware')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const path = require('path')

studentRouter.get('/', async (request, response) => {
  const students = await Student.find({})
  response.json(students)
})

studentRouter.get('/:id', async (request, response) => {
  const student = await Student.findById(request.params.id)
  return response.json(student)
})

studentRouter.post('/', middleware.validMailConfig, async (request, response) => {
  const body = request.body
  const student = new Student({ ...body })

  if (!body.name || !body.email) {
    return response.status(400).json({
      error: 'name or email missing',
    })
  }

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
      student: body.name,
    },
  })

  let mail = MailGenerator.generate({ body: {} })

  let message = {
    from: process.env.EMAIL_USER,
    to: body.email,
    subject: 'Thank You for Registering for the Internship Camp’23',
    html: mail,
  }

  await student.save()
  await transporter.sendMail(message)
  return response.status(201).json(student)
}
)

studentRouter.delete('/:id', async (request, response) => {
  await Student.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = studentRouter
