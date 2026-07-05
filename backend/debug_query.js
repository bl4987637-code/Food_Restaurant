const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config/config.env') });
const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant');
const APIFeatures = require('./utils/apiFeatures');

mongoose.connect(process.env.DB_URI).then(async () => {
  console.log('Connected to DB');
  
  // 1. Direct count
  const total = await Restaurant.countDocuments();
  console.log('Total restaurants in DB:', total);

  // 2. Simulate controller with keyword='' (what frontend sends)
  const features1 = new APIFeatures(Restaurant.find(), { keyword: '' }).search().sort();
  const r1 = await features1.query;
  console.log('keyword="" result count:', r1.length);

  // 3. Simulate controller with no keyword
  const features2 = new APIFeatures(Restaurant.find(), {}).search().sort();
  const r2 = await features2.query;
  console.log('no keyword result count:', r2.length);

  // 4. Plain find
  const r3 = await Restaurant.find({});
  console.log('plain find count:', r3.length);

  process.exit(0);
}).catch(e => {
  console.log('DB Error:', e.message);
  process.exit(1);
});
