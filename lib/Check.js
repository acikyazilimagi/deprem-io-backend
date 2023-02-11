class Check {
  constructor() {}

  isPhoneNumber(text) {
    return /^((?:\+[0-9][-\s]?)?\(?0?[0-9]{3}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2})$/.test(text);
  }

  arePhoneNumbers(phones = []) {
    for (let i = 0; i < phones.length; i++) {
      if (!this.isPhoneNumber(phones[i])) {
        return false;
      }
    }
    return true;
  }

  hideEmailCharacters(email) {
    try {
      const emailParts = email.split("@");
      const username = emailParts[0];
      const domain = emailParts[1].split(".");
      const hiddenUsername = username.slice(0, 1) + username.slice(1).replace(/./g, "*");
      const hiddenDomain = domain[0].slice(0, 1) + domain[0].slice(1).replace(/./g, "*");
      if (domain.at(1) === undefined) {
        return `${hiddenUsername}@${hiddenDomain}`;
      }
      const hiddenEx = domain[1];
      return `${hiddenUsername}@${hiddenDomain}.${hiddenEx}`;
    } catch (error) {
      return email;
      
    }
  
}

module.exports = Check;
