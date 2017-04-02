/**
 * @module character
 */

class Character {
    constructor(type, key, value) {
        this.type = type;
        this.key = key;
        this.value = value;
    }
    /**
     * Return true if this is key-value control character.
     */
    isKeyValue() {
        return this.type === 'keyValue';
    }
    /**
     * Return true if this is hyperlink control character.
     */
    isHyperlink() {
        return this.type === 'hyperlink';
    }
}

module.exports = Character;