
const dbm = require("../../models/database.js")
const issueStatus = require("../../components/issues/status.js")
const issueOpener = require("../../components/issues/opener.js")
const issuePriority = require("../../components/issues/priority.js")
const credentials = require("../../components/credentials/credentials.js")

/**
 * Query all unread and prioritiesed items from DB and insert them into the list
 */
function initLoadItems() {
  dbm.getIssuesFromDB(function (err, row) {
    insertNewItem(row.key, row.summary, row.assignee, row.read, row.priority)
  });
}

/**
 * update the issue list with all new issues from the jira API
 * @param {*} offset startAt parameter for jira API
 */
function updateList(offset = 0) {
  if (!credentials.getUsername() || !credentials.getServerurl()) {
    return
  }

  const Http = new XMLHttpRequest();
  const url = `https://${credentials.getServerurl()}/rest/api/2/search?startAt=${offset}&jql=(updated >%3D -7d OR created >%3D -7d) AND (watcher %3D currentUser() OR assignee %3D currentUser() OR reporter %3D currentUser() OR comment ~ currentUser()) ORDER BY updated DESC %2C key DESC&fields=comment&fields=reporter&fields=updated&fields=lastViewed&fields=assignee&fields=summary`;
  Http.open("GET", url);
  credentials.getPassword().then(function (password) {
    Http.setRequestHeader("Authorization", "Basic " + btoa(credentials.getUsername() + ":" + password))
    Http.send();
  }.bind(this))

  //Fetch JSON with new tickets
  Http.onreadystatechange = (e) => {
    window.notificationCount = 0 //TODO: change it to none global variable
    if (Http.readyState === XMLHttpRequest.DONE) {
      if (Http.status === 0 || (Http.status >= 200 && Http.status < 400)) {
        JSON.parse(Http.response).issues.forEach(element => {
          dbm.getIssueFromDB(element, updateIssue)
        })
        let response = JSON.parse(Http.response)
        if (response.total > (offset + response.maxResults)) {
          updateList((offset + response.maxResults))
        }
      } else {
        console.log(Http.responseText);
      }
    }
  }
}

/**
 * Update a single issue with data from the DB
 * @param {*} err Error
 * @param {*} row Database Row
 * @param {*} elem DOM element
 */
function updateIssue(err, row, elem) {
  console.log(`updating issue ${elem.key}`)
  let updated = Date.parse(elem.fields.updated)
  let viewed = Date.parse(elem.fields.lastViewed)
  if (Number.isNaN(viewed)) { viewed = 0 }

  let assignee_emailAddress
  let updatedOnlyByMe = updatedOnlyByMeSince(elem.fields.comment.comments, credentials.getUsername(), viewed, elem.fields.reporter.name)

  try {
    assignee_emailAddress = elem.fields.assignee.emailAddress
  } catch {
    let assignee_emailAddress = elem.fields.assignee
  }

  if (row == undefined && updatedOnlyByMe == false || (row?.last_updated < updated && viewed < updated && updatedOnlyByMe == false)) {
    dbm.updateIssueInDB(elem.key, elem.fields.summary, assignee_emailAddress, updated)
    window.notificationCount++
    if (window.notificationCount < 5) {
      let myNotification = new Notification('JIRA Issue changed', {
        body: elem.key + " " + elem.fields.summary
      })
    }
    if (document.getElementById(elem.key) != null) {
      document.getElementById(elem.key).classList.add("unread")
    } else {

      console.log(elem?.fields?.assignee?.emailAddress)

      insertNewItem(elem.key, elem.fields.summary, elem?.fields?.assignee?.emailAddress)
    }

    if (assignee_emailAddress == credentials.getUsername()) {
      document.getElementById(elem.key).classList.add("assigned-to-me")
    }
  }

}


/**
 * Updated only by me since the given DateTime or only created by me and no reporters
 * @param {} comments Array containing the comments
 * @param {} username Username to compare with
 * @param {} viewed Date since there needs t be an update
 */
function updatedOnlyByMeSince(comments, username, viewed, reporter) {
  var return_value = true
  comments.forEach(comment => {
    if (comment.updateAuthor.name != username && Date.parse(comment.updated) > viewed) {
      return_value = false
    }
  })
  if (comments.length == 0 && reporter != username) { return_value = false }
  return return_value
}



/**
 * Insert a new item to the issue list in jino
 * @param {*} key jira issue key
 * @param {*} summary jira issue summary
 * @param {*} read read state ot the issue within jino
 * @param {*} priority priority of the issue within jino
 * @param {*} assignee_emailAddress jira assignee
 */
function insertNewItem(key, summary, assignee_emailAddress = null, read = 0, priority) {
  var item = document.createElement("li");

  item.id = key;
  item.key = key;
  let span = new Object()

  span.read = document.createElement("span");
  span.read.classList.add("read");
  span.read.addEventListener('click', issueStatus.setItemAsRead)

  span.content = document.createElement("span");
  span.content.classList.add("content");
  span.content.addEventListener('click', issueOpener.openItemInBrowser)
  span.content.addEventListener('contextmenu', issuePriority.raisePriority)

  span.key = document.createElement("span");
  span.key.classList.add("key");
  span.key.textContent = key;

  span.summary = document.createElement("span");
  span.summary.classList.add("summary");
  span.summary.textContent = summary;

  if (read == 0) {
    item.classList.add("unread")
  }
  if (assignee_emailAddress == credentials.getUsername()) {
    item.classList.add("assigned-to-me")
  }
  item.classList.add("priority-" + document.priorities[priority])
  item.appendChild(span.read)
  span.content.appendChild(span.key)
  span.content.appendChild(span.summary)
  item.appendChild(span.content)

  document.getElementById("database").appendChild(item);
}

module.exports = {
  initLoadItems: initLoadItems,
  updateList: updateList,
  updateIssue: updateIssue,
  updatedOnlyByMeSince: updatedOnlyByMeSince,
  insertNewItem: insertNewItem
}