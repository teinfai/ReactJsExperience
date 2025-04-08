import React from "react";
import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Loader from "../Layout/Loader";
import { authRoutes } from "./AuthRoutes";
import LayoutRoutes from "../Route/LayoutRoutes";
import Signin from "../Auth/Signin";
import PrivateRoute from "./PrivateRoute";
import { classes } from "../Data/Layouts";
import { Card, CardBody, CardHeader, CardFooter, Col, Container, Row } from 'reactstrap';
import { Modal } from 'react-bootstrap';
// import ShowCall from '../Components/Application/Wevetel/Dashboard/show_call';
// import createSipPhone from '../_helper/Wevetel/SipCallFunction/telephone';
import phone from '../_helper/Wevetel/SipCallFunction/Function';
import JsSIP from "jssip";
// import { useSelector, useDispatch } from "react-redux";
// import { showmodal } from "../Store/reduxjs/modal";
import { ToastContainer, toast } from "react-toastify";
// import { showIncoming } from "../Store/reduxjs/incoming";
// import { showExt } from "../Store/reduxjs/ext";
// import { showSession } from "../Store/reduxjs/session";
// import { showCall } from "../Store/reduxjs/call";
// setup fake backend

const Routers = () => {
  const login = useState("");
  // const login = useState(JSON.parse(localStorage.getItem("login")))[0];
  const [authenticated, setAuthenticated] = useState(false);
  const defaultLayoutObj = classes.find((item) => Object.values(item).pop(1) === "compact-wrapper");
  const layout = localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();
  const [callername, setCallername] = useState(null)
  const [videostream, setVideoStream] = useState(null)
  const [userStream, setuserStream] = useState(null)
  const [showModals, setshowModals] = useState(false)



  // const modal = useSelector((state) => {
  //   return state.modal.value;
  // });

  // const ext_name = useSelector((state) => {
  //   return state.ext.value;
  // });

  // const sessions = useSelector((state) => {
  //   return state.session.value;
  // });

  // const incoming = useSelector((state) => {
  //   return state.incoming.value;
  // });

  // const showcall = useSelector((state) => {
  //   return state.call.value;
  // });

  // const dispatch = useDispatch();

  // const reject = () => {
  //   if (sessions) {
  //     sessions.terminate()
  //   }
  //   dispatch(showSession(null));
  //   dispatch(showCall(false));
  //   dispatch(showmodal(false));
  //   dispatch(showIncoming(false));
  //   dispatch(showExt(""));
  // }

  useEffect(() => {
    let abortController = new AbortController();
    setAuthenticated(JSON.parse(localStorage.getItem("authenticated")));
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;
    return () => {
      abortController.abort();
    };
  }, []);

  // const { telephone } = createSipPhone();

  // // Event listeners
  // if (!!telephone) {
  //   telephone.on("call_in_progress", (event) => {
  //     // console.log('call_in_progress');
  //     dispatch(showmodal(true));
  //     dispatch(showIncoming(false));
  //     dispatch(showCall(true));
  //   })
  //   telephone.on("call_failed", (event) => {
  //     dispatch(showIncoming(false));
  //     dispatch(showmodal(false));
  //     dispatch(showSession(null));
  //     dispatch(showExt(""));
  //     dispatch(showCall(false));

  //   })
  //   telephone.on("call_ended", (event) => {
  //     dispatch(showIncoming(false));
  //     dispatch(showmodal(false));
  //     dispatch(showSession(null));
  //     dispatch(showExt(""));
  //     dispatch(showCall(false));

  //   })
  //   telephone.on("call_confirmed", (event) => {
  //     dispatch(showCall(true));
  //   })

  //   telephone.on("setSession", (event) => {
  //     // console.log('tttttttttteon', event);
  //     // console.log('vvvvvvvvvveon', telephone.session);
  //     if (telephone.session) {
  //       dispatch(showSession(event));
  //     } else {
  //       dispatch(showSession(null));
  //     }
  //   })

  //   telephone.on("callername", ({ callername, direction }) => {
  //     // console.log('caller', callername);
  //     if (callername != undefined) {
  //       setCallername(callername);
  //     }
  //     if (direction == "incoming") {
  //       dispatch(showmodal(false));
  //       dispatch(showIncoming(true));
  //       dispatch(showExt(callername));
  //     }
  //   })

  //   telephone.on("setStream", (event) => {
  //     setVideoStream(event);
  //   })
  //   telephone.on("phone_call_ended", (event) => {
  //     // console.log('hehe');
  //     dispatch(showCall(false));
  //     dispatch(showmodal(false));
  //     dispatch(showIncoming(false));
  //     dispatch(showSession(null));
  //     dispatch(showExt(""));
  //   })

  // }

  // const call = (value) => {
  //   // console.log('abc', value);

  //   if (telephone) {
  //     telephone.makeCall({
  //       target: value,
  //       options: { mediaConstraints: { audio: true, video: true } }
  //     });
  //   }
  // };

  // const answer = () => {
  //   // console.log('ansansanansnas');
  //   // console.log('ansansanansnas', sessions);
  //   if (sessions) {
  //     telephone.answer_call(sessions);
  //     dispatch(showIncoming(false));
  //     dispatch(showmodal(true));
  //     dispatch(showExt(ext_name));
  //     dispatch(showCall(true));
  //   }
  // };

  return (
    <BrowserRouter basename={"/"}>
      <Suspense fallback={<Loader />}>

        <Routes>
          <Route path={"/"} element={<PrivateRoute />}>
            {login || authenticated ? (
              <>
                <Route exact path={`${process.env.PUBLIC_URL}`} element={<Navigate to={`${process.env.PUBLIC_URL}/login`} />} />
                {/* <Route exact path={`/`} element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard/default/${layout}`} />} /> */}
              </>
            ) : (
              ""
            )}
            <Route path={`/*`} element={<LayoutRoutes />} />
          </Route>
          {/* <Route> */}

          {/* </Route> */}

          <Route exact path={`${process.env.PUBLIC_URL}/login`} element={<Signin />} />
          {authRoutes.map(({ path, Component }, i) => (
            <Route path={path} element={Component} key={i} />
          ))}
        </Routes>
        {/* 
        <Modal show={modal} centered className="ps-0">
          <Modal.Header className="pb-0 justify-content-end">
            <button className="btn" type="button" onClick={() => reject()}><i className="fa fa-close"></i></button>
          </Modal.Header>
          <Modal.Body className='text-center p-0 t-0' >
            <ShowCall call={call} reject={reject} show={showcall} callername={ext_name}></ShowCall>
          </Modal.Body>
        </Modal>

        <Modal show={incoming} centered>
          <Modal.Body className='text-center' >
            <h3 id="caller_name">{ext_name ?? callername}</h3>
          </Modal.Body>
          <Modal.Footer className='justify-content-center'>
            <Col xs="5" className='text-center mb-5 px-0'><button onClick={() => answer(telephone)} className='btn-success p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-phone' ></i></button></Col>
            <Col xs="5" className='text-center mb-5 px-0'><button onClick={reject} className='btn-danger p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-phone' ></i></button></Col>
          </Modal.Footer>
        </Modal> */}
      </Suspense>
      <ToastContainer />
    </BrowserRouter>

  );
};

export default Routers;
