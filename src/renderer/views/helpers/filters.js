
/**
 * toggle display of items
 * @param {*} button 
 * @param {*} listToToggle 
 */
function toggleDisplay(button, listToToggle) {
  var allFilters = ["", "unread", "assigned-to-me", "priority-high", "priority-medium", "priority-low"]

  if (!event.target.closest("span").classList.contains("on")) {
    //hide all items
    allFilters.forEach(filter => {
      if (filter != "") { filter = "." + filter }
      Array.from(document.styleSheets[0].cssRules).filter(element => element.selectorText == "li" + filter)[0].style.setProperty("display", "none")
    })

    //show selected items
    listToToggle.forEach(toggleSelector => {
      Array.from(document.styleSheets[0].cssRules).filter(element => element.selectorText == "li." + toggleSelector)[0].style.setProperty("display", "block", "important")

    })

    //deactivate other menu entries
    Array.from(document.getElementsByClassName("button")).forEach(buttonToDeactivate => {
      buttonToDeactivate.classList.remove("on")
    })

    document.getElementById(button).classList.add("on")
  } else {
    //show all items
    allFilters.forEach(filter => {
      if (filter != "") { filter = "." + filter }
      Array.from(document.styleSheets[0].cssRules).filter(element => element.selectorText == "li" + filter)[0].style.setProperty("display", "block", "important")
    })
    document.getElementById(button).classList.remove("on")
  }
}

/**
* hide an item identified by it's key
* @param {*} key 
*/
function hideItem(key) {
  if (!document.getElementById(key).classList.contains("unread")) {
    document.getElementById(key).style.removeProperty("display")
  }
}

/**
* filter issues by project key prefix
* @param {*} event 
* @param {*} target 
*/
function filterIssues(event, target = null) {
  if (target == null) {
    target = event.target
  }
  var issueList = Array.from(document.getElementById("database").children)
  issueList.forEach(element => element.style.removeProperty("display"));
  issueList.filter(child => child.id.indexOf(target.value.toUpperCase()) == -1).forEach(element => element.style.setProperty("display", "none", "important"));
}

module.exports = {
  filterIssues: filterIssues,
  hideItem: hideItem,
  toggleDisplay: toggleDisplay
} 