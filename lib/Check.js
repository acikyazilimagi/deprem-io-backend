class Check {
    constructor() {

    }

    isPhoneNumber(text) {
        return /^((?:\+[0-9][-\s]?)?\(?0?[0-9]{3}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2})$/.test(text);
    }
}

module.exports = Check;