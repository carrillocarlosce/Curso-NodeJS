var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

mongoose.connect('mongodb://localhost:27017/fotos');

var posibles_valores = ['F','M'];

var match_email = [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Correo no Valido']

var password_validation = {
	 		validator: function(p) {
	 			return this.password_confirmation == p;
	 		},
	 		message: 'Las contraseñas no son iguales'
	 	}

var user_schema = new Schema({
	 name: String,
	 username: {
	 	type: String,
	 	required: true,
	 	maxlength: [50, 'El nombre de usuario no puede tener mas de 50 caracteres']
	 },
	 password: {
	 	type: String,
	 	minlength: [8, 'La contraseña debe ser de almenos 8 caracteres'],
	 	validate: password_validation
	 },
	 age: {
	 	type:Number,
	 	min:[5,'La edad no puede ser menor a 5'],
	 	max:[100, 'La edad no puede ser mayor a 100']
	 },
	 email: {
	 	type: String,
	 	required: 'El correo es obligatorio',
	 },
	 date_of_bird: Date,
	 sex:{
	 	type: String,
	 	enum:{
	 		values: posibles_valores,
	 		message: 'La opcion no es valida'
	 	}
	 }
});

user_schema.virtual('password_confirmation').get(function(argument) {
	return this.p_c;
}).set(function(password) {
	this.p_c = password;
})

var User = mongoose.model('User', user_schema);

module.exports.User = User;