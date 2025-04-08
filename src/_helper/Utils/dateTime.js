// Define a class called RandomPassword
class CurrentDate {
  constructor() {}

  // Define a method to generate a random password and hash it using SHA-256
  generateCustomDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const customDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return customDateTime;
  }

  generateCurrentTimeStamp() {
    const currentTimestamp = new Date().getTime();
    return currentTimestamp;
  }
}

// Create an instance of the RandomPassword class
const instance = new CurrentDate();

// Export the instance for use in other modules
export default instance;
