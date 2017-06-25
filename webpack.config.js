const dev = require('./webpack.development.config');
const prod = require('./webpack.production.config');
const ENV = process.env.NODE_ENV;

switch (ENV) {

  case 'production': {
    module.exports = prod;
    break;
  }

  case 'development':
  default: {
    module.exports = dev;
  }
}