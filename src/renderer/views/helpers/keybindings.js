
const filters = require("../../views/helpers/filters.js")


/**
 * initialize keybindings
 */
function initKeybindings() {
  //Set event listeners for controlbar

  document.getElementById("btn-hide-read").addEventListener('click', function (event) { filters.toggleDisplay("btn-hide-read", ["unread"]) })
  document.getElementById("btn-only-assigned-to-me").addEventListener('click', function (event) { filters.toggleDisplay("btn-only-assigned-to-me", ["assigned-to-me"]) })
  document.getElementById("btn-priority-greater-equal-high").addEventListener('click', function (event) { filters.toggleDisplay("btn-priority-greater-equal-high", ["priority-high"]) })
  document.getElementById("btn-priority-greater-equal-medium").addEventListener('click', function (event) { filters.toggleDisplay("btn-priority-greater-equal-medium", ["priority-high", "priority-medium"]) })
  document.getElementById("btn-priority-greater-equal-low").addEventListener('click', function (event) { filters.toggleDisplay("btn-priority-greater-equal-low", ["priority-high", "priority-medium", "priority-low"]) })

  document.getElementById("filter-input").addEventListener("input", filters.filterIssues)

  document.addEventListener("keydown", () => {
    if ((event.ctrlKey || event.metaKey) && event.key == "f") {
      document.getElementById("filterbar").style.display = "block"
      document.getElementById("database").classList.add("shiftForFilterBar")
      document.getElementById("filter-input").focus()
    }
    if (event.keyCode == 27) { //Escape
      document.getElementById("filterbar").style.display = "none"
      document.getElementById("database").classList.remove("shiftForFilterBar")
      document.getElementById("filter-input").value = ""
      filters.filterIssues(target = document.getElementById("filter-input"))
    }
  })
}

module.exports = { initKeybindings: initKeybindings }
