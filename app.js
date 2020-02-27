import path from 'path';

import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import nanoid from 'nanoid';
import ShortUrl from './models/shortUrl';
import formatDate from './utils/formatDate';

dotenvConfig();
const app = express();

// Setting up mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

// Setting up the expres app
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(morgan('dev'));
app.disable('x-powered-by');

app.get('/', async (_req, res) => {
  const shortUrls = await ShortUrl.find();
  for (const shortUrl of shortUrls) shortUrl.formattedCreatedAt = formatDate(shortUrl.createdAt);

  res.status(200).render('index', { shortUrls });
});

app.post('/shortUrl', async (req, res) => {
  let id = nanoid(4);
  const shortUrls = await ShortUrl.find();
  const urlsIds = shortUrls.map(elt => elt.short);
  while (urlsIds.includes(id)) id = nanoid(4);

  await ShortUrl.create({ full: req.body.longUrl, short: id });
  res.redirect('/');
});

app.delete('/:shortUrl', async (req, res) => {
  await ShortUrl.deleteOne({ short: req.params.shortUrl }).catch(console.error);
  res.redirect(303, 'back');
});

app.get('/:shortUrl', async (req, res) => {
  const url = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (!url) return res.status(404);

  url.clicks++;
  url.save();

  res.status(301).redirect(url.full);
});

app.listen(3000, () => console.log('App is running at port 3000'));
