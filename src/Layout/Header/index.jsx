import React, { Fragment, useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Form, Row, Col } from 'reactstrap';
import { X } from 'react-feather';
import { Link } from 'react-router-dom';
import CustomContext from '../../_helper/Customizer';
import Leftbar from './Leftbar/index';
import RightHeader from './RightHeader/index';
import { MENUITEMS } from '../Sidebar/Menu';
import { Loading } from '../../Constant';
import SvgIcon from '../../Components/Common/Component/SvgIcon';
import { useSelector, useDispatch } from "react-redux";
import { showmodal } from "../../Store/reduxjs/modal";
import { ToastContainer, toast } from "react-toastify";
import { showIncoming } from "../../Store/reduxjs/incoming";
import { NotiDetail } from "../../Store/reduxjs/noti";
import { showExt } from "../../Store/reduxjs/ext";
import { showSession } from "../../Store/reduxjs/session";
import { showCall } from "../../Store/reduxjs/call";
import { Modal } from 'react-bootstrap';
import ShowCall from '../../Components/Application/Wevetel/Dashboard/show_call';
import sip from '../../_helper/Wevetel/SipCallFunction/telephone';
import { showmodalVideo } from "../../Store/reduxjs/modalVideo";
import VideoPlayer from '../../Components/Application/Wevetel/videoplayer/video_player';
import ChatProvider from "../../_helper/Chat/index";
import music from "../../../src/assets/audio/horse.ogg";
import music1 from "../../../src/assets/audio/ring_ring.mp3";
import { current } from '@reduxjs/toolkit';

