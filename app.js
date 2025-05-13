import dotenv from 'dotenv';
dotenv.config()

import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express
import express from 'express';
import session from 'express-session'
import cookieParser from 'cookie-parser';

// Express setup
const app = express();

app.use(express.json());
app.use(cookieParser());
import { engine } from 'express-handlebars';
import helpers  from 'handlebars-helpers';

app.use(express.urlencoded({ extended: true })); // for HTML form

app.use(session({
 secret: process.env.SESSION_SECRET, // use a strong secret in production
 resave: false,
 saveUninitialized: false,
 cookie: { secure: false } // set to true if using HTTPS
}));

app.use(express.static(path.join(__dirname, './src/public')));
app.engine('hbs', engine(
  {
    extname:'hbs',
    helpers:helpers()
  }
));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './src/views'));

// Routes
import authRoutes from './src/routes/authRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import userInfoRoutes from './src/routes/userInfoRoutes.js';
app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', userInfoRoutes);
app.use('/', adminRoutes);

import './initialize.js'

// Serve application
app.listen(3000, () => {
  console.log('Server running on port 3000');
});