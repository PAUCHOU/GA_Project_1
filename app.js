var express = require("express"),
	request = require("request"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	passport = require("passport"),
  	passportLocal = require("passport-local"),
  	cookieParser = require("cookie-parser"),
  	cookieSession = require("cookie-session"),
  	db = require("./models/index"),
  	flash = require('connect-flash'),


app = express();
var apparelSaved = [{id: 1}]
var count = 1;

app.use(cookieSession( {
  secret: 'thisismysecretkey',
  name: 'session with cookie data',
  // this is in milliseconds
  maxage: 3600000
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(__dirname + "/stylesheets"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride("_method"));

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){ 
      done(error, user);
    });
});


app.get("/", function(req, res){
	res.render("home.ejs",{
		isAuthenticated:  req.isAuthenticated(),
		user: req.user 
	});
});

app.get("/search", function(req, res){
	var query = req.query.searchTerm;
	var url = "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=kevincho-5cdd-4e73-96ab-635ac13cfe6b&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=" + query;
	request(url, function(err, response, body){
		if (!err){
			var data = JSON.parse(body);
			console.log(data);
			res.render("results.ejs", {itemList: data.findItemsByKeywordsResponse[0].searchResult[0].item || [], isAuthenticated : req.isAuthenticated()})
		}
	})
})

app.get("/item", function(req, res){
	var query = req.query.itemId;
	var url = "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=kevincho-5cdd-4e73-96ab-635ac13cfe6b&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=" + query;
	request(url, function(err, response, body){
		if(!err){
			var data = JSON.parse(body);
			res.render("info.ejs", {itemInfo: data.findItemsByKeywordsResponse[0].searchResult[0].item[0] || []});
		}
	})
})

app.get('/signup', function(req,res){  
  	res.render('signup')
});

app.get('/login', function(req,res){  
  	res.render('login')
});

app.get('/saved/:id', function(req,res){  
	var items = [];
  	db.saveditem.findAll({
  		where: {
  			userId: req.params.id
  		}
  	}).success(function(favorites){
  		
  		favorites.forEach(function(favorite, index){
  		var url = "http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=kevincho-5cdd-4e73-96ab-635ac13cfe6b&siteid=0&version=515&ItemID=" + favorite.item;
  		request(url, function(err, response, body){
  			if(!err){
  				var data = JSON.parse(body);
  				items.push(data.Item.PictureURL[0])	
  				
  			}
  			if(index == favorites.length-1) {
				console.log(items)
  				res.render("saved", {favorites:items});		
  				}
  			});
  		})
  		});
  	});
  		


app.post('/create', function(req, res){
	  db.user.createNewUser(req.body.username, req.body.password, 
  function(err){
    res.render("signup.ejs", {message: err.message, username: req.body.username});
  }, 
  function(success){
    res.render("login.ejs");
  });
})

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/'
}));

app.post("/save", function(req, res){
	console.log(req.body)
	var itemID;
	for(key in req.body) {
		itemID = key
	}
	db.saveditem.create({
		item: key,
		userId: req.user.id
	}).success(function(savedItem){
	res.redirect("/");	
	})
	
})

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/")
})


// app.delete("/saved/id:", )




app.listen(process.env.PORT || 3000)