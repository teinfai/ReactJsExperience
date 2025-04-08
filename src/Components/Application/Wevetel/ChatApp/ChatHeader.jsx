import React, { Fragment, useContext, useState } from 'react';
import { Image, UL, LI } from '../../../../AbstractElements';
import ChatAppContext from '../../../../_helper/Chat';
import { AlignJustify, Headphones, Paperclip, Search, Video } from 'react-feather';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { showmodalVideo } from "../../../../Store/reduxjs/modalVideo";
import sip from '../../../../_helper/Wevetel/SipCallFunction/telephone';

const ChatHeader = () => {
  const { selectedUserr, setMenuToggle, menuToggle } = useContext(ChatAppContext);
  const [sessions, setSession] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const chatMenuToggle = () => {
    setMenuToggle(!menuToggle);
  };
  const telephone = sip.telephony.telephone;

  const videoCall = (ext) => {
    telephone.makeCall({
      target: ext,
      options: { mediaConstraints: { audio: true, video: true } },
      // options: {
      //   mediaConstraints: { audio: true, video: true },
      //   rtcOfferConstraints: { offerToReceiveAudio: 1, offerToReceiveVideo: 1 }
      // }
    });
    dispatch(showmodalVideo(true));
  };





  // // Event listeners
  // if (!!telephone) {
  //   telephone.on("call_in_progress", (event) => {
  //   })
  //   telephone.on("call_failed", (event) => {
  //   })
  //   telephone.on("call_ended", (event) => {
  //   })
  //   telephone.on("call_confirmed", (event) => {
  //   })

  //   telephone.on("setSession", (event) => {
  //     if (telephone.session) {
  //       setSession(telephone.session);
  //     } else {
  //     }
  //   })

  //   telephone.on("callername", ({ callername, direction }) => {
  //     // console.log('caller', callername);
  //     if (callername != undefined) {
  //     }
  //     if (direction == "incoming") {
  //     }
  //   })

  //   telephone.on("setStream", (event) => {
  //   })
  //   telephone.on("phone_call_ended", (event) => {
  //   })

  // }
  // Call function
  return (
    <Fragment>
      <div className='chat-header clearfix'>
        {/* <Image
          attrImage={{
            className: 'rounded-circle',
            src: `${require(`../../../../assets/images/${selectedUserr ? selectedUserr.thumb : 'user/8.jpg'}`)}`,
            alt: '',
          }}
        /> */}
        <div className='media-body'>
          <div className='about'>
            <div className='name'>
              {selectedUserr ? selectedUserr.name : 'Please select a user to start your chat'}
              {location.state ? <span className='font-primary f-12'> Typing...</span> : ''}
            </div>
            <div className='status digits'>{selectedUserr ? selectedUserr.lastSeenDate : ''}</div>
          </div>
        </div>
        <UL attrUL={{ className: 'simple-list list-inline float-start float-sm-end chat-menu-icons d-flex flex-row' }}>
          {/* <LI attrLI={{ className: 'list-inline-item border-0' }}>
            <a href='#javascript'>
              <Search />
            </a>
          </LI> */}
          {/* <LI attrLI={{ className: 'list-inline-item border-0' }}>
            <a href='#javascript'>
              <Paperclip />
            </a>
          </LI> */}
          {/* <LI attrLI={{ className: 'list-inline-item border-0' }}>
            <a href='#javascript'>
              <Headphones />
            </a>
          </LI> */}
          {selectedUserr &&
            <div onClick={() => videoCall(selectedUserr.default_extension)} className='me-3'>
              <Video />
            </div>
          }
          {/* <LI attrLI={{ className: 'list-inline-item toogle-bar border-0' }}>
            <a href='#javascript'>
              <AlignJustify onClick={() => chatMenuToggle()} />
            </a>
          </LI> */}


        </UL>
      </div>
    </Fragment>
  );
};
export default ChatHeader;
