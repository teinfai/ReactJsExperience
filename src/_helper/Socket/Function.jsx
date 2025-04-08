// import { w3cwebsocket as W3CWebSocket } from 'websocket';

import Utils from "../Utils";

// class SocketComponent {
//   constructor(item) {
//     this.socket = new W3CWebSocket(item.url); // Replace with your PHP Socket.IO server URL
//     this.connectionStatus = 'Connecting'; // Use an instance variable to store the connection status

//     // Initialize listeners for message and error events
//     this.setupMessageListener();
//     this.setupErrorListener();
//   }

//   setupMessageListener() {
//     this.socket.addEventListener('message', (event) => {
//     });
//   }

//   setupErrorListener() {
//     this.socket.addEventListener('error', (error) => {
//       console.error('Socket error:', error);
//     });
//   }

//   componentDidMount() {
//     this.setupSocketListeners(); 
//   }


//   componentWillUnmount() {
//     this.socket.close();
//   }

//   setupSocketListeners() {
//     this.socket.onopen = () => {
//       this.setState({ connectionStatus: 'Connected' });
//       console.log("Connected:");
//     };

//     this.socket.onclose = () => {
//       this.setState({ connectionStatus: 'Disconnected' });
//       console.log("Disconnected:");
//     };

//     this.socket.onerror = (error) => {
//       this.setState({ connectionStatus: 'Connect Error' });
//       console.error("Error:", error);
//     };
//   }


//   async SocketGet(item) {
//     return new Promise((resolve, reject) => {

//       const onMessage = (event) => {
//         resolve(event.data);
//         this.socket.removeEventListener('message', onMessage);
//       };

//       const onError = (error) => {
//         reject(error);
//         this.socket.removeEventListener('error', onError);
//         // this.socket.close();
//       };

//       // Attach event listeners for message and error events
//       this.socket.addEventListener('message', onMessage);
//       this.socket.addEventListener('error', onError);

//       // Send the provided item/message over the socket connection

//       this.socket.send(item);

//     });
//   }
// }

class SocketComponent {
  constructor(item) {
    // this.socket = new WebSocket(item.url);
    this.url = item.url
    // console.log(this.url);
    // console.log(this.socket.readyState)
    this.messageHandlers = [];
    // console.log("123")
  }

  onOpen(message) {
    console.log("[open] Connection established");
  }

  componentWillUnmount() {
    this.socket.close();
  }

  onMessage(event) {
    // console.log(event);
    const message = event.data;
    this.messageHandlers.forEach((handler) => {
      handler(message);
    });
  }

  onClose(event) {
    if (event.wasClean) {
      // console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // console.log('[close] Connection died');
    }
  }

  onError(error) {
    // console.error(error);
    // console.log(error.message);

  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      let socket = new WebSocket(this.url)

      // console.log(socket);
      socket.onopen = () => {
        // console.log("message", Utils.EncryptionUtility.encrypt_decrypt("decrypt", message))
        socket.send(message)
      }

      socket.onclose = this.onClose

      socket.onerror = this.onError

      socket.onmessage = (event) => {

        // console.log("received1", Utils.EncryptionUtility.encrypt_decrypt("decrypt", message));
        // console.log("received2", event);

        const result = event.data;
        resolve(result)
        socket.close()
      }
    });
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler) {
    const index = this.messageHandlers.indexOf(handler);
    if (index !== -1) {
      this.messageHandlers.splice(index, 1);
    }
  }
}



// Usage
// const socket = new SocketComponent("wss://javascript.info/article/websocket/demo/hello");


export default SocketComponent;
