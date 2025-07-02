import Cors from 'cors';
import initMiddleware from './initMiddleware';

// Allow only POST and GET from any origin
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST'],
    // origin: '*', // 👈 Allow all (you can restrict later)
    origin: ['https://punchlightbackend.vercel.app/', 'http://localhost:3000', "http://localhost:5173"]

  })
);

export default cors;
