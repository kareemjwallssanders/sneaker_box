module.exports = function(app, passport, db, multer, ObjectId) {

//---------------------------------------
// IMAGE CODE
//---------------------------------------
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + ".png")
  }
})
var upload = multer({storage: storage})
//---------------------------------------
// IMAGE CODE END
//---------------------------------------

// pages =========================================================================

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // after the user is redirected to their profile,
  // the user will be able to upload an image and a name
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('sneakerapp').find().toArray((err, reviews) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        reviews: reviews,
        user: req.user
      })
    })
  });

  
// api ===========================================================================

  app.post('/api/profile', upload.array('images', 5), (req, res) => {
    var images = req.files.map(file => '/images/uploads/' + file.filename)
    db.collection('sneakerapp').save({username: req.body.username, images: images, review: req.body.review}, (err, result) => {
      if (err) return console.log(err)
      res.redirect('/profile')
    })
  })

  app.put('/api/profile_pic', upload.single('avatar'), (req, res) => {
    db.collection('users').findOneAndUpdate({_id: ObjectId(req.body._id)}, {
      $set: {
        "local.avatar": '/images/uploads/' + req.file.filename
      }
    }, {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  app.delete('/api/profile', (req, res) => {
    db.collection('sneakerapp').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
      if (err) return console.log(err)
      res.send(result)
    })
  });  

// =============================================================================
// login/signup ================================================================
// =============================================================================

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', upload.single('avatar'), passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/index');
    });
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }
}
