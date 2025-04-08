import React from "react";
import { Facebook, Linkedin, Twitter } from "react-feather";
import { Link } from "react-router-dom";
import { H6, P, Btn } from "../AbstractElements";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MicrosoftLogin } from "react-microsoft-login";
import { useSelector, useDispatch } from "react-redux";
import { LoginAuth } from "../Store/reduxjs/login";
import { ToastContainer, toast } from "react-toastify";


const OtherWay = () => {
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async credentialResponse => {
      // Your access token
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${credentialResponse.access_token}` } },
      );


      // console.log(userInfo);

      dispatch(LoginAuth(userInfo.data.email));
      toast.success("Please Fill Domain Name");
      // Decode the access token
      // const decoded = jwtDecode(UserDetail.credential, { header: true });
      // console.log(decoded); 
    },
    onError: () => {
      toast.error("Google Login error");
      // console.log('Login Failed');
    },
  });

  const handleMicrosoftLogin = (err, data) => {
    if (err) {
      // console.log('Microsoft Login Failed', err);
      toast.error("Microsoft Login Failed");
    } else {
      // Handle Microsoft login success
      const MicrsoftLoginReturn = data;
      dispatch(LoginAuth(MicrsoftLoginReturn.idTokenClaims.preferred_username));
      toast.success("Please Fill Domain Name");
      // console.log(MicrsoftLoginReturn.idTokenClaims.preferred_username);
    }
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //   }
  // };

  return (
    <>
      <div className="login-social-title">
        <H6 attrH6={{ className: "text-muted or mt-4" }}>Or Sign up with</H6>
      </div>
      <div className="social my-4 ">
        <div className="btn-showcase">
          {/* <a className="btn btn-light" href="https://www.linkedin.com/login" rel="noreferrer" target="_blank">
            <Linkedin className="txt-linkedin" /> LinkedIn
          </a>
          <a className="btn btn-light" href="https://twitter.com/login?lang=en" rel="noreferrer" target="_blank">
            <Twitter className="txt-twitter" />
            twitter
          </a> */}
          <Row>
            <Col xs="6" className="text-center">
              {/* <a className="btn btn-light text-truncate" href="https://www.google.com/" rel="noreferrer" target="_blank"><span><i className="fa fa-google pe-2"></i></span>
                Google
              </a> */}
              <Btn type="type" attrBtn={{ color: "primary", className: "d-block w-100 mt-2", onClick: (e) => login(e) }}><span><i className="fa fa-google pe-2"></i></span>Google</Btn>

            </Col>
            <Col xs="6" className="text-center">
              {/* <a className="btn btn-light text-truncate" href="https://www.microsoft.com/" rel="noreferrer" target="_blank">
                <span><i className="fa fa-windows pe-2"></i></span>
                Microsoft
              </a> */}

              <MicrosoftLogin
                clientId="d7e83a77-f46d-4487-a8d0-8fcfca67c3dc"
                authCallback={handleMicrosoftLogin}
              // redirectUri="http://localhost:3000/webphone/login"
              >

                {/* <Btn type="type" attrBtn={{ color: 'primary', className: 'd-block w-100 mt-2', onkeydown: handleKeyDown, }}> */}
                <Btn type="type" attrBtn={{ color: 'primary', className: 'd-block w-100 mt-2' }}>
                  <span>
                    <i className="fa fa-windows pe-2"></i>
                  </span>
                  Microsoft
                </Btn>
              </MicrosoftLogin>


              {/* <MicrosoftLogin clientId={'be00faf5-3c58-415f-be15-f5199d7d74e8'} /> */}
              {/* <MicrosoftLogin
                clientId={'d7e83a77-f46d-4487-a8d0-8fcfca67c3dc'}
                authCallback={handleMicrosoftLogin}
              /> */}

              {/* <Btn type="type" attrBtn={{ color: "primary", className: "d-block w-100 mt-2", onClick: (e) => login(e) }}><span><i className="fa fa-windows pe-2"></i></span>Microsoft</Btn> */}

            </Col>
            {/* <div className="col-md-6 text-center ">
              <a className="btn btn-light" href="https://www.microsoft.com/" rel="noreferrer" target="_blank">
                <span><i className="fa fa-windows pe-2"></i></span>
                Microsoft
              </a>
            </div> */}
          </Row>
        </div>
      </div >
      {/* <P attrPara={{ className: "text-center mb-0 " }}>
        Don't have account?
        <Link className="ms-2" to={`${process.env.PUBLIC_URL}/pages/authentication/register-simple`}>
          Create Account
        </Link>
      </P> */}
    </>
  );
};

export default OtherWay;
