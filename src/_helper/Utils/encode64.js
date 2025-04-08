class Encode64 {
  constructor() {}

  async Encode64Content(item) {
    const blob = new Blob([item], { type: "application/octet-binary" });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const fileContentBase64 = reader.result.split(",")[1];
        resolve(fileContentBase64);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(blob);
    });

    
  }
  
}



const instance = new Encode64();
export default instance;
