import { openDatabase, STORES } from '../backend/database.js';


async function getOrganizers() {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.ORGANIZERS, 'readonly');
        const index = transaction.objectStore(STORES.ORGANIZERS).index('name');
        const request = index.getAll();

        request.onsuccess = function() {
            const organizers = request.result;

            organizers.sort(function(a, b) {
                return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
            });

            resolve(organizers);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getOrganizerById(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.ORGANIZERS, 'readonly');
        const store = transaction.objectStore(STORES.ORGANIZERS);
        const request = store.get(id);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getOrganizerByName(name) {
    const organizers = await getOrganizers();

    return organizers.find(function(organizer) {
        return organizer.name === name;
    });
}


async function createOrganizer({ name, description = '' }) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.ORGANIZERS, 'readwrite');
        const store = transaction.objectStore(STORES.ORGANIZERS);

        const organizer = {
            name,
            description
        };

        const request = store.add(organizer);

        request.onsuccess = function() {
            resolve({
                id: request.result,
                ...organizer
            });
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function updateOrganizer(id, { name, description = '' }) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.ORGANIZERS, 'readwrite');
        const store = transaction.objectStore(STORES.ORGANIZERS);

        const organizer = {
            id,
            name,
            description
        };

        const request = store.put(organizer);

        request.onsuccess = function() {
            resolve(organizer);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function deleteOrganizer(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.ORGANIZERS, 'readwrite');
        const store = transaction.objectStore(STORES.ORGANIZERS);
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
    getOrganizers,
    getOrganizerById,
    getOrganizerByName,
    createOrganizer,
    updateOrganizer,
    deleteOrganizer
};