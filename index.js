require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const FileStore = require('session-file-store')(session)
const conn = require('./db/conn')


//models
const Tought = require('./models/Toughts');
const User = require('./models/User');
//routes
const toughtsRoutes = require('./routes/ToughtsRoutes');
const ToughtController = require('./controllers/ToughtController')


const AuthRoutes = require('./routes/AuthRoutes');
// const AuthController = require('./controllers/AuthController')

app.use(express.urlencoded({
   extended: true,
}))
app.use(express.json())

const hbs = exphbs.create({
   partialsDir: ["views/partials"]
})

app.engine('handlebars', hbs.engine)

app.set('view engine', 'handlebars');

app.use(express.static('public'));


app.use(
   session({
      name: 'session',
      secret: 'nosso_secret',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
         logFn: function(){},
         path: require('path').join(require('os').tmpdir(), 'sessions'),
      }),
      cookie: {
         secure: false,
         maxAge: 360000,
         expires: new Date(Date.now() + 360000),
         httpOnly: true,
      }
   }),

)


// flash messages

app.use(flash())

//salvar sessão
app.use((req, res, next) =>{
   if(req.session.userid){
      res.locals.session = req.session
   }
   next()
})

//Routes of authentication

app.use('/', AuthRoutes)

//Routes page

app.use('/toughts', toughtsRoutes)
app.get('/', ToughtController.showToughts)

conn.
    sync()
    //sync({ force: true })
    .then(() => {
        app.listen(process.env.PORT);
    }).catch((err) => console.log(err))