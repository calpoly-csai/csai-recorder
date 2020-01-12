class Database {
    /**
     * 
     * @param {String} dbName name of the database
     */
    constructor(dbName) {
       let request =  indexedDB.open(dbName, 3)
       request.onupgradeneeded = this.onUpgradeNeeded
    }

    onUpgradeNeeded() {

    }


}

/**
 * Binds callbacks to class
 * @param self the class to which the functions will be bound
 * @param funcList an Array of class functions to be bound
 */
function bind(self, funcList)