const Header = () => {

  const [callername, setCallername] = useState(null);
  const [videostream, setVideoStream] = useState(null);
  const [localStream, setLocalStreams] = useState(null);
  const [isVideo, setVideo] = useState(false);
  const [direction, setDirection] = useState(false);
  const [callEnded, setCallEnd] = useState("");
  const [muteVideo, setMute] = useState("unmute");
  const [muteAudio, setMuteAudio] = useState("unmute");
  const [onHold, setOnHold] = useState("unhold");
  const [callingStatus, setStatus] = useState("");
  const [SipTransfer, setSipTransfer] = useState(null);
  const [oldSession, setOldSession] = useState(null);
  const [oldExt, setOldExt] = useState(null);
  const audioRef = useRef(null);
  const [test2, setTest2] = useState(false);

  const modal = useSelector((state) => {
    return state.modal.value;
  });

  const ext_name = useSelector((state) => {
    return state.ext.value;
  });

  const sessions = useSelector((state) => {
    return state.session.value;
  });

  const incoming = useSelector((state) => {
    return state.incoming.value;
  });

  const showcall = useSelector((state) => {
    return state.call.value;
  });

  const modalVideo = useSelector((state) => {
    return state.modalVideo.value;
  });

  const dispatch = useDispatch();


  if (!sip.telephony) {
    sip.initphone();
  }

  let notifications = useSelector((state) => state.noti.value);

  useEffect(() => {
    if (notifications !== "") {
      let payload = notifications;
      let sender = payload.data.sender_id;
      toast.info("You have received a message from " + sender);
      dispatch(NotiDetail(""));
    }
  }, [notifications]);

  // const notifications = useSelector((state) => {
  //   console.log(1);
  //   if (state.noti.value !== "") {
  //     let payload = state.noti.value;
  //     let sender = payload.data.sender_id;
  //     toast.info("You have received message from " + sender);
  //     dispatch(NotiDetail(""));
  //   }
  // });


  // -- calling function and event listener start -- 
  const telephone = sip.telephony.telephone;

  // Event listeners
  if (!!telephone) {
    telephone.on("setSession", (event) => {
      setCallEnd('calling');
      dispatch(showSession(event));
    })
    telephone.on("setLocalStream", (event) => {
      setLocalStreams(event);
    })

    telephone.on("checkVideocall", (data) => {

      // console.log('data', data);
      if (data) {
        setVideo(true);
      } else {
        setVideo(false);
      }

    })

    telephone.on("call_in_progress", (event) => {
      setStatus('Dailing');
      dispatch(showIncoming(false));
      if (modalVideo) {
        dispatch(showCall(false));
        dispatch(showmodalVideo(true));
        dispatch(showmodal(false));
      } else {
        dispatch(showCall(true));
        dispatch(showmodal(true));
        dispatch(showmodalVideo(false));
      }
    })

    telephone.on("call_failed", (event) => {
      if (SipTransfer == null) {
        setCallEnd('end');
        setStatus('Rejected');
        dispatch(showIncoming(false));
        dispatch(showmodal(false));
        dispatch(showSession(null));
        dispatch(showExt(""));
        dispatch(showCall(false));
        dispatch(showmodalVideo(false));
      } else {
        setStatus('In Call');
        dispatch(showCall(true));
        dispatch(showmodal(true));
        dispatch(showSession(oldSession));
      }
      if (!!oldSession) {
        telephone.hold(oldSession, false);
        dispatch(showCall(true));
      }

    })
    telephone.on("call_ended", (event) => {
      if (SipTransfer == null) {
        setCallEnd('end');
        dispatch(showIncoming(false));
        dispatch(showmodal(false));
        dispatch(showSession(null));
        dispatch(showExt(""));
        dispatch(showCall(false));
        dispatch(showmodalVideo(false));
      } else {
        dispatch(showCall(true));
        dispatch(showSession(oldSession));
      }

      if (!!oldSession) {
        telephone.hold(oldSession, false);
        dispatch(showCall(true));
      }

    })
    telephone.on("call_confirmed", (event) => {
      setStatus('In Call');
      if (modalVideo) {
        dispatch(showmodalVideo(true));
        dispatch(showCall(false));
      } else {
        dispatch(showmodalVideo(false));
        dispatch(showCall(true));
      }
    })

    telephone.on("getCallername", ({ callername, direction }) => {
      if (callername != undefined) {
        setCallername(callername);
      }
      if (direction == "incoming") {
        console.log(audioRef);
        audioRef.current.play();
        setDirection('incoming');
        dispatch(showmodal(false));
        dispatch(showIncoming(true));
        dispatch(showExt(callername));
      }

      if (direction == 'outgoing') {
        setDirection('outgoing');
      }

    })

    telephone.on("setStream", (event) => {
      setVideoStream(event);
    })

    telephone.on("checkAccept", (event) => {
      if (SipTransfer != null) {
        if (oldSession != null) {
          telephone.hold(oldSession, false);
          // console.log(oldSession._status)
          // if (oldSession && oldSession._status != "8") {
          //   oldSession.terminate()
          // }
          sessions.refer('sip:' + oldExt + '@' + localStorage.domain, { replaces: oldSession });
        }
        setSipTransfer(null);
        setOldSession(null);
        setOldExt(null);

        // dispatch(showCall(false));
        // dispatch(showmodalVideo(false));
        // dispatch(showmodal(false));
        // dispatch(showIncoming(false));
        // dispatch(showSession(null));
        // dispatch(showExt(""));
      }


    })

    telephone.on("checkOnHold", (event) => {
      if (event == "hold") {
        setStatus('On Hold');
      } else {
        setStatus('In Call');
      }
    })

    telephone.on("phone_call_ended", (event) => {
      setCallEnd('end');
      dispatch(showCall(false));
      dispatch(showmodalVideo(false));
      dispatch(showmodal(false));
      dispatch(showIncoming(false));
      dispatch(showSession(null));
      dispatch(showExt(""));
    })
  }

  const call = (value) => {
    setOldExt(value);
    telephone.makeCall({
      target: value,
      options: { mediaConstraints: { audio: true, video: false } }
    });
  };

  const transfer = (value) => {
    if (value) {
      // console.log('sip:' + value + '@' + localStorage.domain);

      if (SipTransfer == null) {
        if (oldSession == null) {
          // console.log('aa', sessions);
          setOldSession(sessions);


          telephone.hold(sessions, true);

        }
        telephone.makeCall({
          target: value,
          options: { mediaConstraints: { audio: true, video: false } },
        });
      }

      let transferTarget = 'sip:' + value + '@' + localStorage.domain;

      setSipTransfer(transferTarget);

      // const newSession = userAgent.invite(transferTarget);

      // console.log(newSession);
      // sessions.refer(transferTarget);
      // sessions.refer(transferTarget, {
      //   extraHeaders: [
      //     'Referred-By: <sip:5577@sbc.wevetel.com>',
      //     'Refer-To: ' + transferTarget
      //   ]
      // });
      // dispatch(showCall(true));
      // dispatch(showmodalVideo(false));
      // dispatch(showmodal(false));
      // dispatch(showIncoming(false));
      // dispatch(showSession(null));
      // dispatch(showExt(""));
    }
  };

  const videoCall = (ext) => {
    telephone.makeCall({
      target: ext,
      options: { mediaConstraints: { audio: true, video: true } }
    });
    dispatch(showmodalVideo(true));
  };

  const answer = (data) => {
    // console.log(data);
    if (sessions) {
      setStatus('In Call');
      telephone.answer_call(sessions, data);
      dispatch(showIncoming(false));
      dispatch(showExt(ext_name));
      if (data) {
        dispatch(showmodal(false));
        dispatch(showmodalVideo(true));
        dispatch(showCall(false));
      } else {
        dispatch(showmodal(true));
        dispatch(showmodalVideo(false));
        dispatch(showCall(true));
      }
    }
  };

  const reject = () => {
    if (sessions && sessions._status != 8) {
      sessions.terminate()
    }
    dispatch(showSession(null));
    dispatch(showmodalVideo(false));
    dispatch(showCall(false));
    dispatch(showmodal(false));
    dispatch(showIncoming(false));
    dispatch(showExt(""));
  }

  const endVideo = () => {
    if (sessions && sessions._status != 8) {
      sessions.terminate()
    }
    dispatch(showmodalVideo(false));
  }

  // -- calling function and event listener end -- 



  // -- search user start -- 
  const id = window.location.pathname.split('/').pop();
  const layout = id;
  const { toggleIcon } = useContext(CustomContext);
  // eslint-disable-next-line
  const [mainmenu, setMainMenu] = useState(MENUITEMS);
  const [searchValue, setsearchValue] = useState('');
  // eslint-disable-next-line
  const [searchResult, setSearchResult] = useState(false);
  // eslint-disable-next-line
  const [searchResultEmpty, setSearchResultEmpty] = useState(false);
  const { customizer } = useContext(CustomContext);

  const layout_type = customizer.settings.layout_type;

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setsearchValue('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  const handleSearchKeyword = (keyword) => {
    keyword ? addFix() : removeFix();
    const items = [];

    mainmenu.map((menuItems) => {
      menuItems.Items.filter((mItems) => {
        if (mItems.title.toLowerCase().includes(keyword) && mItems.type === 'link') {
          items.push(mItems);
        }
        if (!mItems.children) return false;
        mItems.children.filter((subItems) => {
          if (subItems.title.toLowerCase().includes(keyword) && subItems.type === 'link') {
            subItems.icon = mItems.icon;
            items.push(subItems);
          }
          if (!subItems.children) return false;
          subItems.children.filter((suSubItems) => {
            if (suSubItems.title.toLowerCase().includes(keyword)) {
              suSubItems.icon = mItems.icon;
              items.push(suSubItems);
            }
            return suSubItems;
          });
          return subItems;
        });
        checkSearchResultEmpty(items);
        setsearchValue(items);
        return mItems;
      });
      return menuItems;
    });
  };

  const checkSearchResultEmpty = (items) => {
    if (!items.length) {
      setSearchResultEmpty(true);
      document.querySelector('.empty-menu').classList.add('is-open');
    } else {
      setSearchResultEmpty(false);
      document.querySelector('.empty-menu').classList.remove('is-open');
    }
  };

  const addFix = () => {
    setSearchResult(true);
    document.querySelector('.Typeahead-menu').classList.add('is-open');
    document.body.classList.add(`${layout_type}`);
    // if (document.body.classList.value !== 'box-layout') {
    //   document.body.classList.add('offcanvas');
    // }
  };

  const removeFix = () => {
    setSearchResult(false);
    setsearchValue('');
    document.querySelector('.Typeahead-menu').classList.remove('is-open');
    document.body.classList.add(`${layout_type}`);
    document.body.classList.remove('offcanvas');
  };
  // -- search user end -- 



  // -- mic and cam js start --
  const [camera, setCamera] = useState(
    {
      color: 'white',
      background: '#636363',
      status: true
    }
  );

  const [mic, setMic] = useState({
    color: 'white',
    background: '#636363',
    icon: 'fa fa-microphone',
    status: true
  });

  const [hold, setHold] = useState({
    color: 'white',
    background: '#636363',
    icon: 'fa fa-pause',
    status: true
  });

  const micOn = () => {
    setMuteAudio('unmute')
    // let micobj = mic
    setMic({
      color: 'white',
      background: '#636363',
      icon: 'fa fa-microphone',
      status: true
    });

    if (sessions) {
      telephone.mute(sessions, 'audio', 'unmute')
    }

  };

  const micOff = () => {
    setMuteAudio('mute')
    // let micobj = mic
    setMic({
      color: '#636363',
      background: 'white',
      icon: 'fa fa-microphone-slash',
      status: false
    });

    if (sessions) {
      telephone.mute(sessions, 'audio', 'mute');
    }

  };

  const camOff = () => {
    setMute('mute');
    // let camobj = camera;
    setCamera({
      color: '#636363',
      background: 'white',
      status: false
    });

    if (sessions) {
      telephone.mute(sessions, 'video', 'mute');
    }
  };

  const camOn = () => {
    // let camobj = camera;
    setMute('unmute');
    setCamera({
      color: '#636363',
      background: 'white',
      status: false
    });

    if (sessions) {
      telephone.mute(sessions, 'video', 'unmute')
    }
  };

  const holdClick = () => {
    // let camobj = camera;
    setOnHold('hold');
    setHold({
      color: '#636363',
      background: 'white',
      icon: 'fa fa-pause',
      status: false
    });

    if (sessions) {
      telephone.hold(sessions, true);
    }
  };
  const unholdClick = () => {
    // let camobj = camera;
    setOnHold('unhold');
    setHold({
      color: 'white',
      background: '#636363',
      icon: 'fa fa-pause',
      status: true
    });

    if (sessions) {
      telephone.hold(sessions, false);
    }
  };
  // -- mic and cam js end --

  window.addEventListener('beforeunload', (event) => {
    if (sessions && sessions._status != 8) {
      setCallEnd('end');
      sessions.terminate();
    }
  });



  useEffect(() => {
    if (test2) {
      // audioRef.current.play();
    }
  }, [test2]);

  useEffect(() => {
    if (callEnded === 'end') {
      setTest2(false);
      audioRef.current.pause();
    }
  }, [callEnded]);

  const handleToggleMute = () => {
    setTest2(!test2);
  };


  return (
    <Fragment>
      <Modal show={!test2} onHide={!test2} centered className="modal-sm my-0">
        <Modal.Header>
          Please click the 'Agree' button to receive a ringing sound when using this call application. Else ringing function are not applicable.
        </Modal.Header>
        <Modal.Body>
          <div>

            <Modal.Footer>
              <button className="btn" onClick={handleToggleMute}>
                Agree
              </button>
            </Modal.Footer>

          </div>
        </Modal.Body>
      </Modal>

      <div className={`page-header ${toggleIcon ? 'close_icon' : ''}`}>
        <audio ref={audioRef} src={music1} />
        {/* <audio ref={audioRef} onEnded={handleAudioEnded} muted={true} src={music1} /> */}
        <Row className='header-wrapper m-0'>
          <Form className='form-inline search-full col' action='#' method='get'>
            <div className='form-group w-100'>
              <div className='Typeahead Typeahead--twitterUsers'>
                <div className='u-posRelative'>
                  <input className='Typeahead-input form-control-plaintext w-100' id='demo-input' type='search' placeholder='Search Cuba ..' defaultValue={searchValue} onChange={(e) => handleSearchKeyword(e.target.value)} />
                  <div className='spinner-border Typeahead-spinner' role='status'>
                    <span className='sr-only'>{Loading}</span>
                  </div>
                  <X className='close-search' onClick={() => document.querySelector('.search-full').classList.remove('open')} />
                </div>
                <div className='Typeahead-menu' id='search-outer'>
                  <div className='header-search-suggestion custom-scrollbar'>
                    {searchValue
                      ? searchValue.map((data, index) => {
                        return (
                          <div className='ProfileCard u-cf' key={index}>
                            <div className='ProfileCard-details'>
                              <div className='ProfileCard-realName'>
                                <Link to={data.path + '/' + layout} className='realname  w-100 d-flex justify-content-start gap-2' onClick={removeFix}>
                                  <SvgIcon style={{ width: '16px', height: '16px' }} className='stroke-icon' iconId={`stroke-${data.icon}`} />
                                  <SvgIcon style={{ width: '16px', height: '16px' }} className='fill-icon' iconId={`fill-${data.icon}`} />
                                  {data.title}
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : ''}
                  </div>
                </div>
                <div className='Typeahead-menu empty-menu'>
                  <div className='tt-dataset tt-dataset-0'>
                    <div className='EmptyMessage'>{'Opps!! There are no result found.'}</div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
          <Leftbar />
          <RightHeader />


          <Modal show={modal} centered className="ps-0">
            <Modal.Header className="pb-0 justify-content-end">
              <button className="btn" type="button" onClick={() => reject()}><i className="fa fa-close"></i></button>
            </Modal.Header>
            <Modal.Body className='text-center p-0 t-0' >
              <ShowCall
                call={call}
                reject={reject}
                videocall={videoCall}
                // modalVideo={modalVideo}
                show={showcall}
                callername={ext_name}
                micOn={micOn}
                micOff={micOff}
                mute={muteAudio}
                mic={mic}
                onHoldStatus={onHold}
                onHold={holdClick}
                unhold={unholdClick}
                holdStyle={hold}
                callStatus={callEnded}
                status={callingStatus}
                transfer={transfer}
              ></ShowCall>
            </Modal.Body>
          </Modal>

          <Modal show={incoming} centered>
            <Modal.Body className='text-center' >
              <h3 id="caller_name" style={{ 'wordWrap': 'break-word' }}> {ext_name ?? callername}</h3>
            </Modal.Body>
            <Modal.Footer className='justify-content-center'>
              <Col xs="3" className='text-center mb-5 px-0'>
                <button onClick={() => answer(false)} className='btn-success p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>
                  <i className='fa fa-phone' ></i>
                </button>
              </Col>
              {isVideo ?
                <Col xs="3" className='text-center mb-5 px-0'>
                  <button onClick={() => answer(true)} className='btn-success p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z" /></svg>
                  </button>
                </Col>
                : <div></div>
              }
              <Col xs="3" className='text-center mb-5 px-0'><button onClick={reject} className='btn-danger p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-phone' ></i></button></Col>
            </Modal.Footer>
          </Modal>
          {/* {videostream && */}

          <Modal show={modalVideo} centered className="modal-lg my-0">
            <Modal.Body className=''>
              <VideoPlayer micOn={micOn} micOff={micOff} camOn={camOn} camOff={camOff} endVideo={endVideo} mic={mic} camera={camera} stream={videostream} direction={direction} isEnd={callEnded} mute={muteVideo} muteAudio={muteAudio} localStream={localStream}></VideoPlayer>
            </Modal.Body>
          </Modal >
          {/* } */}
        </Row>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default Header;
