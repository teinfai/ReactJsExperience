import React, { useContext, useState } from 'react';
import { Col, Input, InputGroup, Row } from 'reactstrap';
import { Picker } from 'emoji-mart';
import { Btn, Image } from '../../../../AbstractElements';
import ChatAppContext from '../../../../_helper/Chat';
import SocketComponent from '../../../../_helper/Socket/Function';
import tools from '../../../../_helper/Utils/index';
import EmojiPicker from 'emoji-picker-react';

// import SocketComponent from '../../../../Socket/Function';
// import tools from '../Utils/index';




const SendChat = () => {

    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : null;

    // console.log(localStorage);

    const WevoSocket = new SocketComponent({ url: ws });

    // console.log(UserDevice);

    const callSocket = async (type, message) => {
        let response; // Declare response variable here

        try {
            response = await WevoSocket.sendMessage(message);
            let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);

            return ReturnResult;
        } catch (error) {
            console.error("Error sending message to Socket:", error);
            return null; // Handle the error gracefully
        }
    };
    
    const { getChatMembersData } = useContext(ChatAppContext);

    const [messageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    const {
        chatss,
        selectedUserr,
        currentUserr,
        sendMessageAsyn,
        replyByUserAsyn,
        // sendMessageToChat,
        // sendMessageToChat(currentUserId, chats);
    } = useContext(ChatAppContext);

    const onEmojiClick = (emoji) => {
        // console.log(emoji);
        const text = `${messageInput}${emoji.emoji}`;
        setShowEmojiPicker(false);
        setMessageInput(text);
    };
    const handleMessageChange = (message) => {
        setMessageInput(message);
    };


    const handleMessagePress = (e) => {
        if (e.key === 'Enter' || e === 'send') {
            var container = document.querySelector('.chat-history');
            setTimeout(function () {
                container.scrollBy({ top: 200, behavior: 'smooth' });
            }, 310);

            let currentUserId = currentUserr.id;
            let selectedUserId = selectedUserr.id;
            let selectedUserName = selectedUserr.name;
            // console.log(messageInput);
            if (messageInput.trim().length > 0 && messageInput) {
                // sendMessageToChat();
                sendMessageAsyn(currentUserId, selectedUserId, messageInput, chatss);
                setMessageInput('');

            }

            // const replyMessage = "";
            // replyByUserAsyn(currentUserId, selectedUserId, replyMessage, chatss);
            // getChatMembersData();
        }
    };


    return (
        <div className="chat-message clearfix">
            <Row >
                <div  >
                    {showEmojiPicker ? (
                        <EmojiPicker width="350" Theme="auto" emojiStyle='facebook' onEmojiClick={onEmojiClick} />
                    ) : null}
                </div>
                <Col xl="12" className="d-flex">
                    <div className="smiley-box bg-primary">
                        <div className="picker" onClick={() => toggleEmojiPicker()}>
                            <Image attrImage={{ src: `${require('../../../../assets/images/smiley.png')}`, alt: '' }} />
                        </div>
                    </div>
                    <InputGroup className="text-box">
                        <Input
                            type="text"
                            className="form-control input-txt-bx"
                            placeholder="Type a message......"
                            value={messageInput}
                            onKeyPress={(e) => handleMessagePress(e)}
                            onChange={(e) =>
                                handleMessageChange(e.target.value)
                            }
                            required
                        />
                        <Btn
                            attrBtn={{
                                color: 'primary'
                                , onClick: () => handleMessagePress('send')
                            }}>
                            Send
                        </Btn>
                    </InputGroup>
                </Col>
            </Row>
        </div>
    );
};

export default SendChat;