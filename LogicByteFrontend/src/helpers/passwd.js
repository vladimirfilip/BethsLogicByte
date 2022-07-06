function isSecurePassword(string) {
  // Checks for:
  // Lowercase character
  // Uppercase character
  // Digit
  // Symbol
  // Is at least 8 characters

  let validLength = string.length >= 8;
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
  return re.test(string) && validLength;
}

export default isSecurePassword;
