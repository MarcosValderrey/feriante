const DATABASE_NAME = 'feriante';
const DATABASE_VERSION = 1;

const STORES = {
    PRODUCTS: 'products',
    ORGANIZERS: 'organizers',
    WORKDAYS: 'workdays',
    SALES: 'sales'
};



/**
 * Open database connection.
 * 
 * @returns 
 */
function openDatabase() {
    return new Promise(function(resolve, reject) {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onupgradeneeded = function(event) {
            const database = event.target.result;

            createStores(database);
        };

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


/**
 * Clear application data.
 *
 * @param {IDBDatabase} database
 */
async function clearDatabase(database) {
    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(
            [
                STORES.PRODUCTS,
                STORES.ORGANIZERS,
                STORES.WORKDAYS,
                STORES.SALES
            ],
            'readwrite'
        );

        transaction.objectStore(STORES.PRODUCTS).clear();
        transaction.objectStore(STORES.ORGANIZERS).clear();
        transaction.objectStore(STORES.WORKDAYS).clear();
        transaction.objectStore(STORES.SALES).clear();

        transaction.oncomplete = resolve;

        transaction.onerror = function() {
            reject(transaction.error);
        };
    });
}


/**
 * Create stores in the IndexedDB database.
 * 
 * @param {*} database 
 */
function createStores(database) {
    const products = database.createObjectStore(
        STORES.PRODUCTS,
        {
            keyPath: "id",
            autoIncrement: true
        }
    );

    products.createIndex(
        "name",
        "name",
        { unique: false }
    );

    const organizers = database.createObjectStore(
        STORES.ORGANIZERS,
        {
            keyPath: "id",
            autoIncrement: true
        }
    );

    organizers.createIndex(
        "name",
        "name",
        { unique: false }
    );

    const workdays = database.createObjectStore(
        STORES.WORKDAYS,
        {
            keyPath: "id",
            autoIncrement: true
        }
    );

    workdays.createIndex(
        "organizerId",
        "organizerId",
        { unique: false }
    );

    workdays.createIndex(
        "date",
        "date",
        { unique: false }
    );

    const sales = database.createObjectStore(
        STORES.SALES,
        {
            keyPath: "id",
            autoIncrement: true
        }
    );

    sales.createIndex(
        "workdayId",
        "workdayId",
        { unique: false }
    );

    sales.createIndex(
        "productId",
        "productId",
        { unique: false }
    );
}


export {
    openDatabase,
    clearDatabase,
    STORES
};
