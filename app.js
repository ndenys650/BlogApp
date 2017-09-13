// import libraries
var bodyParser 	= require("body-parser"),
mongoose 		= require("mongoose"),
express 		= require("express"),
app 			= express();


// next four are boilerplate to all express apps / App configuration
// 1-configure mongoose and database
mongoose.connect("mongodb://localhost/restful_blog_app");

// 2-configure ejs file readability
app.set("view engine", "ejs");

// 3-serve custom stylesheet
app.use(express.static("public"));

// 4-body-parser setup
app.use(bodyParser.urlencoded({extended: true}));


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

// Index Route and functionality
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






// title
// image
// body
// created


// setup up server for localhost and confirm
app.listen(3000, function(){
	console.log("GO SERVER GO!");
})