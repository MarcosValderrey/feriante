import { getOrganizerByName, createOrganizer } from '../services/organizers.js';
import { getProductByName, createProduct } from '../services/products.js';
import { createSale } from '../services/sales.js';
import { createWorkday } from '../services/workdays.js';


/**
 * Import production data using human-readable references
 * instead of database identifiers.
 *
 * Products and organizers are resolved by name and created
 * when they don't already exist.
 *
 * Workdays are resolved by organizer + date and created
 * when they don't already exist.
 *
 * Sales are always created as new records.
 *
 * @param {*} data
 * @returns
 */
async function importSemanticData(data) {
    const products = new Map();
    const organizers = new Map();
    const workdays = new Map();

    for (const organizerData of data.organizers ?? []) {
        await getOrCreateOrganizer(organizerData, organizers);
    }

    for (const productData of data.products ?? []) {
        await getOrCreateProduct(productData, products);
    }

    for (const workdayData of data.workdays ?? []) {
        await getOrCreateWorkday(workdayData, organizers, workdays);
    }

    for (const saleData of data.sales ?? []) {
        await importSale(saleData, products, organizers, workdays);
    }
}


/**
 * Get an organizer by name or create it.
 *
 * @param {*} data
 * @param {*} cache
 * @returns
 */
async function getOrCreateOrganizer(data, cache) {
    const name = data.name;

    if (cache.has(name)) {
        return cache.get(name);
    }

    let organizer = await getOrganizerByName(name);

    if (!organizer) {
        organizer = await createOrganizer({
            name,
            description: data.description ?? ''
        });
    }

    cache.set(name, organizer.id);

    return organizer.id;
}


/**
 * Get a product by name or create it.
 *
 * @param {*} data
 * @param {*} cache
 * @returns
 */
async function getOrCreateProduct(data, cache) {
    const name = data.name;

    if (cache.has(name)) {
        return cache.get(name);
    }

    let product = await getProductByName(name);

    if (!product) {
        product = await createProduct({
            name,
            description: data.description ?? null,
            image: data.image ?? null
        });
    }

    cache.set(name, product.id);

    return product.id;
}


/**
 * Get a workday by organizer and date or create it.
 *
 * @param {*} data
 * @param {*} organizerCache
 * @param {*} workdayCache
 * @returns
 */
async function getOrCreateWorkday(
    data,
    organizerCache,
    workdayCache
) {
    const organizerId = await getOrCreateOrganizer(
        {
            name: data.organizer,
            description: data.organizerDescription
        },
        organizerCache
    );

    const key = `${organizerId}|${data.date}`;

    if (workdayCache.has(key)) {
        return workdayCache.get(key);
    }

    /*
     * At this stage we deliberately create the Workday
     * rather than searching the database for an existing
     * one. The import format represents the intended
     * Workday and the cache prevents duplicates within
     * this import.
     */
    const workday = await createWorkday({
        organizerId,
        date: parseDate(data.date),
        description: data.description ?? ''
    });

    workdayCache.set(key, workday.id);

    return workday.id;
}


/**
 * Import a single sale.
 *
 * @param {*} data
 * @param {*} productCache
 * @param {*} organizerCache
 * @param {*} workdayCache
 * @returns
 */
async function importSale(
    data,
    productCache,
    organizerCache,
    workdayCache
) {
    const productId = await getOrCreateProduct(
        {
            name: data.product
        },
        productCache
    );

    const workdayId = await getOrCreateWorkday(
        {
            organizer: data.workday.organizer,
            date: data.workday.date,
            description: data.workday.description
        },
        organizerCache,
        workdayCache
    );

    return createSale({
        workdayId,
        productId,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        note: data.note ?? ''
    });
}


/**
 * Parse a calendar date without introducing a timezone shift.
 *
 * @param {string} value YYYY-MM-DD
 * @returns {Date}
 */
function parseDate(value) {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
}


export {
    importSemanticData
};