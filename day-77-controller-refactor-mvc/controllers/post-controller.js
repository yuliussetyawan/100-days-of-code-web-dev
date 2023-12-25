const Post = require("../models/post");
const validationSession = require("../util/validation-session");
const sessionValidation = require("../util/validation-session");
const validation = require("../util/validation");

function getHome(req, res) {
  res.render("welcome");
}

async function getAdmin(req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  // called without instate the object because using statics in models/post.js
  const posts = await Post.fetchAll();

  // move validation session into util
  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: "",
    content: "",
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionErrorData,
  });
}

async function createPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validationSession.flashErrorToSession(
      req,
      {
        message: "Invalid Input - please check your data",
        title: enteredTitle,
        content: enteredContent,
      },
      // the third parameter will be executed after req.session.save() saved
      function () {
        res.redirect("/admin");
      }
    );

    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const post = new Post(enteredTitle, enteredContent);
  await post.save();

  res.redirect("/admin"); 
}

async function getSinglePost(req, res) {
  // only passing the id param
  const post = new Post(null, null, req.params.id);
  await post.fetch();

  // the post now is always exist, so we must check the title and content
  if (!post.title || !post.content) {
    return res.render("404"); // 404.ejs is missing at this point - it will be added later!
  }

  // move it into util (validation session)
  sessionErrorData = sessionValidation.getSessionErrorData(req, {
    title: post.title,
    content: post.content,
  });

  res.render("single-post", {
    post: post,
    inputData: sessionErrorData,
  });
}

async function updatePost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validationSession.flashErrorToSession(
      req,
      {
        message: "Invalid Input - please check your data",
        title: enteredTitle,
        content: enteredContent,
      },
      // the third parameter will be executed after we saved
      function () {
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );
    return;
  }

  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  // just need pass the id param
  const post = new Post(null, null, req.params.id);
  await post.delete();

  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  createPost: createPost,
  getSinglePost: getSinglePost,
  updatePost: updatePost,
  deletePost: deletePost,
};
