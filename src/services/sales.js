import { openDatabase, STORES } from '../backend/database.js';


async function getSales() {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.SALES, 'readonly');
        const store = transaction.objectStore(STORES.SALES);
        const request = store.getAll();

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getSaleById(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.SALES, 'readonly');
        const store = transaction.objectStore(STORES.SALES);
        const request = store.get(id);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getSalesByWorkdayId(workdayId) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.SALES, 'readonly');
        const index = transaction.objectStore(STORES.SALES).index('workdayId');
        const request = index.getAll(workdayId);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function createSale({
    workdayId,
    productId,
    quantity,
    totalPrice,
    note = ""
}) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.SALES, 'readwrite');
        const store = transaction.objectStore(STORES.SALES);

        const sale = {
            workdayId,
            productId,
            quantity,
            totalPrice,
            note
        };

        const request = store.add(sale);

        request.onsuccess = function() {
            resolve({
                id: request.result,
                ...sale
            });
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function updateSale(id, {
    workdayId,
    productId,
    quantity,
    totalPrice,
    note = ""
}) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.SALES, 'readwrite');
        const store = transaction.objectStore(STORES.SALES);

        const sale = {
            id,
            workdayId,
            productId,
            quantity,
            totalPrice,
            note
        };

        const request = store.put(sale);

        request.onsuccess = function() {
            resolve(sale);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function deleteSale(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.SALES, 'readwrite');
        const store = transaction.objectStore(STORES.SALES);
        const request = store.delete(id);

        request.onsuccess = function() {
            resolve();
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


export {
    getSales,
    getSaleById,
    getSalesByWorkdayId,
    createSale,
    updateSale,
    deleteSale
};