const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const postsDir = './posts'
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir);
}

// YOUR CODE GOES IN HERE
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })

app.post("/blogs", (req, res) => {
  // get the title and the content from the request
  const title = req.body.title;
  const content = req.body.content;
  const filepath = `${postsDir}/${title}`
  fs.writeFileSync(filepath, content);
  res.end("ok");
});

app.put("/posts/:title", (req, res) => {
  const title = req.params.title;
  const content = req.body.content;
    const filepath = `${postsDir}/${title}`;

  if (fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, content);
    res.end("ok");
  } else {
    res.status(404).send("This post does not exist!");
  }
});

app.delete("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const filepath = `${postsDir}/${title}`;

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.end("ok");
  } else {
    res.status(404).send("This post does not exist!");
  }
});

app.get("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const filepath = `${postsDir}/${title}`;

  if (fs.existsSync(filepath)) {
    const post = fs.readFileSync(filepath, "utf8");
    res.send(post);
  } else {
    res.status(404).send("This post does not exist!");
  }
});

app.get("/blogs", (req, res) => {
  const posts = fs.readdirSync(postsDir);
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
