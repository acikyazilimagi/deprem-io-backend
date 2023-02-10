class Check {
  constructor() {}

  isPhoneNumber(text) {
    return /^((?:\+[0-9][-\s]?)?\(?0?[0-9]{3}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2})$/.test(text);
  }
  hideEmailCharacters(email) { 

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      return 'Geçersiz bir e-posta adresi girildi.';
    }
  
    var parts = email.split("@");
    var maskedUsername = parts[0][0] + "***";
    var maskedDomain = "";
    for (var i = 0; i < parts[1].length; i++) {
      if (i === 0) {
        maskedDomain += parts[1][i] + "***";
      } else if (parts[1][i] === ".") {
        maskedDomain += parts[1][i];
        i++;
        maskedDomain += parts[1][i] + "***";
      }
    }
    var maskedEmail = maskedUsername + "@" + maskedDomain;
    return maskedEmail;
    
  }
}

module.exports = Check;
