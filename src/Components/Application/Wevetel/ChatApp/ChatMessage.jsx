import React, { Fragment, useContext, useEffect, useRef } from 'react';
import { Image, LI, UL, Btn } from '../../../../AbstractElements';
import ChatAppContext from '../../../../_helper/Chat';
import start_conversion from '../../../../assets/images/start-conversion.jpg';
import { Col, Row } from 'reactstrap';


const ChatMessage = () => {
  const { allMemberss, chatss, selectedUserr, currentUserr, fetchChatMemberAsyn, fetchChatAsyn } = useContext(ChatAppContext);
  var images = require.context('../../../../assets/images', true);
  const scrollRef = useRef(null);

  useEffect(() => {
    // fetch all user
    fetchChatMemberAsyn();
    // fetch all user chat data
    fetchChatAsyn();

  }, [allMemberss?.length === 0, chatss?.length === 0]);

  useEffect(() => {
    if (scrollRef.current) {
      // console.log(scrollRef.current.scrollTop);
      // console.log(scrollRef.current.scrollHeight);
      // console.log(scrollRef);

      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatss, selectedUserr]);

  const dynamicImage = (image) => {
    return images(`./${image}`);
  };

  const selectedChat = allMemberss && chatss && selectedUserr ? chatss.find((x) => x.users.includes(currentUserr.id) && x.users.includes(selectedUserr.id)) : null;
  var activeChat = 0;
  // console.log(allMemberss);
  // console.log(allMemberss);
  // eslint-disable-next-line
  // console.log(selectedChat.messages.length);


  if (selectedUserr != null) activeChat = selectedUserr.id;

  return (
    <Fragment>
      {allMemberss && chatss && selectedUserr ? (
        <div className='chat-history chat-msg-box custom-scrollbar' ref={scrollRef}>
          {/* {selectedChat.messages.length >= 10 &&
            <Col className="text-center" xs="12" >
              <Btn attrBtn={{ className: "btn btn-pill btn-air-info", color: 'light', type: 'button' }}>Load More</Btn>
            </Col>
          } */}

          <UL attrUL={{ className: 'simple-list mt-3' }}>
            {selectedChat && selectedChat.messages.length > 0 ? (
              selectedChat.messages.map((item, index) => {
                const participators = allMemberss.find((x) => x.id === item.sender);
                // console.log("asdsad", currentUserr);
                return (
                  <LI attrLI={{ className: 'clearfix border-0' }} key={index}>
                    <div className={`message  ${item.sender !== currentUserr.id ? 'my-message' : 'other-message pull-right '}`}>
                      {/* <Image
                        attrImage={{
                          // src: `${dynamicImage(participators.thumb)}`,
                          className: `rounded-circle ${item.sender !== currentUserr.id ? 'float-start' : 'float-end'} chat-user-img img-30`,
                          alt: '',
                        }}
                      /> */}
                      {participators && (
                        <div>
                          {participators.name ? participators.name : participators.default_extension}
                        </div>
                      )}

                      {(item.sender == currentUserr.user_id && currentUserr) && (
                        <div>
                          {currentUserr.name ? currentUserr.name : currentUserr.default_extension}
                        </div>
                      )}

                      <div className='message-data text-end'>
                        <span className='message-data-time'>{item.time}</span>
                      </div>
                      {/* {console.log(item)} */}
                      {item.text}
                    </div>
                  </LI>
                );
              })
            ) : (
              <div>
                <Image
                  attrImage={{
                    className: 'img-fluid',
                    src: `${start_conversion}`,
                    alt: 'start conversion ',
                  }}
                />
              </div>
            )}
          </UL>
        </div>
      ) : (
        <div className='loading'></div>
      )}
    </Fragment>
  );
};
export default ChatMessage;
