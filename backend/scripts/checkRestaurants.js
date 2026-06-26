const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config/config.env' });
const Restaurant = require('../models/restaurant');

(async () => {
  try {
    const uri = process.env.DB_URI || 'mongodb://127.0.0.1:27017/restaurant';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const count = await Restaurant.countDocuments();
    const sample = await Restaurant.find().limit(5).lean();
    console.log('DB_URI:', uri);
    console.log('restaurant count:', count);
    console.log('sample docs:', JSON.stringify(sample, null, 2));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error connecting/querying DB:', err.message || err);
    process.exit(1);
  }
})();
