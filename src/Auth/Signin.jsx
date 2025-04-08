import React, { Fragment, useState, useEffect, useContext } from "react";
import { Col, Container, Form, FormGroup, FormFeedback, Input, Label, Row } from "reactstrap";
import { Btn, H4, P, H6, Spinner } from "../AbstractElements";
import { EmailAddress, DomainNamelabel, ForgotPassword, Password, RememberPassword, SignIn } from "../Constant";
import { useNavigate } from "react-router-dom";
import man from "../assets/images/dashboard/profile.png";
import CustomizerContext from "../_helper/Customizer";
import OtherWay from "./OtherWay";
import { ToastContainer, toast } from "react-toastify";
import { Image } from '../AbstractElements';
import WevetelIcon from '../assets/images/wevetel/wevetel_side.png';
import TmIcon from '../assets/images/tm/TMOne-ManagedVoice_PlayStore.png';
import Counter from '../Components/Counter/Counter';
import SocketComponent from '../_helper/Socket/Function';
import tools from '../_helper/Utils/index';
import { Data } from '../Components/UiKits/Spinners/SpinnerData';
import { Modal } from 'react-bootstrap';
import { Button } from 'primereact/button';
import axios from 'axios';
import JsSIP from "jssip";
import { showRemember } from "../Store/reduxjs/remember";
import { LoginAuth } from "../Store/reduxjs/login";
import phone from '../_helper/Wevetel/SipCallFunction/Function';
// import { getSip } from '../_helper/Wevetel/SipCallFunction/telephone';
import { set } from "date-fns";
import { requestForToken, onMessageListener, getCurrentToken } from '../_helper/Firebase/Function'
// Redux
import { useSelector, useDispatch } from "react-redux";
// import ForgetPwd from './ForgetPwd';
import { Link } from 'react-router-dom';
// import Signin from "../";
import ChatProvider from "../_helper/Chat/index";



// const CurrentDate = ;
// console.log(CurrentDate);


