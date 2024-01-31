
const issuesList = require("../issues/list.js")
const credentials = require("../credentials/credentials.js")

/**
 * initialize login screen and read values from loca storage
 */
function initLoginScreen() {
  document.getElementsByTagName("form")[0].addEventListener("submit", login)
  document.getElementsByTagName("a")[0].addEventListener("click", openLinkExternally)
  if (credentials.getUsername()) {
    document.getElementsByName("serverurl")[0].value = credentials.getServerurl()
    document.getElementsByName("username")[0].value = credentials.getUsername()
    credentials.getPassword().then(password => {
      document.getElementsByName("password")[0].value = password
    })
  }
}

/**
 * open the link to the token in the system browser
 * @param {*} event 
 */
function openLinkExternally(event) {
  event.preventDefault()
  ipcRenderer.send("openLinkChannel", event.target.href)
}

/**
 * read login data and call checkConnection() to make sure the connection works
 * @param {*} event 
 */
function login(event) {

  event.preventDefault()
  event.stopPropagation()

  credentials.setServerurl(document.getElementsByName("serverurl")[0].value)
  credentials.setUsername(document.getElementsByName("username")[0].value)
  credentials.setPassword(document.getElementsByName("password")[0].value)

  checkConnection()

}
/**
 * Check if the connection with the given credetials works
 * if it dows, call loginSuccess() to store the credentials
 */
function checkConnection() {

  const Http = new XMLHttpRequest();
  const url = `https://${credentials.getServerurl()}/rest/api/2/search?jql=(updated >%3D -7d OR created >%3D -7d) AND (watcher %3D currentUser() OR assignee %3D currentUser() OR reporter %3D currentUser() OR comment ~ currentUser()) ORDER BY updated DESC%2C key DESC`;

  Http.open("GET", url);
  credentials.getPassword().then(function (password) {
    document.getElementsByName("password")[0].value = password
    Http.setRequestHeader("Authorization", "Basic " + btoa(credentials.getUsername() + ":" + password))
    Http.send();
  }.bind(this))

  //Fetch JSON with new tickets
  Http.onreadystatechange = function (e) {
    if (Http.readyState == 4) {
      if (Http.status == 200) {
        loginSuccess()
      } else {
        credentials.clearCredentials()
        alert("Login failed")
      }
    }
  }.bind(this)
}

/**
 * Only save variables to local storage if login succeeds
 */
function loginSuccess() {
  document.getElementById("controlbar").style.visibility = "visible"
  document.getElementsByClassName("login")[0].style.display = "none"

  issuesList.initLoadItems()
  issuesList.updateList()
  setInterval(issuesList.updateList.bind(this), 60000) 
}

module.exports = {
  initLoginScreen: initLoginScreen
}