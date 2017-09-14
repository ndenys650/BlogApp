// import libraries
var bodyParser 	= require("body-parser"),
methodOverride 	= require("method-override"),
expressSanitizer = require("express-sanitizer");
mongoose 				= require("mongoose"),
express 				= require("express"),
app 						= express();


// next four are boilerplate to all express apps / App configuration
// 1-configure mongoose and database
mongoose.connect("mongodb://localhost/restful_blog_app");

// 2-configure ejs file readability
app.set("view engine", "ejs");

// 3-serve custom stylesheet
app.use(express.static("public"));

// 4-body-parser setup
app.use(bodyParser.urlencoded({extended: true}));

// express sanitizer so clean data is entered only, must go after body parser
app.use(expressSanitizer());

// method override in order to get proper update functionality
app.use(methodOverride("_method"));

// 
// create schema/Mongoose model configuration
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	// take current date when the blog was created
	created: {type: Date, default: Date.now}
});

// compile into model
var Blog = mongoose.model("Blog", blogSchema);


// first-check, to make sure blog is working
// Blog.create({
// 	title: "Test Blog",
// 	image: "http://cdn.skim.gs/image/upload/v1456344012/msi/Puppy_2_kbhb4a.jpg",
// 	body: "Hello from the test blog!"
// });


// RESTful Routes

// initial redirect to /blogs
app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX Route and functionality
app.get("/blogs", function(req, res){
	// retrieve all blogs from DataBase
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			// render index with the data
			res.render("index", {blogs: blogs});
		}
	});
});


// NEW Route
// set path to new blog post link
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE Route
app.post("/blogs", function(req, res){
		// create blog
		console.log(req.body);
		req.body.blog.body = req.sanitize(req.body.blog.body);
		console.log("==========================")
		console.log(req.body);
		Blog.create(req.body.blog, function(err, newBlog){
			// if new blog post isn't complete return to page and console.log err
			if(err){
				res.render("new");
				console.log(err);
			} else {
				// if blog post complete then redirect to the index 
				res.redirect("/blogs");
			}
		});
});

// SHOW Route
app.get("/blogs/:id", function(req, res){
// find correct blog id and render to show route
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});


// EDIT Route
app.get("/blogs/:id/edit", function(req, res){
	// pull id from database
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			// if incorrect submission redirect back
			res.redirect("/blogs");
		} else {
			// route to edit page
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE Route
app.put("/blogs/:id", function(req, res){
	// sanitize update route
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// take id in url, find existing data and update
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});


// DESTROY route
app.delete("/blogs/:id", function(req, res){
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
	// redirect 
});



// setup up server for localhost and confirm
app.listen(3000, function(){
	console.log("GO SERVER GO!");
})