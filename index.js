require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiLimiter = require('./middlewares/throttle');

const app = express();
app.use(express.json());
app.use(apiLimiter);

const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api', require('./routes/protectedRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

const { swaggerUi, swaggerSpec } = require('./utils/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => console.log(`Server running on port http://localhost:${process.env.PORT}`));
