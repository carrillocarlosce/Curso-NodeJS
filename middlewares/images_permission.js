var Imagen = require('../models/imagenes')
module.exports = function(imagen,req,res) {

	if (req.method === 'GET' && req.path.indexOf('edit') < 0) {
		return true;
	}
	if (typeof imagen.author == 'undefined') {
		return false;
	}
	if(imagen.author._id.toString() == res.locals.user._id){
		return true
	}
	return false;
}