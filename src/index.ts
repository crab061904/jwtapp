import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import router from './router';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:8080', // Allow your frontend domain
  credentials: true,              // Allow cookies to be sent
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', router());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});

// MongoDB connection setup
const MONGO_URL = process.env.MONGO_URL as string; // Access the MongoDB URI from .env file

if (!MONGO_URL) {
  console.error('MONGO_URL is not defined in the .env file');
  process.exit(1); // Exit if the MONGO_URL is not defined
}

mongoose.Promise = Promise;

// MongoDB connection event handlers
mongoose.connection.on('error', (error: Error) => {
  console.log(error);
});

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB database");
});

// Connect to MongoDB
mongoose.connect(MONGO_URL);

