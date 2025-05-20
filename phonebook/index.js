const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

// Custom Morgan token for POST data
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

// Use built-in :method and :date tokens, and custom :post-data
app.use(morgan(':method :url :date[iso] :status :res[content-length] - :response-time ms :post-data'))

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
// Send all data in the data object via JSON. 
app.get('/api/persons', (request,response) => {
    response.json(data)
})

// Send textual data about the number of people and time.
app.get('/info', (request, response) => {
    response.set('Content-type', 'text/html')
    response.send(
        `Phonebook has info for ${data.length} people <br> 
        ${new Date()}`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content Missing'
        })
    }

    if (data.some(person => person.name === body.name)) {
        return response.status(409).json({
            error: 'User already exists'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 7000) + 1
    }

    data = data.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})