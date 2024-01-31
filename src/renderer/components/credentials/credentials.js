

class Credentials {
    constructor() {
        this.keytar = require('keytar');
    }

    /**
     * get the username of the current user from local store
     * @returns jira username (e-mail)
     */
    getUsername() {
        return localStorage.getItem("username")
    }

    /**
     * set the username of the current user in local store
     * @param {*} username jira username (e-mail)
     */
    setUsername(username) {
        localStorage.setItem("username", username)
    }

    /**
     * get the password of the current user from keytar store,
     * write it to class variable and return it
     * @returns jira password
     */
    async getPassword() {
        if (!this.password) {
            this.password = await this.keytar.getPassword("Jino", localStorage.getItem("username"))
        }
        return this.password
    }

    /**
     * get the password of the current user in keytar store
     * @param {*} password jira password
     */
    setPassword(password) {
        this.password = password
        this.keytar.setPassword("Jino", this.getUsername(), password)
    }

    /**
     * get the server url of the current user from the local store
     * @returns server url for jira instance
     */
    getServerurl() {
        return localStorage.getItem("serverurl")
    }

    /**
     * set the server url of the current user in the local store
     * @param {*} serverurl jira server url
     */
    setServerurl(serverurl) {
        localStorage.setItem("serverurl", serverurl)
    }

    /**
     * clear the credentials from the local store if login fails
     */
    clearCredentials() {
        this.keytar.deletePassword("Jino", this.getUsername())
        localStorage.removeItem("serverurl")
        localStorage.removeItem("username")
    }
}

module.exports = new Credentials()