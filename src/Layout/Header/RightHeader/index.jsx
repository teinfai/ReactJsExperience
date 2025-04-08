import React, { Fragment, useEffect, useState } from 'react';

import Language from './Language';
import Searchbar from './Searchbar';
import Notificationbar from './Notificationbar';
import MoonLight from './MoonLight';
import CartHeader from './CartHeader';
import BookmarkHeader from './BookmarkHeader';
import UserHeader from './UserHeader';
import Dial from './Dial';
import { UL, P } from '../../../AbstractElements';
import { Col } from 'reactstrap';
import SocketComponent from '../../../_helper/Socket/Function';
import tools from '../../../_helper/Utils/index';
import { FileText, LogIn, Mail, User } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoginAuth } from "../../../Store/reduxjs/login";




const RightHeader = () => {
  const history = useNavigate(); // Move useNavigate here
  const dispatch = useDispatch();

  const [word, setWord] = useState("WEVETEL SYSTEM SDN BHD");

  useEffect(() => {

    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : null;

    const WevoSocket = new SocketComponent({ url: ws });
    const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });

    const callSocket = async (type, message) => {
      let response; // Declare response variable here

      try {
        if (type == "CloudSocket") {
          response = await CloudSocket.sendMessage(message);
        } else if (type == "WevoSocket") {
          response = await WevoSocket.sendMessage(message);
        }
        let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);

        return ReturnResult;
      } catch (error) {
        console.error("Error sending message to Socket:", error);
        return null; // Handle the error gracefully
      }
    };


    const fetchName = async () => {
      try {
        const query = {
          action: 'RetrievePbxName',
          data: "",
        };
        const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
        const fetchNameResult = await callSocket("WevoSocket", encryptedQuery);

        const currentUrl = window.location.href;
        const urlPattern = /tm-muc/i;

        if (urlPattern.test(currentUrl)) {
          setWord("TM SDN BHD");
        } else {
          if (!fetchNameResult) {
            setWord("WEVETEL SYSTEM SDN BHD");
          } else {
            setWord(fetchNameResult.data[0].value);
          }
        }
      } catch (error) {
        // console.error("Error fetching name:", error);
      }
    };

    fetchName();
  }, [word]);


  const handleLogout = () => {
    localStorage.removeItem("profileURL");
    localStorage.removeItem("token");
    localStorage.removeItem("auth0_profile");
    localStorage.removeItem("Name");
    localStorage.removeItem("login");
    localStorage.removeItem("domain");
    localStorage.removeItem("settings");
    localStorage.removeItem("device");
    localStorage.removeItem("ws");
    localStorage.setItem("authenticated", false);
    dispatch(LoginAuth(""));
    history(`${process.env.PUBLIC_URL}/login`);
    // Perform logout actions here
    // For example, clear local storage, redirect to login page, etc.
    // history(`${process.env.PUBLIC_URL}/login`);
  };



  // useEffect(() => {
  //   // SetLogo

  //   const currentUrl = window.location.href;
  //   const urlPattern = /tm-muc/i; // The 'i' flag makes the match case-insensitive
  //   const isUrlContainingWord = (currentUrl) => {
  //     if (urlPattern.test(currentUrl)) {
  //       setword("TM SDN BHD");
  //     } else {
  //       setword("WEVO SYSTEM SDN BHD");
  //     }
  //   };

  //   isUrlContainingWord(currentUrl);
  // }, []);



  return (
    <Fragment>
      <Col className='nav-right pull-right right-header p-0 ms-auto'>
        {/* <Col md="8"> */}
        <UL attrUL={{ className: 'simple-list nav-menus flex-row justify-content-between mx-0 align-items-center' }}>
          {/* <Language />
          <Searchbar />
          <BookmarkHeader />
          <MoonLight />
          <CartHeader />
          <Notificationbar /> */}
          <div>
            <h4 className='mb-0'>{word}</h4>
          </div>
          <div className="row mx-0">
            <Col xs="auto">
              <Dial />
            </Col>
            <Col xs="auto">
              <UserHeader />
            </Col>

            <Col xs="auto" onClick={handleLogout} className="d-block d-md-none ">
              <LogIn className=" align-items-center mt-1" />
            </Col>
          </div>
        </UL>
        {/* </Col> */}
      </Col>
    </Fragment >
  );
};

export default RightHeader;
