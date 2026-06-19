require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
// const cors = require("cors");

const app = express()
app.use(express.json())
app.use(express.static('dist'))
// app.use(cors());

morgan.token('myToken', (request) => JSON.stringify(request.body))
app.use(morgan('tiny'))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :myToken',
  ),
)

//Display the persons in the phonebook
app.get('/api/persons', (request, response,next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

//Display the number of persons in the phonebook
app.get('/info', (request, response,next) => {
  response.setHeader('Content-Type', 'text/plain')

  Person.find({})
    .then((persons) => {
      const count = persons.length
      const when = new Date()
      response.send(`
    Phonebook has info for ${count} people 
    ${when.toString()}`)
    })
    .catch((error) => next(error))
})

//Display a single person from the phonebook
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

//Delete a specific (id) person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      if (person) {
        response.status(204).end()
      } else {
        return response
          .status(400)
          .json({ error: 'person missing from database' })
      }
    })
    .catch((error) => next(error))
})

//Add a person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  Person.findOne({ name: body.name })
    .then((personFound) => {
      if (personFound) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      if (!body.name) {
        return response.status(400).json({ error: 'name missing' })
      }

      if (!body.number) {
        return response.status(400).json({ error: 'number missing' })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person
        .save()
        .then((savedPerson) => {
          response.json(savedPerson)
        })
        .catch((error) => next(error))
    })
    .catch((error) => next(error))
})

//Update a specific (id) person
app.put('/api/persons/:id', (request, response, next) => {
  const opts = { runValidators: true }
  console.log('Update validators:',opts)
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response
          .status(404)
          .json({ error: `${name} is no longer in the database` })
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

//Error handler as last middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
