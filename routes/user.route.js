const express = require('express')
const { authorize } = require(`../controllers/auth.controller`)
let { validateUser } = require('../middlewares/user_validation')
const userController = require('../controllers/user.controller')
const app = express()
app.use(express.json())

// Endpoint add user
app.post('/',[validateUser],[authorize], userController.addUser)
app.put("/:id",[validateUser],[authorize], userController.updateUser)
app.get("/:id",[authorize], userController.getUserId)
app.get("/",[authorize], userController.getAllUser)
app.delete("/:id",[authorize], userController.deleteUser)

module.exports = app
