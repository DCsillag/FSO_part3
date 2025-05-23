const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to DB', error.message)
    })

const isAustralianPhone = v => {
    if (typeof v !== 'string') return false;
    const cleaned = v.replace(/[\s\-().]/g, '');
    return /^(\+61|0)[23784]\d{8}$/.test(cleaned);
};

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        required: true
    },
    number: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
          validator: isAustralianPhone,
          message: props => `${props.value} is not a valid Australian phone number!`
        }
      }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)