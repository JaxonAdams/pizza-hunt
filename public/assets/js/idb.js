// Create variable to hold db connection
let db;
// Establish a connection to the IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// This event will fire if the version changes
request.onupgradeneeded = function(event) {
    // Save a reference to the database
    const db = event.target.result;

    // Create an object store called 'new_pizza' and set it to have an auto incrementing key
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function(event) {
    // When connection is successful, save reference to db in global variable
    db = event.target.result;

    // Check if app is online, if yes run uploadPizza() to send all local db data to api
    if (navigator.online) {
        // uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// This function will execute when the user attempts to submit a pizza with no internet connection
function saveRecord(record) {
    // Open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // Access object store for new_pizza
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // Add pizza to store with add method
    pizzaObjectStore.add(record);
};