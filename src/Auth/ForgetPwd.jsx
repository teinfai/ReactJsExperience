import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { Btn, H4, H6, P, Image } from '../AbstractElements';
import SocketComponent from '../_helper/Socket/Function';
import tools from '../_helper/Utils/index';
import { ToastContainer, toast } from "react-toastify";


const ForgetPwd = () => {
  const [email, setEmail] = useState("");

  const CurrentDate = tools.DateTime.generateCustomDateTime();

  const handleChangeEmail = (event) => {
    const value = event.target.value;
    // console.log(value);
    setEmail(value);
  };

  const Socket = async (type, message, info = "") => {
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

  const ForgetPasswordRequest = async (e) => {
    var { UserNewHashedPassword, UserNewPassword } = tools.RandomPassword.GenerteRandomHashedPassword(8);

    if (!email) {
      toast.error("Please fill in Email ");
      return;
    }

    // console.log();

    const socketQuery1 = {
      action: 'ForgotPassword',
      email: email,
      CurrentDate: CurrentDate,
      UserNewHashedPassword: UserNewHashedPassword,
      SendEmail: { email: email, content: UserNewPassword },
    };

    // console.log(socketQuery1);


    const encryptedReturn = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(socketQuery1));
    const ReturnResult = await Socket("CloudSocket", encryptedReturn);
    // console.log(ReturnResult);
    setEmail("");
    // if (ReturnResult.status == "200" && ReturnResult.message == "UpdateSuccess") {
    toast.success("An email has been sent to " + email + ". Please check your inbox for the new password if you have a registered account.");
    // }
    // const sadaa = tools.EncryptionUtility.encrypt_decrypt('decrypt', "sDn7MgvLCx5cU2FsdGVkX18yWc2PWdEYolb9OQJ3yCgnMr+BNkCZW6GMdKHmU90vShsXpXqsqsUPk+MaBluG6F44LCpbDS65jc5gyBlbAdjMkthTAebTIf4=kzAPy1J4");

    // console.log("adasda", sadaa);
    // 
    // console.log("ReturnResult", ReturnResult);
    // sbc.wevo.my
    // Check User Exist in Wevo
    // const WssAddress = 'ws://' + DomainName + ':' + ReturnResult.content.host.wss;
  }


  // const [togglePassword, setTogglePassword] = useState(false);
  return (
    <Fragment>
      <section>
        <Container className='p-0 login-page' fluid={true}>
          <Row className='m-0'>
            <Col className='p-0'>
              <div className='login-card'>
                <div>
                  <div className='login-main'>
                    <Form className='theme-form login-form'>
                      <H4>Reset Your Password</H4>
                      <small> If an email is available, we'll send the new password through it.</small>
                      <FormGroup className='position-relative'>
                        <Label className='col-form-label m-0'>Email</Label>
                        <div className='position-relative'>
                          <Input
                            className='form-control'
                            type='text'
                            name='email'
                            required
                            placeholder='Email For New Password'
                            onChange={handleChangeEmail}
                            value={email}
                          />
                          {/* <div className='show-hide' onClick={() => setTogglePassword(!togglePassword)}>
                            <span className={togglePassword ? '' : 'show'}></span>
                          </div> */}
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Btn attrBtn={{ color: 'primary', className: 'btn d-block w-100', type: 'button', onClick: (e) => ForgetPasswordRequest(e) }} >Submit</Btn>
                      </FormGroup>
                      <P attrPara={{ className: 'text-start' }}>
                        Already have an password?
                        {/* <a className='ms-2' href='#javascript'>
                          Sign in
                        </a> */}

                        <Link className='ms-2' to={`${process.env.PUBLIC_URL}/login`}>
                          Sign in
                        </Link>
                      </P>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <ToastContainer />
    </Fragment >
  );
};

export default ForgetPwd;
