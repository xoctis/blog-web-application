import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

let userIsAuthorised = false;

let posts = [{
    category: "Public",
    title: "Dream Come True", 
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra venenatis urna eget blandit. Aliquam ultricies quam ac commodo consequat. Vestibulum eget lorem fringilla, dapibus dui a, molestie nisl. Pellentesque eget quam quis nec."
}, {
    category: "Friends",
    title: "By the Gods.", 
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra venenatis urna eget blandit. Aliquam ultricies quam ac commodo consequat. Vestibulum eget lorem fringilla, dapibus dui a, molestie nisl. Pellentesque eget quam quis nec."
}];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

//custom middleware
function loginCheck(req, res, next) {
    const password = req.body["password"];
    const username = req.body["username"];
    if (password === "ILoveProgramming" && username === "username") {
      userIsAuthorised = true;
    };
    next();
    };
app.use(loginCheck);

//routes
app.get("/", (req, res) => {
    if (userIsAuthorised) {
        res.render("index.ejs", { postsBlog: posts });
    } else {
        res.render("login.ejs");
    };
});

app.post("/login", (req, res) => {
    res.redirect("/");
})

app.post("/logout", (req, res) => {
    userIsAuthorised = false;
    res.redirect("/");
});

app.post("/add", (req, res) => {
    posts.unshift({
        category: req.body["category"],
        title: req.body["title"], 
        content: req.body["content"]
    });
    res.redirect("/");
});

app.post("/edit", (req, res) => {
    const index = req.body["index"];
    if (index >= 0 && index < posts.length) {
        posts[index] = {
            category: req.body["category"],
            title: req.body["title"],
            content: req.body["content"]
        };
    }
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const index = req.body["index"];
    if (index >= 0 && index < posts.length) {
        posts.splice(index, 1); // Remove the post from the array
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server is running in port ${port}.`)
});