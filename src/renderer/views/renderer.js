// Global variables
document.priorities = ["none", "high", "medium", "low"]

// Requirements
const { ipcRenderer } = require('electron');
const dbm = require("../models/database.js")
const login = require("../components/login/login.js")
const keybindings = require("../views/helpers/keybindings.js")

keybindings.initKeybindings()
dbm.initDB()
login.initLoginScreen()