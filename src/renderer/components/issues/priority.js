
/**
 * raise the priority of a item when right clicked on it
 * @returns 
 */
function raisePriority() {
  event.preventDefault();
  let item = event.target.closest("LI")
  let priorities = document.priorities
  var new_index
  var new_priority = priorities[0]
  Array.from(priorities).forEach(function (priority) {
    if (item.classList.contains("priority-" + priority)) {
      let index = priorities.indexOf(priority)
      item.classList.remove("priority-" + priority)
      if (priorities[index + 1] != undefined) {
        new_index = index + 1
        new_priority = priorities[index + 1]
      } else {
        new_priority = priorities[0]
      }
    }
  })
  item.classList.add("priority-" + new_priority)

  dbm.raisePriorityInDB(new_index, item.key)

  return false;
}

module.exports = {
  raisePriority: raisePriority
}
