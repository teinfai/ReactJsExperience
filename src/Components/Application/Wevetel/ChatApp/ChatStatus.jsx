import React, { Fragment, useContext, useEffect, useState } from 'react';
import ChatAppContext from '../../../../_helper/Chat';
import { Image, LI, UL } from '../../../../AbstractElements';
import errorImg from '../../../../assets/images/search-not-found.png';
import SearchChatList from './SearchChatList';
import CurrentUser from './CurrentUser';
import { useSelector, useDispatch } from "react-redux";
import { NotiDetail } from "../../../../Store/reduxjs/noti";
import { NotiStyle } from "../../../../Store/reduxjs/noticstyle";


const ChatStatus = () => {
  const dispatch = useDispatch();
  const { UpdateReadMessage, selectedUserr, memberss, currentUserr, chatss, changeChat, createNewChatAsyn, getChatMembersData, allMemberss, fetchChatMemberAsyn } = useContext(ChatAppContext);
  const [NotificationFlag, SetNotificationFlag] = useState("");
  // console.log(memberss);
  // console.log(chatss);
  const notification = useSelector((state) => {
    // console.log(state.notistyle.value); // Log state.notistyle.value
    if (state.notistyle.value !== "") {
      SetNotificationFlag(state.notistyle.value.data.sender_id);
      dispatch(NotiStyle(""));
      // if (selectedUserr && state.notistyle.value.data.sender_id !== selectedUserr.id) {
      //   // console.log(selectedUserr.id);
      //   // console.log(state.notistyle.value.data.sender_id);
      //   // console.log(1);
      //   let about = document.getElementById('about_' + state.notistyle.value.data.sender_id);
      //   let name = document.getElementById('name_' + state.notistyle.value.data.sender_id);
      //   about.style.fontWeight = '800';
      //   name.style.fontWeight = '800';
      // }
    }
    // }
  });

  var images = require.context('../../../../assets/images', true);

  const dynamicImage = (image) => {
    return images(`./${image}`);
  };

  // const UpdateCss = (selectedUserr) => {
  //   console.log(selectedUserr);
  //   let about = document.getElementById('about_' + selectedUserr);
  //   let name = document.getElementById('name_' + selectedUserr);
  //   about.style.fontWeight = '';
  //   name.style.fontWeight = '';
  // }

  const changeChatClick = (e, selectedUserId) => {
    changeChat(selectedUserId);

    const currentUserId = currentUserr.id;
    // ClickAgain(e, selectedUserId);

    let currentChat = [];

    chatss.forEach(element => {
      let CheckCurrentUser = false;
      let CheckSelectedUser = false;

      element.users.forEach(elements => {
        if (elements == currentUserId) {
          CheckCurrentUser = true;
        }
        if (elements == selectedUserId) {
          CheckSelectedUser = true;
        }
      });

      if (CheckCurrentUser && CheckSelectedUser) {
        currentChat.push(element);
      }
    });
    // const currentChat = chatss.find((x) => x.users.includes(currentUserr.id) && x.users.includes(selectedUserId));

    if (currentChat.length > 0) {
      // console.log("asd", currentUserr.id);
      // console.log("asd2", selectedUserId);
      document.getElementById('about_' + selectedUserId).style.fontWeight = '500';
      document.getElementById('about_' + selectedUserId).style.fontWeight = 'normal';
      // const element = document.getElementById(id);
      // if (element) {
      //   element.style.fontWeight = '500';
      // }

      // let about = document.getElementById('about_' + selectedUserId);
      // let name = document.getElementById('name_' + selectedUserId);
      // about.style.fontWeight = '';
      // name.style.fontWeight = '';
      // let SelectedChat = chatss.find((x) => x.users.includes(currentUserr.id) && x.users.includes(selectedUserId));
      // console.log("SelectedChat", SelectedChat);
      // let

      UpdateReadMessage(selectedUserId);
    } else {
      createNewChatAsyn(currentUserId, selectedUserId, chatss);
    }
  }

  var activeChat = 0;
  if (selectedUserr != null) activeChat = selectedUserr.id;



  return (
    <Fragment>
      <div className='chat-box'>
        <div className='chat-left-aside'>
          <CurrentUser />
          <div className='people-list' id='people-list'>
            <SearchChatList />
            {memberss && memberss.length > 0 ? (
              <UL attrUL={{ className: 'simple-list list custom-scrollbar overflow-auto' }}>
                {memberss
                  .filter((x) => x.id !== currentUserr.id)
                  .map((item) => {
                    return (
                      <LI
                        className="mb-3"
                        attrLI={{
                          style: { backgroundColor: 'transparent', cursor: 'pointer' },
                          className: ` clearfix my-3 border-0 ${activeChat === item.id ? 'active' : ''}`,
                          onClick: (e) => changeChatClick(e, item.id),
                          // onClick: (e) => UpdateChatStatus(e, item.id),
                        }}
                        key={item.id}>
                        {/* <Image
                          attrImage={{
                            src: `${dynamicImage(item.thumb)}`,
                            className: 'rounded-circle user-image',
                            alt: '',
                          }}
                        /> */}
                        {/* <div className={`status-circle ${item.online === true ? 'online' : 'offline'}`}></div> */}
                        {/* <div className='about' style={item.unread_message_content ? { fontWeight: 800 } : ""} > */}

                        {/* if (selectedUserr && state.notistyle.value.data.sender_id !== selectedUserr.id) { */}
                        {/* <div id={'about_' + item.id} className='about' style={(selectedUserr && NotificationFlag !== selectedUserr.id && item.unread_message_count) || (!selectedUserr && item.unread_message_count > 0) ? { fontWeight: 800 } : {}}> */}

                        <div id={'about_' + item.id} className='about' >
                          {/* <div style={{ fontWeight: 800 }} className='name'>{item.name}</div> */}
                          <div id={'name_' + item.id} className='name' style={(selectedUserr && selectedUserr.id != NotificationFlag && item.unread_message_count > 0) || !selectedUserr && item.unread_message_count > 0 ? { fontWeight: 800 } : {}} >{item.name}</div>
                          <div className='status text-truncate' style={(selectedUserr && selectedUserr.id != NotificationFlag && item.unread_message_count > 0) || !selectedUserr && item.unread_message_count > 0 ? { fontWeight: 800, maxWidth: '200px' } : { maxWidth: '240px' }}>{item.unread_message_content ? item.unread_message_content : "No message"}</div>
                        </div>
                      </LI>
                    );
                  })}
              </UL>
            ) : (
              <Image
                attrImage={{
                  // className: 'img-fluid m-auto',
                  className: 'm-auto',
                  // src: { errorImg },
                  alt: '',
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Fragment >
  );
};
export default ChatStatus;
