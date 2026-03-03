import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

import router from './router.js';
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
//* Initializations
const app = express();
// Node PORT
const PORT = process.env.NODE_PORT;

//* Middlewares
app.use(morgan("dev"));
//* Enabling cors for all request by usiing cors middleware
app.use(cors());
// Parse application/json
app.use(bodyParser.json({ limit: "50mb" }));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//* Routes
router(app);

//errorHandler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // console.log("Environment variables loaded:");
    // console.log("DB_HOST:", process.env.DB_HOST);
    // console.log("DB_USER:", process.env.DB_USER);
    // console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    // console.log("DB_NAME:", process.env.DB_NAME);
    // console.log("DB_PORT:", process.env.DB_PORT);
    // console.log("JWT_SECRET:", process.env.JWT_SECRET);
});