const Signin = () => {
  const { getChatData, getChatMembersData, setextensionUser } = useContext(ChatProvider);

  // States for input fields and validation
  // const [email, setEmail] = useState("");
  // const [email, setEmail] = useState("sy.ding@wevo.my");
  // const loginValue = useSelector((state) => state.login.value);
  // const [email, setEmail] = useState("");
  const [email, setEmail] = useState("");
  const [WsAddress, setWsAddress] = useState("");
  const [password, setPassword] = useState("");
  // const [DomainName, setDomainName] = useState("");
  const [DomainName, setDomainName] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [modalShow, setModal] = useState(false);
  const history = useNavigate();
  const { layoutURL } = useContext(CustomizerContext);
  const [value, setValue] = useState(localStorage.getItem("profileURL" || man));
  const [name, setName] = useState(localStorage.getItem("Name"));
  const [device, setDevice] = useState(null);
  const [SubmitButton, SetSubmitButton] = useState(true);
  const [PasswordRowVisibile, SetPasswordRowVisible] = useState(false);
  const [RememberMe, setRememberMe] = useState(false);
  const [logo, setLogo] = useState(false);
  const [token, settoken] = useState("");
  const [OTPSubmitButton, SetOTPSubmitButton] = useState(false);
  const [loaders, setloaders] = useState(false);
  // const [readOnly, readonlycredential] = useState(true);
  const { UserNewHashedPassword, UserNewPassword } = tools.RandomPassword.GenerteRandomHashedPassword(8);

  // const UserNewPassword = tools.RandomPassword.GenerteRandomPassword(8);
  const CurrentDate = tools.DateTime.generateCustomDateTime();

  const dispatch = useDispatch();
  // dispatch(LoginAuth("tf.cheng@wevetel.com"));
  requestForToken().then(() => {
    const token = getCurrentToken();
    settoken(token);
    // console.log("Current token from another page:", token);
    // Now you can use the token in this file or pass it to other functions/components as needed
  });

  const remember = useSelector((state) => {
    return state.remember.value;
  });

  const LoginEmail = useSelector((state) => {
    return state.login.value;
  });

  // console.log(LoginEmail);

  // console.log(remember);
  // Handle email input change
  const handleChangeEmail = (event) => {
    const value = event.target.value;
    dispatch(LoginAuth(value));
    // console.log(value);
  };

  // // const hashedPassword = sha256(passwords).toString();
  // // Handle password input change
  const handleChangePassword = (event) => {
    const value = event.target.value;
    // console.log(value);
    // console.log(require);
    setPassword(value);

    // console.log(value);
    // setIsPasswordValid(value.length >= 5);
  };

  const handleChangeDomain = (event) => {
    const value = event.target.value;
    setDomainName(value);

  }

  const sleep = async (milliseconds) => {
    await new Promise(resolve => {
      return setTimeout(resolve, milliseconds)
    });
  }

  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    document.cookie = `${name}=${value};expires=${expirationDate.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? cookieValue.pop() : '';
  };


  // const WevoSocket = new SocketComponent({ url: process.env.REACT_APP_SOCKET });
  // const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });

  // console.log(process.env.REACT_APP_CLOUD_SOCKET);


  const Socket = async (type, message, info = "") => {
    // if (info) {
    //   console.log("ss", info);
    // }
    // console.log("wss", info);

    const WevoSocket = new SocketComponent({ url: info });
    const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });


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
      // console.error("Error sending message to Socket:", error);
    }
  };

  // document.cookie = 'email=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  // document.cookie = 'domain=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  // document.cookie = 'password=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  // document.cookie = 'rememberMe=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';


  useEffect(() => {
    // SetLogo
    const currentUrl = window.location.href;
    const urlPattern = /tm-muc/i; // The 'i' flag makes the match case-insensitive
    const isUrlContainingWord = (currentUrl) => {
      if (urlPattern.test(currentUrl)) {
        setLogo(TmIcon);
      } else {
        setLogo(WevetelIcon);
      }
    };

    // Check if "Remember Me" was previously selected and populate the form
    const storedEmail = getCookie('email');
    const storedDomain = getCookie('domain');
    const storedPassword = getCookie('password');
    const storedRememberMe = getCookie('rememberMe');

    const decPassword = tools.EncryptionUtility.encrypt_decrypt('decrypt', storedPassword);

    if (storedRememberMe) {
      setEmail(storedEmail || '');
      setDomainName(storedDomain || '');
      setPassword(decPassword || '');
      setRememberMe(true);
    }

    isUrlContainingWord(currentUrl);
  }, []);

  // const WssAddress = "";

  // // Handle login authentication
  const loginAuth = async (e) => {

    if (!LoginEmail && !DomainName) {
      toast.error("Please fill in Email and Domain name");
      return;
    } else if (!LoginEmail) {
      toast.error("Please fill in Email");
      return;
    } else if (!DomainName) {
      toast.error("Please fill in Domain name");
      return;
    }

    e.preventDefault();
    // Validate email and password before proceeding

    try {
      const socketQuery1 = {
        hostname_detail: { type: 'hostnameDetailEmail', hostname: DomainName },
      };

      const encryptedReturn = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketQuery1));
      // console.log(encryptedReturn);
      const ReturnResult = await Socket("CloudSocket", encryptedReturn);

      // const sadaa = tools.EncryptionUtility.encrypt_decrypt('decrypt', "sDn7MgvLCx5cU2FsdGVkX18yWc2PWdEYolb9OQJ3yCgnMr+BNkCZW6GMdKHmU90vShsXpXqsqsUPk+MaBluG6F44LCpbDS65jc5gyBlbAdjMkthTAebTIf4=kzAPy1J4");

      // console.log("adasda", sadaa);
      // 
      // console.log("ReturnResult", ReturnResult);
      // sbc.wevo.my
      // Check User Exist in Wevo

      // console.log("WssAddress", WssAddress);

      setWsAddress(WssAddress);
      if (ReturnResult.type == "success") {

        const socketQuery = {
          action: 'CheckEmail',
          data: LoginEmail,
        };
        const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketQuery));
        const WevoUser = await Socket("WevoSocket", encryptedQuery, WssAddress);
        // console.log("WevoUser", WevoUser);
        // Check User Exist in Cloud
        const socketQuery2 = {
          action: 'CheckEmail',
          data: LoginEmail,
        };

        const encryptedReturn2 = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketQuery2));
        const CloudCheckEmailResult = await Socket("CloudSocket", encryptedReturn2);
        // console.log("CloudCheckEmailResult", CloudCheckEmailResult);
        SetSubmitButton(false);

        if (WevoUser.data.length > 0 && WevoUser.status == "200" && ReturnResult.type == "success") {
          if (CloudCheckEmailResult.data.length > 0 && CloudCheckEmailResult.status == "200") {
            // Not first time login

            try {

              const socketCreateCloudUserQuery = {
                action: 'UpdateOTP',
                // query: `INSERT INTO users(email, password, created_at, created_by) VALUES ('${email}', '${UserNewHashedPassword}', '${CurrentDate}','SYSTEM');`,
                email: LoginEmail,
                UserNewHashedPassword: UserNewHashedPassword,
                CurrentDate: CurrentDate,
              };

              const encryptedMessageReturn = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketCreateCloudUserQuery));
              const CloudUpdateOtp = await Socket("CloudSocket", encryptedMessageReturn);

              // console.log(CloudUpdateOtp);

              const socketQuery3 = {
                SendEmail: { email: LoginEmail, content: UserNewPassword },
              };

              const encryptedTemporaryPasswordReturn = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketQuery3));
              const ResultTemporaryPasswordReturn = await Socket("CloudSocket", encryptedTemporaryPasswordReturn);
              // console.log("HERE1", socketQuery3);

              if (ResultTemporaryPasswordReturn && ResultTemporaryPasswordReturn.status == "200") {
                toast.success("OTP has sent to " + ResultTemporaryPasswordReturn.data);

                SetPasswordRowVisible(true);
              } else {
                SetPasswordRowVisible(true);
                toast.error("OTP error, contact Admin");
              }


            } catch (error) {
              toast.error("Email error, contact Admin");
              return;
            }

            SetOTPSubmitButton(true);

          } else if (CloudCheckEmailResult.data.length <= 0 && CloudCheckEmailResult.status == "200") {
            // First time login
            const socketCreateCloudUserQuery = {
              action: 'RegisterUser',
              // query: `INSERT INTO users(email, password, created_at, created_by) VALUES ('${email}', '${UserNewHashedPassword}', '${CurrentDate}','SYSTEM');`,
              email: LoginEmail,
              UserNewHashedPassword: UserNewHashedPassword,
              CurrentDate: CurrentDate,
            };

            const encryptedMessageReturn = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketCreateCloudUserQuery));
            const CloudCreateUserResult = await Socket("CloudSocket", encryptedMessageReturn);
            // console.log("CloudCreateUserResult", CloudCreateUserResult);
            // return;
            // Send email for the password
            try {
              const socketQuery3 = {
                SendEmail: { email: LoginEmail, content: UserNewPassword },
              };

              // console.log(socketQuery3);

              const encryptedTemporaryPasswordReturn = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketQuery3));
              const ResultTemporaryPasswordReturn = await Socket("CloudSocket", encryptedTemporaryPasswordReturn);


              if (ResultTemporaryPasswordReturn && ResultTemporaryPasswordReturn.status == "200") {
                toast.success("OTP has sent to " + ResultTemporaryPasswordReturn.data);
                SetOTPSubmitButton(true);
                // SetSubmitButton(true);
                SetPasswordRowVisible(true);
                // console.log(SubmitButton);
                return;
              } else {
                SetOTPSubmitButton(true);
                // SetSubmitButton(true);
                SetPasswordRowVisible(true);
                toast.error("OTP error, contact Admin");
                return;
              }


            } catch (error) {
              toast.error("OTP error, contact Admin");
              return;
            }
          } else if (CloudCheckEmailResult.status == "400") {
            toast.error("System error, contact Admin");
            return;
          }

          // toast.success("Both true");
        } else if (WevoUser.data.length == 0 && WevoUser.status == "200") {
          toast.error("User not Exist");
          SetSubmitButton(true);
          return;

        } else if (ReturnResult.type == "error" || !ReturnResult.content.host.hostname || ReturnResult.content.host.hostname != DomainName) {
          SetSubmitButton(true);
          toast.error("Domain Not Exist");
          return;

        } else if (WevoUser.status == "400") {
          SetSubmitButton(true);
          toast.error("System error, contact Admin");
          return;
        }


      } else {
        toast.error("Information not correct or not exist");
      }

    } catch (error) {
      SetSubmitButton(true);
      toast.error("Information not correct or not exist");
      return;
    }


  };

  const SubmitOTP = async () => {

    if (!password) {
      toast.success("Please enter your password");
      SetOTPSubmitButton(true);
    } else {
      SetOTPSubmitButton(false);

      const pwd = tools.RandomPassword.HashedPassword(password);

      const socketCreateCloudUserQuery = {
        action: 'UserLogin',
        email: LoginEmail,
        password: pwd,
      };

      const encryptedPasswordChecked = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketCreateCloudUserQuery));
      const CloudPasswordCheckedResult = await Socket("CloudSocket", encryptedPasswordChecked);

      // console.log(CloudPasswordCheckedResult.data[0]);
      if (CloudPasswordCheckedResult.data.length > 0 && CloudPasswordCheckedResult.status == "200") {

        localStorage.setItem("login", JSON.stringify(CloudPasswordCheckedResult.data[0]));

        const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketCreateCloudUserQuery));
        let GetData = await Socket("WevoSocket", encryptedQuery, WsAddress);

        // If no device will auto create devices
        if (GetData.length <= 0) {
          // SetSubmitButton(false);
          const getCodeQuery = {
            email_login: {
              type: "getCode",
              email: LoginEmail,
              sendemail: true,
              content: {
                cellphone_id: "WEBPHONE",
              }
            },
          };

          const SocketGetCode = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(getCodeQuery));
          const SocketGetCodeResult = await Socket("WevoSocket", SocketGetCode, WsAddress);
          // console.log("SocketGetCodeResult", SocketGetCodeResult);

          if (SocketGetCodeResult.content.session_id) {
            const newDeviceQuery = {
              email_login: {
                email: LoginEmail,
                type: "newDevice",
                session_id: SocketGetCodeResult.session_id,
                content: {
                  newdevice: "webphone",
                }
              },
            };

            const SocketNewDevice = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(newDeviceQuery));
            const SocketNewDeviceResult = await Socket("WevoSocket", SocketNewDevice, WsAddress);

            const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketCreateCloudUserQuery));
            GetData = await Socket("WevoSocket", encryptedQuery, WsAddress);

          }
        }

        setDevice(GetData);
        setModal(true);

        const socketGetDomain = {
          action: 'GetDomain',
          domain: DomainName
        };

        const socketDomainResponse = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketGetDomain));
        const socketDomainResult = await Socket("CloudSocket", socketDomainResponse);

        localStorage.setItem("domain", socketDomainResult.data[0].hostname);
        localStorage.setItem("settings", JSON.stringify(socketDomainResult.data[0]));
        localStorage.setItem("ws", JSON.stringify(WsAddress));
        localStorage.setItem("authenticated", true);
      } else {
        toast.error("Wrong password");
        SetOTPSubmitButton(true);
      }
    }
  }

  const loginDevice = async (item) => {
    setloaders(true);
    // console.log("adasd", item);
    const query = {
      action: 'UpdateWebToken',
      data: {
        token: token,
        device_id: item.device_id,
      }
    };
    // console.log(query);

    const SocketUpdateQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
    const SocketUpdateQueryResult = Socket("WevoSocket", SocketUpdateQuery, WsAddress);

    // console.log(SocketUpdateQueryResult);
    // console.log("asdsad", SocketUpdateQueryResult);

    const encPass = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(password));
    if (RememberMe) {
      dispatch(showRemember(true));
      setCookie('email', LoginEmail, 7); // Expires in 7 days
      setCookie('domain', DomainName, 7);
      setCookie('password', encPass, 7);
      setCookie('rememberMe', true, 7);
    } else {
      // If "Remember Me" is not selected, clear the stored cookies
      dispatch(showRemember(false));
      document.cookie = 'email=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'domain=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'password=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'rememberMe=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    // getSip();
    localStorage.setItem('device', JSON.stringify(item));
    await getChatData(); // Wait for getChatData() to complete
    await getChatMembersData(); // Wait for getChatMembersData() to complete


    history(`${process.env.PUBLIC_URL}/wevetel/dashboard/${layoutURL}`);
  };

  // const forgetpassword = (e) => {
  //   // console.log(e);
  //   history(`${process.env.PUBLIC_URL}/WevetelForgetPwd`);
  // }

  return (
    <Fragment>


      {/* Container and form layout */}
      <Container fluid={true} className="p-0 login-page">
        <Modal show={modalShow} centered className="">
          {/* <Modal show="true" centered className=""> */}
          <Modal.Header size="lg" className="pb-0">
            <Col xs="12" >
              <h3 className="text-center">Please Select Devices </h3>
              <small>If there's no device available, the system will create one for you automatically.</small>
            </Col>
          </Modal.Header>
          <Modal.Body className='text-center' >

            {loaders && <Row className="justify-content-center">
              <Col key={Data[14].id}>
                <div className="loader-box">
                  <Spinner attrSpinner={{ className: Data[14].spinnerClass }} />
                </div>
              </Col>
            </Row>}

            {!loaders && device != null && device.map((item, index) => (
              <div key={index}>
                <Button label={item.id} onClick={() => loginDevice(item)} icon="pi pi-check" size="medium" style={{ 'width': '100%', 'marginBottom': '10px' }} />
                {/* Other properties of your object */}
              </div>
            ))}
          </Modal.Body>
        </Modal>

        {/* <Modal show={false} centered className="">
          <Modal.Header className="justify-content-center pb-0">
            <h3>No Devices available</h3>
          </Modal.Header>
          <Modal.Body className='text-center' >
            <p>Click Create and Signin for the Web Phone</p>
            <Button label="Create and Signin" onClick={() => CreateAndSignin()} icon="pi pi-check" size="large" style={{ 'width': '100%', 'marginBottom': '10px' }} />
          </Modal.Body>
        </Modal> */}
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form">
                  {/* Logo or image */}
                  <div className="row justify-content-center">
                    <Col md="8" xs="10">
                      <Image attrImage={{ className: 'img-fluid d-inline', src: `${logo}`, alt: '' }} />
                    </Col>
                  </div>
                  <Spinner attrSpinner={{ className: 'loader-1' }} />
                  {/* <Counter /> */}
                  {/* Email input */}
                  <FormGroup className="mt-5">
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input
                      className="form-control"
                      type="email"
                      onChange={handleChangeEmail}
                      value={LoginEmail}
                      placeholder="Enter Your email address"
                      required
                    // valid={setIsEmailValid}
                    // invalid={!setIsEmailValid}
                    />
                    {/* <FormFeedback valid>Looks good!</FormFeedback>
                    <FormFeedback invalid>Email must be at least 5 characters.</FormFeedback> */}
                  </FormGroup>



                  <FormGroup className="mt-3">
                    <Label className="col-form-label">{DomainNamelabel}</Label>
                    <Input
                      className="form-control"
                      type="url"
                      onChange={handleChangeDomain}
                      value={DomainName}
                      placeholder="Enter Your Domain Url"
                      required
                    // readOnly
                    />
                  </FormGroup>

                  {/* Password input */}
                  {PasswordRowVisibile && <FormGroup className="position-relative">
                    <Label className="col-form-label">OTP</Label>
                    <div className="position-relative">
                      <Input
                        className="form-control"
                        type={togglePassword ? "text" : "password"}
                        onChange={handleChangePassword}
                        value={password}
                        placeholder="Enter Your OTP"
                      // required
                      // valid={isPasswordValid}
                      // invalid={!isPasswordValid}
                      />
                      <div className="show-hide" onClick={() => setTogglePassword(!togglePassword)}>
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                    </div>
                    {/* <FormFeedback valid>Looks good!</FormFeedback>
                    <FormFeedback invalid>Password must be at least 5 characters.</FormFeedback> */}
                  </FormGroup>}

                  {/* Other form elements and buttons */}
                  <div className="position-relative form-group mb-0">
                    {/* <a className="" href="#javascript">
                      {ForgotPassword}
                    </a> */}
                    <label className="d-flex justify-content-end">
                      <input className="me-2" type="checkbox" checked={RememberMe} onChange={() => setRememberMe(!RememberMe)} />
                      Remember Me
                    </label>

                    {(!SubmitButton && !OTPSubmitButton) && <Row className="justify-content-center">
                      <Col md="3" key={Data[28].id}>
                        <div className="loader-box">
                          <Spinner attrSpinner={{ className: Data[28].spinnerClass }} />
                        </div>
                      </Col>
                    </Row>}

                    {SubmitButton &&
                      <Btn type="type" attrBtn={{ color: "primary", className: "d-block w-100 mt-2", onClick: (e) => loginAuth(e) }}>{SignIn}</Btn>
                    }


                    {OTPSubmitButton &&
                      <Btn type="type" attrBtn={{ color: "primary", className: "d-block w-100 mt-2", onClick: (e) => SubmitOTP(e) }}>{SignIn}</Btn>
                    }


                    {/* <Btn type="type" attrBtn={{ color: "primary", className: "d-block w-100 mt-2", onClick: (e) => forgetpassword(e) }} > Forget Password</Btn> */}
                    {/* <Col className="text-end mt-2 ">
                      <Link className='ms-2 ' to={`${process.env.PUBLIC_URL}/WevetelForgetPwd`}>
                        ForgetPassword
                      </Link>
                    </Col> */}
                  </div>

                  <OtherWay />

                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container >
      <ToastContainer />
    </Fragment >
  );
};

export default Signin;
