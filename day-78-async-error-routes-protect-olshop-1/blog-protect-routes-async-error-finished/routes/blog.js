const express = require("express");

const blogControllers = require("../controllers/post-controller");

const guardRoute = require("../middlewares/auth-protection-middleware");

const router = express.Router();

router.get("/", blogControllers.getHome);

// every req from this line will get auth check (the order is important)
router.use(guardRoute)

router.get("/admin", blogControllers.getAdmin);

router.post("/posts", blogControllers.createPost);

router.get("/posts/:id/edit", blogControllers.getSinglePost);

router.post("/posts/:id/edit", blogControllers.updatePost);

router.post("/posts/:id/delete", blogControllers.deletePost);

module.exports = router;
