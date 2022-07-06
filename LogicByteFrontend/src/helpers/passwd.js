function isSecurePassword(string) {
  // Checks for:
  // Lowercase character
  // Uppercase character
  // Digit
  // Symbol
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
  return re.test(string);
}

export default isSecurePassword;
