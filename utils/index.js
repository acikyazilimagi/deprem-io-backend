const removeWhiteSpace = (value) => value.replace(/ /g, "");
const phoneRegex =
  /^((?:\+[0-9][-\s]?)?\(?0?[0-9]{3}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2})$/;

module.exports = { removeWhiteSpace, phoneRegex };
