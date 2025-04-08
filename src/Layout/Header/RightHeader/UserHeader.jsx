import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogIn, Mail, User } from "react-feather";
import man from "../../../assets/images/dashboard/profile.png";

import { LI, UL, Image, P } from "../../../AbstractElements";
import CustomizerContext from "../../../_helper/Customizer";
import { Account, Admin, Inbox, LogOut, Taskboard } from "../../../Constant";
import { showRemember } from "../../../Store/reduxjs/remember";
import { useSelector, useDispatch } from "react-redux";
import { LoginAuth } from "../../../Store/reduxjs/login";
import SocketComponent from '../../../_helper/Socket/Function';
import tools from '../../../_helper/Utils/index';




const UserHeader = () => {
  const history = useNavigate();
  const [profile, setProfile] = useState("");
  // const [name, setName] = useState(JSON.parse(localStorage.device).ext + ' <' + JSON.parse(localStorage.device).username + '>');
  const [name, setName] = useState(JSON.parse(localStorage.device).id ? JSON.parse(localStorage.device).id : JSON.parse(localStorage.device).ext);
  const [username, setUsername] = useState(' <' + JSON.parse(localStorage.device).ext + '>');
  const { layoutURL } = useContext(CustomizerContext);
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));
  const dispatch = useDispatch();


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
      // return null; // Handle the error gracefully
    }
  };

  const remember = useSelector((state) => {
    return state.remember.value;
  });

  // console.log(remember);
  const LoginEmail = useSelector((state) => {
    return state.login.value;
  });

  // console.log(LoginEmail);
  // console.log(JSON.parse(localStorage.device).ext);
  // console.log(JSON.parse(localStorage.device).id);
  const fetchData = async () => {
    const query = {
      action: 'GetUserName',
      extension: JSON.parse(localStorage.device).ext,
    };

    const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
    const UserNameResult = await callSocket("WevoSocket", encryptedQuery);
    // console.log(UserNameResult);
    // console.log(UserNameResult.data[0].username);
    if (UserNameResult.data[0].username && UserNameResult) {
      setUsername(' <' + UserNameResult.data[0].username + '>');
    }
  };

  useEffect(() => {
    fetchData();
    setProfile(localStorage.getItem("profileURL") || man);
    setName(localStorage.getItem("Name") ? localStorage.getItem("Name") : name);
  }, []);

  // console.log(name);

  const Logout = () => {
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
  };

  if (remember) {
    const getCookie = (name) => {
      const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
      return cookieValue ? cookieValue.pop() : '';
    };

    const isUserAuthenticated = () => {
      // Check the authentication state using your preferred method
      // For example, check if the user has a valid authentication token
      // or if the necessary cookies are present and valid
      const email_cookie = getCookie('email');
      const password_cookie = getCookie('password');
      const rememberMe_cookie = getCookie('rememberMe');

      return Boolean(email_cookie && password_cookie && rememberMe_cookie);
    };



    if (!isUserAuthenticated()) {
      dispatch(showRemember(false));
      // Redirect or perform other actions, e.g., show a login modal
      Logout()
    }
  }


  const UserMenuRedirect = (redirect) => {
    history(redirect);
  };

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        {/* <Image
          attrImage={{
            className: "b-r-10 m-0",
            src: `${authenticated ? auth0_profile.picture : profile}`,
            alt: "",
          }}
        /> */}
        <div className="media-body">
          <span>{name} {username}</span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            Profile <i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      <UL attrUL={{ className: "simple-list profile-dropdown onhover-show-div" }}>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/wevetel/edit_profile/${layoutURL}`),
          }}>
          <User />
          <span>{Account} </span>
        </LI>
        {/* <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/email-app/${layoutURL}`),
          }}>
          <Mail />
          <span>{Inbox}</span>
        </LI>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/todo-app/todo/${layoutURL}`),
          }}>
          <FileText />
          <span>{Taskboard}</span>
        </LI> */}
        <LI attrLI={{ onClick: Logout }}>
          <LogIn />
          <span>{LogOut}</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
