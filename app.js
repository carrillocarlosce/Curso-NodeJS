//Requires
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var User = require('./models/user').User;
var router_app = require('./routes.js');
var session_middleware = require('./middlewares/session');
var methodOverride = require('method-override');
var formData = require('express-form-data');
// End

var app = express();

// Static Files
app.use(express.static('public'));
app.use(express.static('vendor'));
// End
app.use(methodOverride('_method'));


app.use(formData.parse({
	keepExtensions:true
}))


/*
app.use(form.parse({
	keepExtensions:true
}));
// Sessions
app.use(session({
	secret: '739fyh938h9',
	resave: false,
	saveUninitialized: false
}))*/
// End

// Cookie
app.use(cookieSession({
	name: 'session',
	keys: ['llave-1','llave-2']
}))
// End

// Body Paser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// End

// Views
app.set('view engine', 'jade');
	// Index
app.get('/', function(req, res) {
	console.log(req.session.user_id)
	res.render('index')
})

app.post('/sessions', function(req, res) {
		User.findOne({
			email:req.body.email,
			password:req.body.password
		},function(err,user) {
			req.session.user_id = user._id;
			res.redirect('/app')
		})
})

app.post('/users',function(req,res) {
	var user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation
	})
	user.save().then(function(us) {
		// body...
		res.send('Guardamos tus datos');
	},function(err) {
		if (err) {
			console.log(String(err));
			res.send('No pudimos guardar la informacion')
		}
	})
})
	// Sign Up
app.get('/signup', function(req, res) {
	User.find(function(err,doc) {
		console.log(doc)
		res.render('signup')
	})
	
})
	// Login
app.get('/login', function(req, res) {
	res.render('login')
})
// End

app.use('/app',session_middleware)
app.use('/app',router_app);


app.listen(3000);

