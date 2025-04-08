import React, { useEffect, useState } from 'react';
import Context from './index';
import axios from 'axios';
import { ChatApi, ChatMemberApi } from '../../api';
import SocketComponent from '../Socket/Function';
import tools from '../Utils/index';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { requestForToken, onMessageListener, messaging } from '../Firebase/Function'
import { useSelector, useDispatch } from "react-redux";
import { NotiDetail } from "../../Store/reduxjs/noti";
import { NotiStyle } from "../../Store/reduxjs/noticstyle";


const ws = localStorage && localStorage.ws ? JSON.parse(localStorage.ws) : "";
const CurrentUserExt = localStorage && localStorage.device ? JSON.parse(localStorage.device).ext : "";



const WevoSocket = new SocketComponent({ url: ws });

const callSocket = async (type, message) => {

  if (ws) {
    let response; // Declare response variable here
    try {
      response = await WevoSocket.sendMessage(message);
      // console.log("response", response);

      let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
      // console.log("ReturnResult", ReturnResult);

      return ReturnResult;
    } catch (error) {
      console.error("Error sending message to Socket:", error);
    }
  }
};

const ChatProvider = (props) => {

  const [allMemberss, setAllMembers] = useState([]);
  const [menuToggle, setMenuToggle] = useState(false);
  const [memberss, setMembers] = useState([]);
  const [chatss, setChats] = useState([]);
  const [currentUserr, setCurrentUser] = useState();
  const [selectedUserr, setSelectedUser] = useState();
  const [extensionUser, setextensionUser] = useState();
  const [notification, setnotification] = useState();

  const dispatch = useDispatch();

  const getChatMembersData = async () => {
    // console.log("getChatMembersData");
    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : "";
    const WevoSocket = new SocketComponent({ url: ws });
    const CurrentUserExt = localStorage.device ? JSON.parse(localStorage.device).ext : "";
    const callSocket = async (type, message) => {

      if (ws) {
        let response; // Declare response variable here
        try {
          response = await WevoSocket.sendMessage(message);
          // console.log("response", response);

          let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
          // console.log("ReturnResult", ReturnResult);

          return ReturnResult;
        } catch (error) {
          console.error("Error sending message to Socket:", error);
        }
      }
    };
    const query = {
      // action: 'Query',
      action: 'RetrievePhoneBook',
      data: {
        type: "message",
        ext: CurrentUserExt,
      },
    };
    // console.log(query);
    const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
    // console.log(encryptedQuery);
    const PhoneBookResult = await callSocket("WevoSocket", encryptedQuery);
    // console.log(localStorage);
    // console.log("PhoneBookResult", PhoneBookResult);
    if (PhoneBookResult !== null && PhoneBookResult !== undefined && PhoneBookResult) {
      const JsonPhoneBook = tools.EncryptionUtility.encrypt_decrypt('decrypt', JSON.parse(PhoneBookResult).phonebook);
      // console.log("JsonPhoneBook", JsonPhoneBook);
      if (JsonPhoneBook) {
        const records = [];
        for (const item of JsonPhoneBook) {
          const record = {
            id: item.default_extension,
            default_extension: item.default_extension,
            name: item.username,
            thumb: "user/1.jpg",
            status: "lalalala",
            online: true,
            typing: true,
            time: "5 May, 5:30 PM",
            reply: "fa fa-reply font-danger",
            destination: item.dst,
            disposition: item.disposition,
            unread_message_count: item.message ? item.message.unread_count : 0,
            unread_message_content: item.message ? item.message.text : "",
            // test: "asd",
          };
          records.push(record);
        }
        // console.log("JsonPhoneBook", records);
        // if (records) {
        // }

        // console.log('record', records);
        if (currentUserr) {
          setMembers(records);
        }
        setAllMembers(records);


      }
    } else {
    }
    // /var/lib/asterisk/static-http/

  };

  useEffect(() => {
    getChatMembersData();
  }, [setAllMembers, setMembers, setSelectedUser, setCurrentUser, setChats]);

  const getMembersSuccess = (chats) => {

    const UserDevice = JSON.parse(localStorage.device);
    let LoginUser = {
      id: UserDevice.ext,
      default_extension: UserDevice.ext,
      name: UserDevice.username,
      thumb: "user/1.jpg",
      status: "Olin",
      online: true,
      typing: true,
      time: "5 May, 5:30 PM",
      reply: "fa fa-reply font-danger",
      destination: '',
      disposition: '',
    };

    setCurrentUser(LoginUser);
    setMembers(chats);
  };

  const fetchChatMemberAsyn = () => {
    if (allMemberss.length > 0) getMembersSuccess(allMemberss);
  };

  const getChatData = async () => {

    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : "";

    const WevoSocket = new SocketComponent({ url: ws });

    const callSocket = async (type, message) => {

      if (ws) {
        let response; // Declare response variable here
        try {
          response = await WevoSocket.sendMessage(message);
          // console.log("response", response);

          let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
          // console.log("ReturnResult", ReturnResult);

          return ReturnResult;
        } catch (error) {
          console.error("Error sending message to Socket:", error);
        }
      }
    };

    const device = localStorage.device ? JSON.parse(localStorage.device).ext : "";

    const query = {
      action: 'GetMessage',
      data: { ext: device },
    };

    // console.log(query);

    const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
    const AllChatDetail = await callSocket("WevoSocket", encryptedQuery);
    // console.log(AllChatDetail.data);

    if (AllChatDetail != null && AllChatDetail != undefined) {
      setChats(AllChatDetail.data);
    }
  };

  const UpdateReadMessage = async (selectedUserr) => {
    // console.log(selectedUserr);

    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : "";

    const WevoSocket = new SocketComponent({ url: ws });

    const callSocket = async (type, message) => {
      if (ws) {
        let response; // Declare response variable here
        try {
          response = await WevoSocket.sendMessage(message);
          // console.log("response", response);

          let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
          // console.log("ReturnResult", ReturnResult);
          return ReturnResult;
        } catch (error) {
          console.error("Error sending message to Socket:", error);
        }
      }
    };

    let members = memberss.find((x) => {
      // console.log(x);
      if (x.default_extension.includes(selectedUserr)) {
        return x.default_extension.includes(selectedUserr);
      }
    });
    // console.log(members);

    if (members.unread_message_count >= 0) {
      members.unread_message_count = 0;

      let time = tools.DateTime.generateCustomDateTime();
      // console.log(selectedUserr);
      if (selectedUserr) {
        let currentChat = [];
        chatss.forEach(element => {
          let CheckCurrentUser = false;
          let CheckSelectedUser = false;

          element.users.forEach(elements => {
            if (elements == currentUserr.id) {
              CheckCurrentUser = true;
            }
            if (elements == selectedUserr) {
              CheckSelectedUser = true;
            }
          });

          if (CheckCurrentUser && CheckSelectedUser) {
            currentChat.push(element);
          }
        });

        // console.log(currentChat[0].id);


        const query = {
          // action: 'Query',
          action: 'UpdateReadMessage',
          data: {
            time: time,
            ext: CurrentUserExt,
            ConversationID: currentChat[0].id
          },
        };
        // console.log(currentUserr.id);
        // console.log(selectedUserr.id);
        const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
        const UpdateChatResult = await callSocket("WevoSocket", encryptedQuery);


      }

    }

    // setSelectedUser();
  };
  // fetch reply for the current user
  const handleFCMMessage = async () => {
    // console.log(currentUserr);
    // console.log(selectedUserr);

    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : "";
    const domain = localStorage.domain ? localStorage.domain : "";

    const WevoSocket = new SocketComponent({ url: ws });

    const callSocket = async (type, message) => {

      if (ws) {
        let response; // Declare response variable here
        try {
          response = await WevoSocket.sendMessage(message);
          // console.log("response", response);

          let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
          // console.log("ReturnResult", ReturnResult);

          return ReturnResult;
        } catch (error) {
          console.error("Error sending message to Socket:", error);
        }
      }
    };

    try {
      const payload = await onMessageListener();
      const CurrentUserextension = JSON.parse(localStorage.device).ext;

      // console.log(payload);
      // console.log(CurrentUserextension);
      // console.log(payload.data.sender_id);
      if (payload.data.hostname == domain && (CurrentUserextension == payload.data.receiver_id)) {

        if (selectedUserr && (selectedUserr.id == payload.data.sender_id)) {
          UpdateReadMessage(payload.data.sender_id);
        }

        dispatch(NotiDetail(payload));
        dispatch(NotiStyle(payload));
        setnotification(payload);
        // console.log("2");
        if (CurrentUserextension == payload.data.receiver_id) {

          let chat = chatss.find((x) => x && x.users && x.users.includes(CurrentUserextension) && x.users.includes(payload.data.sender_id));
          // console.log(chat);
          const query = {
            action: 'GetMessage',
            data: {
              ext: payload.data.receiver_id,
              // UUID: payload.data.uniqid,
              SenderId: payload.data.sender_id,
              time: chat ? chat.ReturnlastMessageTime : ""
            }
          };

          // console.log(query);

          const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
          const fetchChat = await callSocket("WevoSocket", encryptedQuery);
          // console.log(fetchChat);
          if (fetchChat && fetchChat.data[0].messages.length > 0) {
            fetchChat.data[0].messages.forEach(element => {
              // console.log(element.text);
              replyByUserAsyn(CurrentUserextension, payload.data.sender_id, element.text, chatss);
            });
          }
        }

        getChatData();
        getChatMembersData();
      }

      // handleFCMMessage();
      // setTimeout(handleFCMMessage, 1000);
    } catch (error) {
      console.error('Error listening for FCM message:', error);
    }
  };

  // Call the function to start listening
  handleFCMMessage();

  useEffect(() => {
    // inital take data when rendering
    const getChatData = async () => {

      const ws = localStorage.ws ? JSON.parse(localStorage.ws) : "";

      const WevoSocket = new SocketComponent({ url: ws });

      const callSocket = async (type, message) => {

        if (ws) {
          let response; // Declare response variable here
          try {
            response = await WevoSocket.sendMessage(message);
            // console.log("response", response);

            let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
            // console.log("ReturnResult", ReturnResult);

            return ReturnResult;
          } catch (error) {
            console.error("Error sending message to Socket:", error);
          }
        }
      };

      const device = localStorage.device ? JSON.parse(localStorage.device) : null;

      const query = {
        action: 'GetMessage',
        data: { ext: device?.ext },
      };

      const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
      const AllChatDetail = await callSocket("WevoSocket", encryptedQuery);
      // console.log(AllChatDetail.data);

      if (AllChatDetail != null && AllChatDetail != undefined) {
        setChats(AllChatDetail.data);
      }
    };
    getChatData();
  }, [setChats]);


  const getChatsSuccess = (chats, selectedUser, online) => {
    // console.log(chats);
    if (allMemberss.length > 0) {
      setChats(chats);
      // setSelectedUser(allMemberss.find((x) => x.id === selectedUser));
    }
  };

  const getChatsSuccessAndUpdate = (chats, selectedUser, online) => {

    if (allMemberss.length > 0) {
      setSelectedUser(allMemberss.find((x) => x.id === selectedUser));
    }
  };

  const updateSelectedUser = (selectedUser, online) => {
    if (allMemberss.length > 0) return allMemberss.find((x) => x.id === selectedUser);
  };

  const fetchChatAsyn = () => {

    if (chatss?.data?.length > 0) {
      const currentUserId = 0;
      const online = true;

      const chat = chatss.data.filter((x) => x.users.includes(currentUserId));
      const selectedUser = chatss.data[0].users.find((x) => x !== currentUserId);

      // getChatsSuccess fetch the selected receiver chat detail

      getChatsSuccess(chat, selectedUser, online);
      updateSelectedUser(selectedUser, online);
    }
  };

  const sendMessageToChat = async (currentUserId, chats) => {

    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : "";

    const WevoSocket = new SocketComponent({ url: ws });

    const callSocket = async (type, message) => {

      if (ws) {
        let response; // Declare response variable here
        try {
          response = await WevoSocket.sendMessage(message);
          // console.log("response", response);

          let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
          // console.log("ReturnResult", ReturnResult);

          return ReturnResult;
        } catch (error) {
          console.error("Error sending message to Socket:", error);
        }
      }
    };

    // console.log("currentUserId", chats);

    const UserDevice = JSON.parse(localStorage.device);
    // console.log(tools.DateTime.generateCurrentTimeStamp());
    // console.log("chats", chats.data[currentUserId]);
    // console.log(UserDevice.ext);

    let chat = chats.find((x) => x.users.includes(currentUserId) && x.users.includes(selectedUserr.id));
    let lastElement = chat.messages[chat.messages.length - 1];
    // console.log(lastElement);
    const uniqueId = uuidv4();

    const SendMessage = {
      chat: {
        type: "chatMessage",
        sender_id: UserDevice.ext,
        receiver_id: selectedUserr.default_extension,
        content: lastElement.text,
        timestamp: tools.DateTime.generateCurrentTimeStamp(),
        uuid: uniqueId,
      }
    };
    // console.log(SendMessage);
    const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(SendMessage));
    const ReturnAfterSend = await callSocket("WevoSocket", encryptedQuery);

    // console.log(ReturnAfterSend);
    // console.log(chats);

    // try {
    //   await axios.put(`${ChatApi}/${chats.data[currentUserId].id}`, chats.data[currentUserId]);
    // } catch (error) {
    //   console.log('error', error);
    // }
  };

  const sendMessageAsyn = (currentUserId, selectedUserId, messageInput, chats, online) => {
    let chat = chats.find((x) => x.users.includes(currentUserId) && x.users.includes(selectedUserId));
    // let members = memberss.find((x) => x.includes(selectedUserId));

    let members = memberss.find((x) => {
      return x.default_extension.includes(selectedUserId)
    });
    // console.log(memberss);

    members.unread_message_content = messageInput;


    const targetIndex = memberss.findIndex(item => item.id === selectedUserId);
    if (targetIndex !== -1 && targetIndex !== 0) {
      const temp = memberss[targetIndex];
      memberss.splice(targetIndex, 1);
      memberss.unshift(temp);
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Determine if it's AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    // Convert to 12-hour format
    const formattedHours = hours % 12 || 12;
    // Format the time as hh:mm AM/PM
    const time = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
    const status = online;

    if (chat) {
      chat.messages.push({
        sender: currentUserId,
        time: time,
        text: messageInput,
      });
      chat.lastMessageTime = time;
      chat.online = status;

      let chats_data = chats.filter((x) => x.id !== chat.id);
      chats_data.splice(0, 0, chat);

      getChatsSuccess(chats_data, selectedUserId, online);
      sendMessageToChat(currentUserId, chats);
    }

  };

  const replyByUserAsyn = (currentUserId, selectedUserId, replyMessage, chats, online) => {
    let chat = chats.find((x) => x.users.includes(currentUserId) && x.users.includes(selectedUserId));
    const now = new Date();
    const time = now.getHours() + ':' + now.getMinutes();
    const status = online;


    if (chat && replyMessage) {
      chat.messages.push({
        sender: selectedUserId,
        time: time,
        text: replyMessage,
        // status: true,
      });
      chat.lastMessageTime = time;
      chat.online = status;
      let chats_data = chats.filter((x) => x.id !== chat.id);
      chats_data.splice(0, 0, chat);
      // getChatsSuccess(chats_data, selectedUserId, online);
      // sendMessageToChat(currentUserId, chats);
    }


  };

  const createNewChatAsyn = (currentUserId, selectedUserId, chats) => {

    let conversation = {
      id: chats?.length + 1,
      users: [currentUserId, selectedUserId],
      lastMessageTime: '-',
      messages: [],
    };
    chats?.splice(0, 0, conversation);
    getChatsSuccess(chats, selectedUserId);
    getChatsSuccessAndUpdate(chats, selectedUserId);
  };


  const changeChat = (userID) => {

    // console.log("here", userID);
    setSelectedUser(allMemberss.find((x) => x.id === userID));
  };

  const searchMember = (keywords) => {
    if (keywords === '') {
      setMembers(allMemberss);
    } else {
      const keyword = keywords.toLowerCase();
      const searchedMembers = allMemberss.filter((member) => member.name.toLowerCase().indexOf(keyword) > -1);
      setMembers(searchedMembers);
    }
  };


  return (
    <Context.Provider
      value={{
        ...props,
        allMemberss,
        chatss,
        selectedUserr,
        currentUserr,
        memberss,
        menuToggle,
        notification,
        setMenuToggle,
        getChatMembersData: getChatMembersData,
        getChatData: getChatData,
        setChats: setChats,
        UpdateReadMessage: UpdateReadMessage,
        setAllMembers: setAllMembers,
        getChatsSuccess: getChatsSuccess,
        updateSelectedUserr: updateSelectedUser,
        fetchChatAsyn: fetchChatAsyn,
        fetchChatMemberAsyn: fetchChatMemberAsyn,
        sendMessageAsyn: sendMessageAsyn,
        replyByUserAsyn: replyByUserAsyn,
        createNewChatAsyn: createNewChatAsyn,
        changeChat: changeChat,
        searchMember: searchMember,
        setextensionUser: setextensionUser,
      }}>
      {props.children}
    </Context.Provider>
  );
};

export default ChatProvider;
