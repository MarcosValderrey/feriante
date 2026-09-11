import { openDatabase, STORES } from '../backend/database.js';


async function getWorkdays() {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readonly');
        const store = transaction.objectStore(STORES.WORKDAYS);
        const index = store.index('date');
        const request = index.openCursor(null, 'prev');
        const workdays = [];

        request.onsuccess = function() {
            const cursor = request.result;

            if (!cursor) {
                resolve(workdays);
                return;
            }

            workdays.push(cursor.value);
            cursor.continue();
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getWorkdaysByOrganizerId(organizerId) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readonly');
        const index = transaction.objectStore(STORES.WORKDAYS).index('organizerId');
        const request = index.getAll(organizerId);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getOldestWorkdays(limit = 5) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readonly');
        const index = transaction.objectStore(STORES.WORKDAYS).index('date');
        const request = index.openCursor(null, 'next');
        const workdays = [];

        request.onsuccess = function(event) {
            const cursor = event.target.result;

            if (!cursor || workdays.length >= limit) {
                resolve(workdays);
                return;
            }

            workdays.push(cursor.value);
            cursor.continue();
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getRecentWorkdays(limit = 5) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readonly');
        const index = transaction.objectStore(STORES.WORKDAYS).index('date');
        const request = index.openCursor(null, 'prev');
        const workdays = [];

        request.onsuccess = function(event) {
            const cursor = event.target.result;

            if (!cursor || workdays.length >= limit) {
                resolve(workdays);
                return;
            }

            workdays.push(cursor.value);
            cursor.continue();
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getWorkdayById(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readonly');
        const store = transaction.objectStore(STORES.WORKDAYS);
        const request = store.get(id);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function createWorkday({
    organizerId,
    date,
    description = ""
}) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readwrite');
        const store = transaction.objectStore(STORES.WORKDAYS);

        const workday = {
            organizerId,
            date,
            description
        };

        const request = store.add(workday);

        request.onsuccess = function() {
            resolve({
                id: request.result,
                ...workday
            });
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function updateWorkday(id, {
    organizerId,
    date,
    description = ""
}) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readwrite');
        const store = transaction.objectStore(STORES.WORKDAYS);

        const workday = {
            id,
            organizerId,
            date,
            description
        };

        const request = store.put(workday);

        request.onsuccess = function() {
            resolve(workday);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function deleteWorkday(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.WORKDAYS, 'readwrite');
        const store = transaction.objectStore(STORES.WORKDAYS);
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
    getWorkdays,
    getWorkdaysByOrganizerId,
    getOldestWorkdays,
    getRecentWorkdays,
    getWorkdayById,
    createWorkday,
    updateWorkday,
    deleteWorkday
};