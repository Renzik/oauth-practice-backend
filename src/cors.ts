import cors from 'cors';

const allowedOrigins = ['http://localhost:3000', 'https://modest-einstein-76cd0d.netlify.app'];

const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions;

  let isDomainAllowed = allowedOrigins.includes(req.header('Origin'));

  isDomainAllowed
    ? (corsOptions = { origin: true, credentials: true })
    : { origin: false, credentials: true };

  console.log(`corsOptions`, corsOptions);

  callback(null, corsOptions);
};

module.exports = corsOptionsDelegate;
