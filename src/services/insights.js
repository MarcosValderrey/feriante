import { getOrganizers } from './organizers.js';
import { getProducts } from './products.js';
import { getSales } from './sales.js';
import { getWorkdays } from './workdays.js';


/**
 * Get consolidated sales summary.
 *
 * @returns {Promise<Object>}
 */
async function getSummary() {
    const [
        sales,
        products,
        workdays,
        organizers
    ] = await Promise.all([
        getSales(),
        getProducts(),
        getWorkdays(),
        getOrganizers()
    ]);

    const productMap = new Map(
        products.map(function(product) {
            return [product.id, product];
        })
    );

    const workdayMap = new Map(
        workdays.map(function(workday) {
            return [workday.id, workday];
        })
    );

    const organizerMap = new Map(
        organizers.map(function(organizer) {
            return [organizer.id, organizer];
        })
    );

    let totalQuantity = 0;
    let totalRevenue = 0;
    let totalProducts = products.length;
    let totalWorkdays = workdays.length;
    let totalOrganizers = organizers.length;
    let oldestWorkday = null;
    let newestWorkday = null;

    const productSalesMap = new Map();
    const organizerSalesMap = new Map();
    const workdaySalesMap = new Map();

    let biggestSale = null;
    let biggestRevenueSale = null;

    let totalSales = sales.length;
    let walletSalesQuantity = 0;
    let walletSalesPercentage = 0.0;
    let cashSalesQuantity = 0;
    let cashSalesPercentage = 0.0;

    for (const sale of sales) {
        const product = productMap.get(sale.productId);
        const workday = workdayMap.get(sale.workdayId);

        if (!product || !workday) {
            continue;
        }

        const organizerId = workday.organizerId;
        const organizer = organizerMap.get(organizerId);

        totalQuantity += sale.quantity;
        totalRevenue += sale.totalPrice;

        /*
         * WHAT — Product
         */
        if (!productSalesMap.has(product.id)) {
            productSalesMap.set(product.id, {
                productId: product.id,
                productName: product.name,
                quantity: 0,
                revenue: 0
            });
        }

        const productSales = productSalesMap.get(product.id);

        productSales.quantity += sale.quantity;
        productSales.revenue += sale.totalPrice;

        /*
         * WHERE — Organizer
         */
        if (!organizerSalesMap.has(organizerId)) {
            organizerSalesMap.set(organizerId, {
                organizerId: organizerId,
                organizerName: organizer?.name ?? 'Organizador eliminado',
                organizerDescription: organizer?.description,
                quantity: 0,
                revenue: 0
            });
        }

        const organizerSales = organizerSalesMap.get(organizerId);

        organizerSales.quantity += sale.quantity;
        organizerSales.revenue += sale.totalPrice;

        /*
         * WHEN — Workday
         */
        if (!workdaySalesMap.has(workday.id)) {
            workdaySalesMap.set(workday.id, {
                workdayId: workday.id,
                date: workday.date,
                description: workday.description,
                organizerId: organizerId,
                organizerName: organizer?.name ?? 'Organizador eliminado',
                organizerDescription: organizer?.description,
                quantity: 0,
                revenue: 0
            });
        }

        const workdaySales = workdaySalesMap.get(workday.id);

        workdaySales.quantity += sale.quantity;
        workdaySales.revenue += sale.totalPrice;

        /*
         * Individual records
         */
        if (
            !biggestSale ||
            sale.quantity > biggestSale.quantity
        ) {
            biggestSale = {
                saleId: sale.id,
                productId: product.id,
                productName: product.name,
                quantity: sale.quantity,
                totalPrice: sale.totalPrice,
                workdayId: workday.id,
                date: workday.date,
                organizerId: organizerId,
                organizerName: organizer?.name ?? 'Organizador eliminado',
                organizerDescription: organizer?.description
            };
        }

        if (
            !biggestRevenueSale ||
            sale.totalPrice > biggestRevenueSale.totalPrice
        ) {
            biggestRevenueSale = {
                saleId: sale.id,
                productId: product.id,
                productName: product.name,
                quantity: sale.quantity,
                totalPrice: sale.totalPrice,
                workdayId: workday.id,
                date: workday.date,
                organizerId: organizerId,
                organizerName: organizer?.name ?? 'Organizador eliminado',
                organizerDescription: organizer?.description
            };
        }

        // Wallet or cash sale?
        if (sale.note?.trim().toUpperCase() === 'MP') {
            walletSalesQuantity++;
        } else {
            cashSalesQuantity++;
        }
    }

    walletSalesPercentage = totalSales ? (walletSalesQuantity / totalSales) * 100.0 : 0.0;
    cashSalesPercentage = totalSales ? (cashSalesQuantity / totalSales) * 100.0 : 0.0;

    // Get oldest and newest workdays
    for (const workday of workdays) {
        if (!oldestWorkday || workday.date < oldestWorkday.date) {
            oldestWorkday = workday;
        }

        if (!newestWorkday || workday.date > newestWorkday.date) {
            newestWorkday = workday;
        }
    }

    const productsByQuantity = [...productSalesMap.values()]
        .sort(function(a, b) {
            return b.quantity - a.quantity;
        });

    const productsByRevenue = [...productSalesMap.values()]
        .sort(function(a, b) {
            return b.revenue - a.revenue;
        });

    const organizersByQuantity = [...organizerSalesMap.values()]
        .sort(function(a, b) {
            return b.quantity - a.quantity;
        });

    const organizersByRevenue = [...organizerSalesMap.values()]
        .sort(function(a, b) {
            return b.revenue - a.revenue;
        });

    const workdaysByQuantity = [...workdaySalesMap.values()]
        .sort(function(a, b) {
            return b.quantity - a.quantity;
        });

    const workdaysByRevenue = [...workdaySalesMap.values()]
        .sort(function(a, b) {
            return b.revenue - a.revenue;
        });

    return {
        totalQuantity,
        totalRevenue,
        totalProducts,
        totalWorkdays,
        totalOrganizers,

        totalSales,
        cashSalesQuantity,
        cashSalesPercentage,
        walletSalesQuantity,
        walletSalesPercentage,

        oldestWorkday,
        newestWorkday,

        productsByQuantity,
        productsByRevenue,

        organizersByQuantity,
        organizersByRevenue,

        workdaysByQuantity,
        workdaysByRevenue,

        biggestSale,
        biggestRevenueSale
    };
}


export {
    getSummary
};