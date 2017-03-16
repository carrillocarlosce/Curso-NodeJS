//Requires
var express = require('express');

var Imagen = require('./models/imagenes');

var image_finder = require('./middlewares/find_image');
var fs = require('fs');

// End

var router = express.Router();

// Routes

router.get('/',function(req,res) {
	Imagen.find({})
		.populate('author')
		.exec(function(err,imagenes) {
			if (err) {
				console.log(err);
			}
			res.render('app/home',{imagenes:imagenes})
		})
	
})

router.all('/imagenes/:id/*',image_finder)
// Rest

router.get('/imagenes/new',function(req,res) {
	res.render('./app/images/new')
});

router.get('/imagenes/:id/edit',function(req,res) {
	res.render('./app/images/edit')
});

// Imagen
router.route('/imagenes/:id')
	.get(function(req,res) {
		console.log()
		res.render('./app/images/show')
	})
	.put(function(req,res) {
		
		res.locals.imagen.title = req.body.title;
		res.locals.imagen.save(function(err) {
			if (!err) {
				res.render('./app/images/show')
			}
			else{
				res.redirect('/app/imagenes/'+req.params.id+'/edit')
			}
		})
			
	})
	.delete(function(req,res) {
		Imagen.findOneAndRemove({
			_id: req.params.id
		},function(err) {
			if (!err) {
				res.redirect('/app/imagenes/')
			}
			else{
				console.log(err)
				res.redirect('/app/imagenes/')
			}
		})
	})

// Collection
router.route('/imagenes')
	.get(function(req,res) {
		Imagen.find({
			author: res.locals.user._id
		},function(err,imagenes) {
			if (err) {
				res.redirect('/app')
				return;
			}
			res.render('app/images/index',{imagenes: imagenes})
		})
	})
	.post(function(req,res) {
		var extension = req.files.fileImg.name.split('.').pop();
		var data = {
			title: req.body.title,
			author: res.locals.user._id,
			extension: extension
		}

		var imagen = new Imagen(data);

		imagen.save(function(err) {
			if (!err) {
				fs.rename(req.files.fileImg.path, 'public/images/'+imagen._id+'.'+extension)
				res.redirect('/app/imagenes/'+imagen._id+'/')
			}
			else{
				console.log(imagen)
				res.render(err)
			}
		})
	})

module.exports = router;