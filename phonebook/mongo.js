const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://danielcsillag:${password}@fsodb.iwmvlro.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=FSODB`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('Phonebook')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}