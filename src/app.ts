import express, { Application } from 'express';
import httpStatus from 'http-status';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import * as http from 'http';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';

import User from './models/user';
import configs from './configs';
import connectToDb from './configs/mongoose';
import errorMiddleware from './middlewares/error';
import log from './utils/logger';
import APIError from './utils/APIError';

const app: Application = express();
const httpServer = http.createServer(app);
morgan('tiny');

/** Parser the request **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Cors **/
app.use(cors());

/** Rules of our API **/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE PATCH');
    return res.status(httpStatus.OK).end();
  }

  return next();
});

const client = new OAuth2Client(
  '411768487503-e06gsoh9etobrarghoagn8gbh6fjo7u8.apps.googleusercontent.com',
);

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const email = ticket.getPayload()?.email;
  const name = ticket.getPayload()?.name;

  let customUser;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    customUser = await User.create({ email, name });

    if (!customUser) {
      throw new APIError({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Can not create',
      });
    }
  } else {
    customUser = await User.findOneAndUpdate(
      { email },
      { email, name },
      { new: true },
    );
  }

  res.status(201);
  res.json(customUser);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/** Logging the request **/
app.use(morgan(':remote-addr :method :url :status :response-time ms'));

/** Error handling **/
app.use(errorMiddleware.routeNotFound);
app.use(errorMiddleware.handler);

/** Create the server **/
httpServer.listen(configs.server.port, async () => {
  log.info(
    `Server is running on port: ${configs.server.hostname}:${configs.server.port}`,
  );

  await connectToDb();
});
