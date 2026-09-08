
/**
 * Individual setting for the application.
 */
class Setting {

    /**
     * Constructor.
     * 
     * @param {number} id 
     * @param {string} name 
     * @param {string} phrase Phrase key with value defined depending on translations
     * @param {any} value 
     */
    constructor(id, name, phrase, value) {
        this.id = id;
        this.name = name;
        this.phrase = phrase;
        this.value = value;
    }

    /**
     * Get a deep copy of the current setting.
     * 
     * @returns {Settings} Returns deep copy.
     */
    clone() {
        var setting = new Setting();
        setting.id = this.id;
        setting.name = this.name;
        setting.phrase = this.phrase;
        setting.value = this.value;

        return setting;
    }

    update(value) {
        this.value = value;

        return this;
    }
}

/**
 * All settings for the application.
 */
class Settings {

    /**
     * Constructor.
     */
    constructor() {
        this.language = new Setting(1, 'language', 'models.Settings.language', navigator.language);
        this.lastUpdate = new Setting(2, 'lastUpdate', 'models.Settings.lastUpdate', new Date());
    }

    /**
     * Get a deep copy of the current settings.
     * 
     * @returns {Settings} Returns deep copy.
     */
    clone() {
        var settings = new Settings();
        settings.language = this.language.clone();
        settings.lastUpdate = this.lastUpdate.clone();

        return settings;
    }

    update(setting, value) {
        if (setting in this) {
            this[setting] = this[setting].update(value);
        }

        return this;
    }

}


export default Settings;