import './config.mjs';
import express from 'express';
import Question from './db.mjs';
import url from 'url';
import path from 'path';
import cors from 'cors';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post('/questions/', async (req, res) => {
  // TODO: finish implementation
  if (req.body){
    const newQ = new Question({
      question: req.body.question,
    });
    newQ.save()
      .then(doc => res.json(doc))
      .catch(err => res.json({error: err}));
  }
});

app.post('/questions/:id/:answer/', async (req, res) => {
  const update = { "$push": { answers: req.params.answer } };
  try {
    const result = await Question.findByIdAndUpdate(req.params.id, update, { "new": true });
    res.json({ answers: result.answers });
  } catch(e) {
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

app.get('/questions', async (req, res) => {
  // TODO: finish implementation
  const questions = await Question.find({});
  res.json(questions);
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {console.log(`Server is listening on ${port}`);});
