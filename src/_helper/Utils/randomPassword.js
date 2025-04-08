import sha256 from "crypto-js/sha256";

// Define a class called RandomPassword
class RandomPassword {
  constructor() {
    // Define a string containing all possible characters for the password
    this.PasswordCharacters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  // Define a method to generate a random password and hash it using SHA-256
  GenerteRandomHashedPassword(length) {
    let result = "";

    // for (let i = 0; i < length; i++) {
    //   const randomIndex = Math.floor(
    //     Math.random() * this.PasswordCharacters.length
    //   );
    //   // Append a random character to the result string
    //   result += this.PasswordCharacters.charAt(randomIndex);
    // }

    result = Math.floor(100000 + Math.random() * 900000);
    // console.log(result);
    const hashedPassword = sha256(result.toString()).toString();
    // hashedPassword = sha256(result).toString();
    // console.log("hashedPassword", hashedPassword);
    // console.log("result", result);

    return {
      UserNewHashedPassword: hashedPassword,
      UserNewPassword: result,
    };
  }

  HashedPassword(password) {
    // Hash the generated password using SHA-256
    const hashedPassword = sha256(password).toString();

    return hashedPassword;
  }

  GenerteRandomPassword(length) {
    let result = "";

    // Loop to generate each character of the password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * this.PasswordCharacters.length
      );
      // Append a random character to the result string
      result += this.PasswordCharacters.charAt(randomIndex);
    }

    // Hash the generated password using SHA-256
    // const hashedPassword = sha256(result).toString();
    const hashedPassword = result.toString();
    return hashedPassword;
  }
}

// Create an instance of the RandomPassword class
const instance = new RandomPassword();

// Export the instance for use in other modules
export default instance;
