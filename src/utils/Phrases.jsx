import enJSON from '../assets/phrases/en.json';
import esJSON from '../assets/phrases/es.json';


/**
 * Util functions to get phrases depending on preferred language.
 */
class Phrases {

    // Available languages
    static TRANSLATIONS = {
        'en': enJSON,
        'es': esJSON
    };

    // Default language
    static DEFAULT_LANG = 'es';

    /**
     * Constructor.
     */
    constructor() {
        var parts = navigator.language.split('-');

        // Get preferred language
        this.lang = Phrases.DEFAULT_LANG;
        if (parts.length > 0) {
            // this.lang = parts[0];
        }

        // Get preferred region
        this.region = null;
        if (parts.length > 1) {
            this.region = parts[1];
        }

        // Get translations according to preferred language
        this.translations = Phrases.TRANSLATIONS[this.lang];
    }

    /**
     * Get translation for phrase key.
     * 
     * @param {string} keyPath Key for retrieving phrase from backend.
     * @param {object} values Map of values to apply string interpolation.
     * @returns {string} Translated phrase (if defined)
     */
    get(keyPath, values = {}) {
        // Extract text from corresponding translation
        var text = keyPath.split('.').reduce(
            (obj, key) => {
                return obj && obj[key] !== undefined ? obj[key] : keyPath;
            },
            this.translations
        );

        // Apply arguments as string interpolation if passed in the form of {{someValue}}
        if (typeof text === 'string' && values) {
            text = text.replace(/{{\s*(\w+)\s*}}/g, (match, p1) => {
                return values[p1] !== undefined ? values[p1] : match;
            });
        }

        return text;
    }

}

// Single instance
const phrases = new Phrases();

export default phrases;
