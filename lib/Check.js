class Check {
    constructor() {

    }

    isPhoneNumber(text) {
        return /^((?:\+[0-9][-\s]?)?\(?0?[0-9]{3}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2})$/.test(text);
    }
    hideEmailCharacters(email) {

    const emailParts = email.split("@");
    const username = emailParts[0];
    const domain = emailParts[1].split("."); 
    const hiddenUsername = username.slice(0, 1) + username.slice(1).replace(/./g, "*");
    const hiddenDomain=domain[0].slice(0, 1) + username.slice(1).replace(/./g, "*");
    const hiddenEx=domain[1].slice(0, 1) + username.slice(1).replace(/./g, "*");
    const hiddenEmail = `${hiddenUsername}@${hiddenDomain}.${hiddenEx}`; 
    return hiddenEmail;
    }
}

module.exports = Check;