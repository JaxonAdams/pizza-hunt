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
        uploadPizza();
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

function uploadPizza() {
    // Open transaction in db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // Access object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // Get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // This is run on a successful getAll execution
    getAll.onsuccess = function() {
        // If there was data in the object store, send to api
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getAll.result)
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }

                // Open one more transaction
                const transaction = db.transaction(['new_pizza', 'readwrite']);

                // Access the new_pizza store
                const pizzaObjectStore = transaction.objectStore('new_pizza');

                // Clear all items in store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted.');
            })
            .catch(err => console.log(err));
        }
    };
}

// Listen for app coming back online
window.addEventListener('online', uploadPizza);