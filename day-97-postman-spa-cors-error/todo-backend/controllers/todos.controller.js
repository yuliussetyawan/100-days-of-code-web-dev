const { text } = require("express");
const Todo = require("../models/todo.model");

async function getAllTodos(req, res, next) {
  let todos;
  try {
    todos = await Todo.getAllTodos();
  } catch (error) {
    return next(error);
  }

  res.json({
    todos: todos,
  });
}

async function addTodo(req, res, next) {
  const todoText = req.body.text;
  const todo = new Todo(todoText);

  let insertedId;
  try {
    const result = await todo.save();
    insertedId = result.insertedId;
  } catch (error) {
    return next(error);
  }

  todo.id = insertedId.toString();
  res.json({ message: "Added todo successfully!", createdTodo: todo });
}

async function findTodoById(req, res, next) {
  const todoid = req.params.id;
  let result;
  try {
    result = await Todo.findById(todoid);
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Todolist found", findTodo: result });
}

async function updateTodo(req, res, next) {
  const todoid = req.params.id;
  const newTodoText = req.body.newText;
  const todo = new Todo(newTodoText, todoid);
  try {
    await todo.save();
  } catch (error) {
    return next(error);
  }
  res.json({ message: "Todo updated", updateTodo: todo });
}

async function deleteTodo(req, res, next) {
  const todoid = req.params.id;
  const todo = new Todo(null, todoid);
  let todoDeletedText;
  try {
    const findTodo = await Todo.findById(todoid);
    todoDeletedText = findTodo.text;
    await todo.delete();
  } catch (error) {
    return next(error);
  }
  res.json({ message: "Todo deleted", deleteTodo: todoDeletedText });
}

module.exports = {
  getAllTodos: getAllTodos,
  addTodo: addTodo,
  findTodoById: findTodoById,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo,
};
