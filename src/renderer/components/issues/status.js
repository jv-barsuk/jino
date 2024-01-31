
/**
* set an item as read when clicked on it
*/
function setItemAsRead() {
  let item = event.target.closest("LI")
  let status = item.classList.contains("unread") //status
  changeIssueStatus(item, status)
}





/**
 * change the status of an issue from read to unread or vice versa
 * @param {*} item 
 * @param {*} status 
 */
function changeIssueStatus(item, status) {
  if (!status) {
    item.classList.add("unread")
  } else {
    item.classList.remove("unread")
  }
  dbm.changeIssueStatusInDB(status, item.key)
}

module.exports = {
  setItemAsRead: setItemAsRead,
  changeIssueStatus: changeIssueStatus
}
