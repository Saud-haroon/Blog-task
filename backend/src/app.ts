import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import userRoutes from './routes/users';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes);

app.use(function (req : Request, res : Response, next : NextFunction) {  
  res.send({status : 404, message : 'The Requested Resource Is Not Found'});
});

app.use(function(req : Request, res : Response, next : NextFunction) {
  // console.log('Request header', req.headers)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// Routes

app.use(function (err: any  , req : Request, res : Response, next : NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  console.log('err',err)
  res.send({status : (err.status || 500), message : "Internal Server Error"});

});

process.on('uncaughtException', function(err : any) {  
  // Handle the error safely
  console.log('uncaughtException',err)
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
