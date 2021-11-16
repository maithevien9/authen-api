import mongoose from 'mongoose';
import configs from './index';
import log from '../utils/logger';

const connectToDb = async () => {
  try {
    await mongoose.connect(configs.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log.info('Connect to database successfully');
  } catch (e) {
    log.error('Can not connect to database', e);
    process.exit(1);
  }
};

export default connectToDb;
