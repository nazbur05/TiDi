const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

// Set up server
const port = process.env.PORT || 5000;
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synchronized');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => console.error('Error syncing database:', err));