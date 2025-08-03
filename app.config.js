import 'dotenv/config';

export default {
  expo: {
    name: 'ArenasCRM',
    slug: 'arenascrm',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.API_URL,
      env: process.env.ENV,
    },
  },
};
