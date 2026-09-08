
/**
 * Util functions for date formatting.
 */
class Formats {

    /**
     * Format date as a local string date.
     * 
     * @param {*} value Value to format.
     * @returns 
     */
    static asDate(value) {
        return value.toLocaleDateString('es-AR');
    };

    /**
     * Format a value as money.
     * 
     * @param {number} value Value to format.
     * @returns {string}
     */
    static asMoney(value) {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        const numberPart = Number(value).toLocaleString('es-AR', options);
        const result = `$ ${numberPart}`;

        return result;
    };

    /**
     * Format organizer in one sentence.
     * 
     * @param {*} organizer 
     */
    static asOrganizer(organizer) {
        var result = organizer?.name;

        if (organizer?.name === '?') {
            result = organizer?.description;
        }

        return result;
    }

    /**
     * Format workday in one sentence.
     * 
     * @param {*} workday 
     * @returns 
     */
    static asWorkday(workday) {
        const date = Formats.asDate(workday.date);
        var organizer = workday.organizerName;

        if (organizer === '?') {
            organizer = workday?.organizerDescription;
        }

        if (workday.description) {
            return `${date} · ${organizer} · ${workday.description}`;
        }

        return `${date} · ${organizer}`;
    }

}


export default Formats;