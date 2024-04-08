

class DatabaseModel {
    constructor() {
        const userdata = ipcRenderer.sendSync("userDataChannel")
        var sqlite3 = require('sqlite3').verbose();
        this.db = new sqlite3.Database(userdata + '/jino.db');

        // const issuesList = require("../components/issues/list.js")

    }
    /**
     * initialize database tables
     */
    initDB() {
        this.db.serialize(function () {
            this.db.run("CREATE TABLE issues (\
                    key VARCHAR(50) NOT NULL PRIMARY KEY,\
                    summary VARCHAR(500),\
                    last_updated DATETIME,\
                    read BOOLEAN DEFAULT 0,\
                    assignee VARCHAR(50)\
                    )"
                , function (error) {
                    if (error) { console.log("Table already exists") }
                });
            this.db.run("ALTER TABLE issues ADD priority INT"
                , function (error) {
                    if (error) { console.log("Table already exists") }
                }) //for legacy support as alter statement
        }.bind(this));
    }

    /**
     * Change the priority of an issue in DB
     * @param {*} new_index new priority
     * @param {*} key jira issue key
     */
    raisePriorityInDB(new_index, key) {
        this.db.run("UPDATE issues SET priority=? WHERE key=?", [new_index, key])
    }

    changeIssueStatusInDB(status, key) {
        this.db.run("UPDATE issues SET read=? WHERE key=?", [status, key])
    }

    /**
     * set issue to read in DB
     * @param {*} key jira issue key
     */
    setIssueReadInDB(key) {
        this.db.run("UPDATE issues SET read=1 WHERE key=?", key)
    }

    /**
     * update an issue in the DB
     * @param {*} key jira issue key
     * @param {*} summary jira issue summary
     * @param {*} assignee_name jira issue asignee (e-mail)
     * @param {*} updated jira issue update date
     */
    updateIssueInDB(key, summary, assignee_name, updated) {
        this.db.run("REPLACE INTO issues (key, summary, assignee, last_updated) VALUES (?, ?, ?, ?)", [key, summary, assignee_name, updated]);
    }

    /**
     * get the jira issues from the db and pass the element object to the callback function
     * @param {*} element DOM element
     * @param {*} callback function to handle the response
     */
    getIssueFromDB(element, callback) {
        this.db.get("SELECT * FROM issues WHERE key='?'", element.key, function(err, row) {
            // if(row != undefined) {
                callback(err, row, element)
            // }
        }.bind(this));
    }

    /**
     * get all relevant jira issues from the DB defined by
     * datetime
     * read status
     * @param {*} callback function to handle the response
     */
    getIssuesFromDB(callback) {
        this.db.each("SELECT * FROM issues WHERE last_updated > (strftime('%s', 'now')-60*60*24*1)*1000 OR read is False OR priority is not null ORDER BY read ASC, last_updated DESC", callback)
    }
}

module.exports = new DatabaseModel(); //Exports always the same instance, so it can be used in multiple modules