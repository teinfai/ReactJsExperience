import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Row, Media, Label, Input, Col, Form, FormGroup, Card } from 'reactstrap';
import { Btn, H5, H6, Image, LI, P, UL } from '../../../../../AbstractElements';
import { NewMessage, To, ATTACHMENTS, DownloadAll, Reply, ReplyAll, Forward, Send, Messages, Subject } from '../../../../../Constant';
import CKEditor from 'react-ckeditor-component';
import email1 from '../../../../../assets/images/email/1.jpg';
import email2 from '../../../../../assets/images/email/2.jpg';
import email3 from '../../../../../assets/images/email/3.jpg';
import EmailContext from '../../../../../_helper/Email';
import SocketComponent from '../../../../../_helper/Socket/Function';
import { ToastContainer, toast } from "react-toastify";
import { InvalidEmailAddress, InputEmpty, InvalidFileType, FaxInstruction, Submit, Cancel, BasicFormControl, Fax, UploadFile, FaxHeader, EmailAddress, FaxDestination, LocalStationIdentifier, ExampleMultipleSelect, ExampleSelect, ExampleTextarea, Password } from '../../../../../Constant';
import HeaderCard from '../../../../Common/Component/HeaderCard';
// import FooterCard from '../../../Forms/FormControl/Common/FooterCard';

//tools
import tools from '../../../../../_helper/Utils/index';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { UpdateFileContent, UpdateEmailFlag, UpdateFaxHeaderFlag, UpdateLocalStationIdentifierFlag, UpdateFaxDestinationFlag, UpdateFaxheader, UpdateLocalStationIdentifier, UpdateEmail, UpdateFaxDestination, UpdateFile } from "../../../../../Store/reduxjs/fax";



var images = require.context('../../../../../assets/images', true);

