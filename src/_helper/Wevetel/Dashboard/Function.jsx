import React from 'react';
import tools from '../../Utils/index';
import SocketComponent from '../../Socket/Function';

class FetchData extends React.Component {

    callSocket = async (type, message) => {
        const ws = localStorage.ws ? JSON.parse(localStorage.ws) : null;

        const WevoSocket = new SocketComponent({ url: ws });
        const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });

        let response = null; // Initialize response variable

        try {
            if (type === "CloudSocket") {
                response = await CloudSocket.sendMessage(message);
            } else if (type === "WevoSocket") {
                response = await WevoSocket.sendMessage(message);
            }
            let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);

            return ReturnResult;
        } catch (error) {
            console.error("Error sending message to Socket:", error);
            return null; // Handle the error gracefully
        }
    };

    async fetchdata() {
        const query = {
            action: 'RetrieveCallData',
            ext: localStorage.device.ext,
        };

        const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
        const DataResult = await this.callSocket("WevoSocket", encryptedQuery);

        if (DataResult?.status === "200" && DataResult?.data) {
            // this.result = JSON.stringify(DataResult);
            // this.inbound = DataResult.data.Inbound_count;
            // this.miss = DataResult.data.MissCall_count;
            // this.outbound = DataResult.data.Outbound_count;
            return DataResult.data;
        }
    }
}

export default FetchData;
