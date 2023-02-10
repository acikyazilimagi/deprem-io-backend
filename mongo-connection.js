require('dotenv').config();
const mongoUrl = process.env.MONGOURL;
 
const mongoose = require('mongoose');
    const connectDB = async () => {
        try {
            await mongoose.connect(mongoUrl);
    
            console.log('MongoDB connected!!');
        } catch (err) {
            console.log('Failed to connect to MongoDB', err);
        }
    };
    

module.exports = connectDB;