import phrases from './Phrases';


/**
 * Util functions to resolve localized links.
 */
class Links {

    // Development
    static getDevelopment() {
        return phrases.get('App.paths.development');
    }

    // Products
    static getProductList() {
        return phrases.get('App.paths.products');
    }

    static getNewProduct() {
        const entity = phrases.get('App.paths.products');
        const action = phrases.get('App.paths.new.male');
        const uri = `${entity}${action}`;

        return uri;
    }

    static getEditProduct(productId) {
        const entity = phrases.get('App.paths.products');
        const action = phrases.get('App.paths.edit');
        const uri = `${entity}/${productId}${action}`;

        return uri;
    }

    // Organizers
    static getOrganizerList() {
        return phrases.get('App.paths.organizers');
    }

    static getNewOrganizer() {
        const entity = phrases.get('App.paths.organizers');
        const action = phrases.get('App.paths.new.male');
        const uri = `${entity}${action}`;

        return uri;
    }

    static getEditOrganizer(organizerId) {
        const entity = phrases.get('App.paths.organizers');
        const action = phrases.get('App.paths.edit');
        const uri = `${entity}/${organizerId}${action}`;

        return uri;
    }

    // Sales
    static getSaleList() {
        return phrases.get('App.paths.sales');
    }

    static getNewSale(workdayId) {
        const workdays = Links.getWorkdayList();
        const sales = Links.getSaleList();
        const newSale = phrases.get('App.paths.new.female');
        const uri = `${workdays}/${workdayId}${sales}${newSale}`;

        return uri;
    }

    static getEditSale(workdayId, saleId) {
        const workdays = Links.getWorkdayList();
        const sales = Links.getSaleList();
        const uri = `${workdays}/${workdayId}${sales}/${saleId}`;

        return uri;
    }

    // Summary
    static getSummary() {
        return phrases.get('App.paths.summary');
    }

    // Workdays
    static getFullWorkday(workdayId) {
        return `${phrases.get('App.paths.workdays')}/${workdayId}`;
    }

    static getWorkdayList() {
        return phrases.get('App.paths.workdays');
    }

    static getNewWorkday() {
        const workdays = Links.getWorkdayList();
        const newWorkday = phrases.get('App.paths.new.female');
        const uri = `${workdays}${newWorkday}`;

        return uri;
    }

    static getEditWorkday(workdayId) {
        const workdays = Links.getWorkdayList();
        const action = phrases.get('App.paths.edit');
        const uri = `${workdays}/${workdayId}${action}`;

        return uri;
    }

}


export default Links;