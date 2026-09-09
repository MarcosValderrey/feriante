
/**
 * Util functions for display formatting.
 */
class Formats {

    static asDate(value) {
        return value.toLocaleDateString('es-AR');
    };

    static asMoney(value) {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        const numberPart = Number(value).toLocaleString('es-AR', options);
        const result = `$ ${numberPart}`;

        return result;
    };

    static asPercentage(value) {
        return `${value.toFixed(0)} %`;
    }

    static asOrganizer(organizer) {
        var result = organizer?.name;

        if (organizer?.name === '?') {
            result = organizer?.description;
        }

        return result;
    }

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