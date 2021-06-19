const express = require("express");
const router = express.Router();

const TodoController = require("../controllers/todos");
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, TodoController.createTodo);

router.get("", checkAuth, TodoController.getTodos);

router.get("/:id", checkAuth, TodoController.getTodo);

router.patch("/:id", checkAuth, TodoController.updateTodo);

router.delete("", checkAuth, TodoController.deleteTodos);

router.delete("/:id", checkAuth, TodoController.deleteTodo);

module.exports = router;
