var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Content = require('../models/listModel')


// Authentication Middleware
const loggedInOnly = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.redirect("/login");
  };
  
  const loggedOutOnly = (req, res, next) => {
    if (req.isUnauthenticated()) next();
    else res.redirect("/");
  };

// Route Handlers
function authenticate(passport) {

    //템플릿용 변수 설정
router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    console.log(res.locals.currentUser)
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
  });
// // Main Page
router.get("/", loggedInOnly, (req, res ,done) => {
    Content.find((err, result)=>{
      if(err) {
        done(err)
      }
      console.log(req.user.username)
      res.render("index", { username: req.user.username , data:result});
    })
    
  });


router.get('/data' , loggedInOnly, function(req,res){
  User.findOneAndRemove({username:"admin"}, (err, result)=>{
    if(err) {
      console.log(err)
    }
    res.json({"address":"서울시 마포구 백범로 18"})
  })
    // console.log(req)
    
})  

// Login View
  router.get("/login", loggedOutOnly, (req, res) => {
    res.render("login");
  });

  // Login Handler
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

router.get('/signup',loggedOutOnly, function(req, res){
    res.render('signup', {message:"true"})
})


router.post("/signup",function(req,res,next){
    var username = req.body.username;
     var email =  req.body.email
    var password = req.body.password;
    User.findOne({username:username},function(err,user){
      if(err){return next(err);}
      if(user){
        req.flash("error","사용자가 이미 있습니다.");
        return res.render("signup" , {message:"false"});
      }
      User.create({ username,email, password })
      .then(user => {
        req.login(user, err => {
          if (err) next(err);
          else res.redirect("/");
        });
      })
      .catch(err => {
        if (err.name === "ValidationError") {
          req.flash("Sorry, that username is already taken.");
          res.redirect("/signup");
        } else next(err);
      });
    });
  });

router.get('/content', (req, res, next)=>{
  res.render('insert')
})
  
router.post('/content' ,function(req, res){
    
    var contact = new Content()
    contact.title = req.body.title
    contact.description = req.body.description
    contact.author = req.body.author
    contact.email = req.body.email

    contact.save(function(err) {
        if(err){
            res.json({
                status:'error',
                message:err
            })
        } else {
            res.redirect('/')
        }
    })    
})

router.post('/delete/:id', (req ,res , next)=>{
  var id = req.params.id
  console.log(req.params.id)
  Content.findOneAndDelete({_id:id} , (err, result)=>{
    if(err) {
      next(err)
    }
    res.redirect('/')
  })
})
// Logout Handler
router.all("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
  });


// Error Handler
router.use((err, req, res) => {
    console.error(err.stack);
    // res.status(500).end(err.stack);
  });

return router;
}
module.exports = authenticate;