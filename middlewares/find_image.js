var Imagen = require('../models/imagenes');

//var owner_check = require('./images_permission');

module.exports = function(req,res,next) {
	Imagen.findById(req.params.id)
	.populate('author')
	.exec(function(err,imagen) {
		if (imagen != null ) {
			res.locals.imagen = imagen;
			next();
		}
		else{
			res.redirect('/app')
		}
	})
}