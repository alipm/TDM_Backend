import dotenv from "dotenv";

dotenv.config();

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Default error structure
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal Server Error',
  };

  // Add optional fields for debugging (only in dev mode)
  //  if (process.env.NODE_ENV === 'development') {
  //         response.details = err;
       // response.query = err.query;  
       // response.stack = err.stack;
  //  }

  res.status(statusCode).json(response);
};

export default errorHandler;
