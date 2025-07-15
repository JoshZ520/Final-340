const express = require('express');
const session = require('express-session');
const path = require('path');
const authRouter = require('./routes/auth');
const charactersRouter = require('./routes/characters');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Placeholder routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', authRouter);
app.use('/characters', charactersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 