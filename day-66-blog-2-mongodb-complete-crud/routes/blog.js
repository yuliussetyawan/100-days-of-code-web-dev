const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const { ObjectId } = mongodb;

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  // {}: The first argument, an empty object, represents the query filter. Since it's an empty object, it matches all documents in the collection.
  //  The second argument, a projection object, specifies which fields to include in the retrieved documents. The 'author.name' is targeting the nested array
  const posts = await db
    .getDb()
    .collection("posts")
    .find({}, { title: 1, summary: 1, "author.name": 1 })
    .toArray();
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  // convert the author data into array first!
  const authors = await db.getDb().collection("authors").find().toArray();
  console.log(authors);
  res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
  const authorId = new ObjectId(req.body.author);
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId });

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: author.name,
      email: author.email,
    },
  };

  const result = await db.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.redirect("/posts");
});

router.get("/posts/:id/", async function (req, res, next) {
  let postId = req.params.id;

  try {
    postId = new ObjectId(postId);
  } catch (err) {
    return res.status(404).render("404");
    // next() will forward default err to error handling
    // return next(err)
  }
  const post = await db
    .getDb()
    .collection("posts")
    // exclude post.summary
    .findOne({ _id: postId }, { summary: 0 });
  if (!post || post.length === 0) {
    return res.status(404).render("404");
  }

  // automatically add new property
  post.humanReadableDate = post.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  post.date = post.date.toISOString();
  res.render("post-detail", { post: post });
});

router.get("/posts/:id/edit", async function (req, res) {
  let postId = req.params.id;
  try {
    postId = new ObjectId(paramId);
  } catch (err) {
    return res.status(404).render("404");
  }
  const post = await db
    .getDb()
    .collection("posts")
    // exclude post.summary
    .findOne({ _id: postId }, { summary: 1, title: 1, body: 1 });
  if (!post || post.length === 0) {
    return res.status(404).render("404");
  }
  res.render("update-post", { post: post });
});

router.post("/posts/:id/edit", async function (req, res) {
  let postId = req.params.id;
  try {
    postId = new ObjectId(paramId);
  } catch (err) {
    return res.status(404).render("404");
  }
  await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          summary: req.body.summary,
          body: req.body.content,
          date: new Date(),
        },
      }
    );
  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  let postId = req.params.id;
  try {
    postId = new ObjectId(paramId);
  } catch (err) {
    return res.status(404).render("404");
  }
  await db.getDb().collection("posts").deleteOne({ _id: postId });
  res.redirect("/posts");
});

module.exports = router;
