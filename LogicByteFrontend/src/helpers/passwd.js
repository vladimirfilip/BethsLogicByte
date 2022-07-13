function isSecurePassword(string) {
  // Checks for:
  // Lowercase character
  // Uppercase character
  // Digit
  // Symbol
  // Is at least 8 characters

  // let validLength = string.length >= 8;
  // const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
  // return re.test(string) && validLength;

  const checks = {
    lowercase: /(?=.*[a-z])/,
    uppercase: /(?=.*[A-Z])/,
    digit: /(?=.*\d)/,
    symbol: /(?=.*\W)/,
  };
  const error_messages = {
    lowercase: "Password should have at least 1 lowercase letter",
    uppercase: "Password should have at least 1 uppcerase letter",
    digit: "Password should have at least 1 digit",
    symbol: "Password should have at least 1 symbol",
  };

  let errors = [];

  if (string.length > 0) {
    if (string.length < 8) {
      errors.push("Password should be at least 8 characters long");
    }
    for (let check in checks) {
      if (!checks[check].test(string)) {
        errors.push(error_messages[check]);
      }
    }
  } else {
    errors.push("Enter a new password");
  }

  return errors;
}

export default isSecurePassword;
