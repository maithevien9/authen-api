import logger from 'pino';
import moment from 'moment';

const log = logger({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => {
    return `,"time":"${moment().format()}"`;
  },
});

export default log;
