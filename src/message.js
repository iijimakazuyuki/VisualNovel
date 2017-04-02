/**
 * @module message
 */
const Character = require('./character.js');

class Message {
    /**
     * @param {string} message
     */
    constructor(message) {
        /**
         * The letters of the message.
         * @type {Character[]}
         */
        this.letters = [];
        let index = 0;
        let controlCharacterRegex = /\${(.*?)}/g
        let keyValueControlCharacterRegex = /(.+?)=(.*?)$/
        let hyperlinkControlCharacterRegex = /\[(.*?)\]\((.*?)\)/
        let resultArray;
        while ((resultArray = controlCharacterRegex.exec(message))) {
            message.slice(index, resultArray.index).split('').forEach(v => {
                let character = new Character(null, null, v);
                this.letters.push(character);
            });
            let keyValueResultArray = keyValueControlCharacterRegex.exec(resultArray[1]);
            if (keyValueResultArray) {
                let character = new Character('keyValue', keyValueResultArray[1], keyValueResultArray[2]);
                this.letters.push(character);
            } else {
                let hyperlinkResultArray = hyperlinkControlCharacterRegex.exec(resultArray[1]);
                if (hyperlinkResultArray) {
                    let character = new Character('hyperlink', hyperlinkResultArray[1], hyperlinkResultArray[2]);
                    this.letters.push(character);
                }
            }
            index = controlCharacterRegex.lastIndex;
        }
        message.slice(index).split('').forEach(v => {
            let character = new Character(null, null, v);
            this.letters.push(character);
        });
    }
}

module.exports = Message;