const MailContain = () => {
  const { singleMailRecord, compose } = useContext(EmailContext);
  const dynamicImage = (image) => {
    return images(`./${image}`);
  };

  const ws = JSON.parse(localStorage.ws);
  const WevoSocket = new SocketComponent({ url: ws });
  const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });
  const dispatch = useDispatch();

  //Flag State
  const fax = useSelector((state) => state.fax.FileFlag);
  const EmailFlag = useSelector((state) => state.fax.EmailFlag);
  const FaxHeaderFlag = useSelector((state) => state.fax.FaxHeaderFlag);
  const LocalStationIdentifierFlag = useSelector((state) => state.fax.LocalStationIdentifierFlag);
  const FaxDestinationFlag = useSelector((state) => state.fax.UpdateFaxDestinationFlag);

  // Content State
  const UpdatedFileContentValue = useSelector((state) => state.fax.FileContent);
  const UpdatedLocalStationIdentifier = useSelector((state) => state.fax.LocalStationIdentifier);
  const UpdatedEmail = useSelector((state) => state.fax.Email);
  const UpdatedFaxDestination = useSelector((state) => state.fax.FaxDestination);
  const UpdatedFaxheader = useSelector((state) => state.fax.Faxheader);
  // const UpdatedFile = useSelector((state) => state.fax.File);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const [ErrorMessage, setErrorMessage] = useState("");

  //error state
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    // Call the function when the component mounts
    CheckFaxRequirement();
  }, []);


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


  const CheckFaxRequirement = async () => {
    const query = {
      action: 'CheckFaxRequirement',
      data: {},
    };
    const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
    const CheckResult = await callSocket("WevoSocket", encryptedQuery);

    // console.log(CheckResult);

    if (CheckResult.status == "200") {
      setIsContentVisible(true);
    } else {
      setErrorMessage(CheckResult.message);
      setIsContentVisible(false);
    }
  };

  const [FaxDestinationValue, setFaxDestination] = useState('');
  const [LocalDestinationValue, setLocalDestination] = useState('');

  const handleFaxHeaderChange = ({ target: { value } }) => {
    dispatch(UpdateFaxHeaderFlag(value ? false : true))
    dispatch(UpdateFaxheader(value));
  };

  const handleLocalStationIdentifierChange = ({ target: { value } }) => {
    const LocalStationPattern = value;
    const LocalStationValue = LocalStationPattern.replace(/[^\d+]/g, '');

    setLocalDestination(LocalStationValue)
    dispatch(UpdateLocalStationIdentifierFlag(value ? false : true))
    dispatch(UpdateLocalStationIdentifier(LocalStationValue));
  };

  const handleEmailChange = ({ target: { value } }) => {
    const emailPattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValidEmail = emailPattern.test(value);
    // console.log(event.target.value);
    setIsValid(isValidEmail);
    dispatch(UpdateEmailFlag(isValidEmail ? false : true));
    dispatch(UpdateEmail(value));
  };


  const handleFaxDestinationChange = ({ target: { value } }) => {
    const inputNumber = value;
    // Remove non-numeric characters using a regular expression
    const numericValue = inputNumber.replace(/[^0-9]/g, '');
    setFaxDestination(numericValue);
    dispatch(UpdateFaxDestinationFlag(value ? false : true))
    dispatch(UpdateFaxDestination(numericValue));
  };



  const isSubmitDisabled = !!fax || !!EmailFlag || !!LocalStationIdentifierFlag || !!FaxDestinationFlag || !!FaxHeaderFlag; // Convert to boolean

  const handleFileInput = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const allowedTypes = ["application/pdf", "image/tiff"]; // Define the allowed MIME types
      if (allowedTypes.includes(selectedFile.type)) {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const fileContentArrayBuffer = event.target.result;
          const fileContentBase64 = tools.Encode64.Encode64Content(fileContentArrayBuffer);

          try {
            const Encode64results = await fileContentBase64;

            const fileData = {
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
              content: Encode64results, // Now it's a serializable string
            };

            dispatch(UpdateFileContent(fileData));
            dispatch(UpdateFile(false));

          } catch (error) {
            console.error("Error:", error); // Handle errors if needed
          }
        };

        // Read the file content as an ArrayBuffer
        reader.readAsArrayBuffer(selectedFile);
      } else {
        dispatch(UpdateFile(true));
        toast.error("Invalid file type. Please select a PDF or TIFF file.");
      }
    }
  };



  const SendFax = async () => {
    // console.log("2");
    const query = {
      action: 'SendFax',
      data: {
        UpdatedFileContentValue: UpdatedFileContentValue,
        UpdatedLocalStationIdentifier: UpdatedLocalStationIdentifier,
        UpdatedEmail: UpdatedEmail,
        UpdatedFaxDestination: UpdatedFaxDestination,
        UpdatedFaxheader: UpdatedFaxheader,
      },
    };

    // console.log(query);

    const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
    const callResult = await callSocket("WevoSocket", encryptedQuery);

    if (callResult.status == "200") {
      toast.success("Fax has been sent !");
    } else {
      toast.success("Fax send failed, Please contract admin");
      console.error("Socket call failed.");
    }
  };




  return (
    <Fragment>
      <Col xl='8' md='12' className='box-md-12 pl-0'>
        <div className='email-right-aside'>
          <div className='email-body radius-left'>
            <div className='ps-0'>
              <div className='tab-content'>
                <div className={`tab-pane fade ${compose ? 'active show' : ''}`} id='pills-darkhome' role='tabpanel' aria-labelledby='pills-darkhome-tab'>
                  <div className='email-compose'>

                    <div className='email-top'>
                      <Row>
                        <Col sm='8 xl-50'>
                          <H5>{Fax}</H5>
                        </Col>
                        <Col sm='4 xl-50' className='btn-middle text-end'>

                          <Btn attrBtn={{ color: 'primary', disabled: isSubmitDisabled, onClick: SendFax, className: 'btn-mail text-center mb-0 mt-0' }}>
                            <i className='fa fa-paper-plane me-2'></i>
                            {Send}
                          </Btn>
                        </Col>
                      </Row>
                    </div>

                    <div className='email-wrapper'>
                      <Form className='theme-form'>
                        <FormGroup>
                          <Label htmlFor="FaxHeader">{FaxHeader}</Label>
                          <Input className="form-control" onChange={handleFaxHeaderChange} type="text" placeholder="Fax" />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="LocalStationIdentifier">{LocalStationIdentifier}</Label>
                          <Input
                            className="form-control"
                            onChange={handleLocalStationIdentifierChange}
                            type="text"
                            placeholder="Local Station Identifier" value={LocalDestinationValue}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="EmailAddress">{EmailAddress}</Label>
                          <Input className="form-control" onChange={handleEmailChange} type="email" placeholder="name@example.com" />
                          {isValid ? null : <p style={{ color: 'red' }}>{InvalidEmailAddress}</p>}
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="FaxDestination">{FaxDestination}</Label>
                          <Input
                            className="form-control"
                            onChange={handleFaxDestinationChange}
                            type="text"
                            placeholder="Fax Destination"
                            pattern="[0-9]*"  // Allow only numeric input
                            inputMode="numeric" // Enable numeric input mode on virtual keyboards
                            value={FaxDestinationValue}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Input
                            className="form-control"
                            type="file"
                            accept=".pdf, .tiff" // Specify the allowed file types
                            onChange={event => handleFileInput(event)}
                          // onChange={handleUpdateFileChange}
                          />
                        </FormGroup>
                        {/* <div>
                          <Label className='text-muted'>{Messages}</Label>
                          <CKEditor className='email-compose-ck' activeclassName='p10' />
                        </div> */}
                      </Form>
                    </div>

                  </div>
                </div>
                <div className={`tab-pane fade ${compose !== true ? 'active show' : ''}`}>
                  <div className='email-content'>
                    <div className='email-top'>
                      <Row>
                        <Col md='6 xl-100' sm='12'>
                          <Media className='align-items-center'>
                            <Image attrImage={{ className: 'me-3 rounded-circle img-50', src: `${singleMailRecord.image ? dynamicImage(singleMailRecord.image) : ''}`, alt: '' }} />
                            <Media body>
                              <H6>
                                {singleMailRecord.name}{' '}
                                <small>
                                  <span className='digits'>({singleMailRecord.date})</span> <span className='digits'>6:00</span> AM
                                </small>
                              </H6>
                              <P>{singleMailRecord.cc}</P>
                            </Media>
                          </Media>
                        </Col>
                        <Col md='6' sm='12'>
                          <div className='float-end d-flex'>
                            <P attrPara={{ className: 'user-emailid' }}>
                              {'Lormlpsa'}
                              <span className='digits'>{'23'}</span>
                              {'@company.com'}
                            </P>
                            <i className={`fa fa-star-o f-18 mt-1 ${singleMailRecord.favourite ? 'starred' : ''} `}></i>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className='email-wrapper'>
                      <P>{'Hello'}</P>
                      <P>{'Dear Sir Good Morning'},</P>
                      <H5>{'Elementum varius nisi vel tempus. Donec eleifend egestas viverra.'}</H5>
                      <P attrPara={{ className: 'm-b-20' }}>
                        {
                          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non diam facilisis, commodo libero et, commodo sapien. Pellentesque sollicitudin massa sagittis dolor facilisis, sit amet vulputate nunc molestie. Pellentesque maximus nibh id luctus porta. Ut consectetur dui nec nulla mattis luctus. Donec nisi diam, congue vitae felis at, ullamcorper bibendum tortor. Vestibulum pellentesque felis felis. Etiam ac tortor felis. Ut elit arcu, rhoncus in laoreet vel, gravida sed tortor.'
                        }
                      </P>
                      <P>{'In elementum varius nisi vel tempus. Donec eleifend egestas viverra. Donec dapibus sollicitudin blandit. Donec scelerisque purus sit amet feugiat efficitur. Quisque feugiat semper sapien vel hendrerit. Mauris lacus felis, consequat nec pellentesque viverra, venenatis a lorem. Sed urna lectus.Quisque feugiat semper sapien vel hendrerit'}</P>
                      <hr />
                      <div className='d-inline-block'>
                        <H6 className='text-muted'>
                          <i className='icofont icofont-clip'></i> {ATTACHMENTS}
                        </H6>
                        <a className='text-muted text-end right-download' href='#javascript'>
                          <i className='fa fa-long-arrow-down me-2'></i>
                          {DownloadAll}
                        </a>
                        <div className='clearfix'></div>
                      </div>
                      <div className='attachment'>
                        <UL attrUL={{ className: 'list-inline d-flex flex-row' }}>
                          <LI attrLI={{ className: 'list-inline-item border-0' }}>
                            <Image attrImage={{ className: 'img-fluid', src: `${email1}`, alt: '' }} />
                          </LI>
                          <LI attrLI={{ className: 'list-inline-item border-0' }}>
                            <Image attrImage={{ className: 'img-fluid', src: `${email2}`, alt: '' }} />
                          </LI>
                          <LI attrLI={{ className: 'list-inline-item border-0' }}>
                            <Image attrImage={{ className: 'img-fluid', src: `${email3}`, alt: '' }} />
                          </LI>
                        </UL>
                      </div>
                      <hr />
                      <div className='action-wrapper'>
                        <UL attrUL={{ className: 'actions flex-row' }}>
                          <LI arreLI={{ className: 'border-0' }}>
                            <a className='text-muted' href='#javascript'>
                              <i className='fa fa-reply me-2'></i>
                              {Reply}
                            </a>
                          </LI>
                          <LI arreLI={{ className: 'border-0' }}>
                            <a className='text-muted' href='#javascript'>
                              <i className='fa fa-reply-all me-2'></i>
                              {ReplyAll}
                            </a>
                          </LI>
                          <LI arreLI={{ className: 'border-0' }}>
                            <a className='text-muted' href='#javascript'>
                              <i className='fa fa-share me-2'></i>
                            </a>
                            {Forward}
                          </LI>
                        </UL>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <ToastContainer />
    </Fragment>
  );
};
export default MailContain;
