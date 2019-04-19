module.exports = function (app, passport, db, multer, ObjectId) {
  // ---------------------------------------
  // IMAGE CODE
  // ---------------------------------------
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + '.png')
    }
  })
  var upload = multer({ storage: storage })
  // ---------------------------------------
  // IMAGE CODE END
  // ---------------------------------------

  // pages =========================================================================

  app.get('/', function (req, res) {
    res.render('index.ejs')
  })

  // after the user is redirected to their profile,
  // the user will be able to upload an image and a name
  app.get('/profile', isLoggedIn, function (req, res) {
    let query = {username:req.user.local.name}//to takeout username ':' to see all sneakers
    if ('brand' in req.query && req.query.brand !== 'None') {
      query['brand'] = req.query.brand
    }
    db.collection('sneakerapp')
      .find(query)
      .toArray((err, result) => {
        // console.log(result); getting sneaker data to the terminal

        if (err) return console.log(err)
        res.render('profile.ejs', {
          sneakers: result,
          user: req.user
        })
      })
  })

  // api ===========================================================================

  app.post('/api/profile', upload.array('images', 5), (req, res) => {
    var images = req.files.map(file => '/images/uploads/' + file.filename)
    db.collection('sneakerapp').save(
      { username: req.body.username, images: images, review: req.body.review },
      (err, result) => {
        if (err) return console.log(err)
        res.redirect('/profile')
      }
    )
  })

  app.put('/api/profile_pic', upload.single('avatar'), (req, res) => {
    db.collection('users').findOneAndUpdate(
      { _id: ObjectId(req.body._id) },
      {
        $set: {
          'local.avatar': '/images/uploads/' + req.file.filename
        }
      },
      {
        sort: { _id: -1 },
        upsert: false
      },
      (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      }
    )
  })

  app.delete('/api/profile', (req, res) => {
    db.collection('sneakerapp').findOneAndDelete(
      { _id: ObjectId(req.body._id) },
      (err, result) => {
        if (err) return console.log(err)
        res.send(result)
      }
    )
  })

  app.get('/api/sneaker/:id', function (req, res) {
    const id = req.params.id
    console.log(id)

    // figure out how to get a sneaker by id from mongo
    // make template (ejs file) for displaying sneaker data
    // res.render the template with the sneaker data you get

    // db.collection('sneakerapp').find().toArray((err, reviews) => {
    //   if (err) return console.log(err)
    //   res.render('profile.ejs', {
    //     reviews: reviews,
    //     user: req.user
    //   })
    // })
  })

  app.post('/api/sneakersave', (req, res) => {
    const doc=[]
    for (var i = 0; i < req.body.stockxCode.length; i++) {
      if (req.body.save[i] === 'on') {
        doc[i]={
          username: req.user.local.name,
          name: req.body.name[i],
          gender: req.body.gender[i],
          retail_price: req.body.retail_price[i],
          highest_bid: req.body.highest_bid[i],
          lowest_ask: req.body.lowest_ask[i],
          last_sold: req.body.last_sold[i]

        }
        
      }
      console.log(req.body.stockxCode[i], req.body.save[i])
    }
    db.collection('sneakerapp').insert(doc, 
          
      (err, result) => {
        if (err) return console.log(err)
        res.redirect('/profile')
      }
    )
  })

  app.post('/api/deletesneaker',  (req, res) => {
    db.collection('sneakerapp').deleteOne(
      { username: req.user.local.name, name: req.body.name},
      (err, result) => {
        if (err) return console.log(err)
        res.redirect('/profile')
      }
    )
  })

  app.post('/api/search', (req, res) => {
    const fetch = require('node-fetch')

    const query = req.body.query
    fetch('https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query', {
      method: 'POST',
      headers: {
        'x-algolia-agent': 'Algolia for vanilla JavaScript 3.22.1',
        'x-algolia-application-id': 'XW7SBCT9V6',
        'x-algolia-api-key': '6bfb5abee4dcd8cea8f0ca1ca085c2b3'
        // "Content-Type": "application/json",
      },
      body: JSON.stringify({
        params: 'query=' + query + '&hitsPerPage=20&facets=*'
      })
    })
      .then(response => response.json())
      .then(json => {
        for (let i = 0; i < json.hits.length; i++) {
          console.log('HIT #', i)
          console.log(json.hits[i])
        }
        res.render('search.ejs', { sneakers: json })
      })
  })
  app.get('/search', function (req, res) {
    res.render('search.ejs', {
      user: req.user,
      sneakers: null
    })
  })

  // =============================================================================
  // login/signup ================================================================
  // =============================================================================

  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') })
  })

  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    })
  )

  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.post(
    '/signup',
    upload.single('avatar'),
    passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    })
  )

  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user
    user.local.email = undefined
    user.local.password = undefined
    user.save(function (err) {
      res.redirect('/index')
    })
  })

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
  }
}
