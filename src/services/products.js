import { openDatabase, STORES } from '../backend/database.js';


async function getProducts() {
    const db = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = db.transaction(STORES.PRODUCTS, 'readonly');
        const index = transaction.objectStore(STORES.PRODUCTS).index('name');
        const request = index.getAll();

        request.onsuccess = function() {
            const products = request.result;

            products.sort(function(a, b) {
                return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
            });

            resolve(products);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getProductById(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.PRODUCTS, 'readonly');
        const store = transaction.objectStore(STORES.PRODUCTS);
        const request = store.get(id);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function getProductByName(name) {
    const products = await getProducts();

    return products.find(function(product) {
        return product.name === name;
    });
}


async function createProduct({ name, description = null, image = null }) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.PRODUCTS, 'readwrite');
        const store = transaction.objectStore(STORES.PRODUCTS);

        const product = {
            name,
            description,
            image
        };

        const request = store.add(product);

        request.onsuccess = function() {
            resolve({
                id: request.result,
                ...product
            });
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function updateProduct(id, { name, description = null, image = null }) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.PRODUCTS, 'readwrite');
        const store = transaction.objectStore(STORES.PRODUCTS);

        const product = {
            id,
            name,
            description,
            image,
        };

        const request = store.put(product);

        request.onsuccess = function() {
            resolve(product);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function deleteProduct(id) {
    const database = await openDatabase();

    return new Promise(function(resolve, reject) {
        const transaction = database.transaction(STORES.PRODUCTS, 'readwrite');
        const store = transaction.objectStore(STORES.PRODUCTS);
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
    getProducts,
    getProductById,
    getProductByName,
    createProduct,
    updateProduct,
    deleteProduct
};