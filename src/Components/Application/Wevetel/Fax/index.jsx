
import React, { Fragment, useState, useEffect } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Card, CardBody, CardHeader, CardFooter, Col, Container, Row, Form, FormGroup, Label, Input } from 'reactstrap';
import { Btn, H5, P } from "../../../../AbstractElements";
import SocketComponent from '../../../../_helper/Socket/Function';
import { ToastContainer, toast } from "react-toastify";
import { InvalidEmailAddress, InputEmpty, InvalidFileType, FaxInstruction, Submit, Cancel, BasicFormControl, Fax, UploadFile, FaxHeader, EmailAddress, FaxDestination, LocalStationIdentifier, ExampleMultipleSelect, ExampleSelect, ExampleTextarea, Password } from '../../../../Constant';
import HeaderCard from '../../../Common/Component/HeaderCard';
// import FooterCard from '../../../Forms/FormControl/Common/FooterCard';

//tools
import tools from '../../../../_helper/Utils/index';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { UpdateFileContent, UpdateEmailFlag, UpdateFaxHeaderFlag, UpdateLocalStationIdentifierFlag, UpdateFaxDestinationFlag, UpdateFaxheader, UpdateLocalStationIdentifier, UpdateEmail, UpdateFaxDestination, UpdateFile } from "../../../../Store/reduxjs/fax";




export default function FaxInput() {

    const ws = JSON.parse(localStorage.ws);
    const WevoSocket = new SocketComponent({ url: ws });
    const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });
    const ext = JSON.parse(localStorage.device).ext;
    const email = JSON.parse(localStorage.login).email;
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
    const [LocalDestinationValue, setLocalDestination] = useState(ext);
    const [FaxEmailValue, setEmail] = useState(email);

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
        setEmail(value);
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



    const isSubmitDisabled = !!fax || !!FaxEmailValue == "" || LocalDestinationValue == "" || !!FaxDestinationFlag || !!FaxHeaderFlag; // Convert to boolean




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

        const query = {
            action: 'SendFax',
            data: {
                UpdatedFileContentValue: UpdatedFileContentValue,
                UpdatedLocalStationIdentifier: LocalDestinationValue,
                UpdatedEmail: FaxEmailValue,
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

        < Fragment  >

            {isContentVisible && (
                <Row className='p-5'>
                    <Card >
                        {/* <HeaderCard title={Fax} /> */}
                        <Form className="form theme-form">
                            <CardHeader>
                                <H5>{Fax}</H5><span>{FaxInstruction} </span >
                            </CardHeader>
                            <CardBody>

                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label htmlFor="FaxHeader">{FaxHeader}</Label>
                                            <Input className="form-control" onChange={handleFaxHeaderChange} type="text" placeholder="Fax" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label htmlFor="LocalStationIdentifier">{LocalStationIdentifier}</Label>
                                            <Input
                                                className="form-control"
                                                onChange={handleLocalStationIdentifierChange}
                                                type="text"

                                                placeholder="Local Station Identifier" value={LocalDestinationValue}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label htmlFor="EmailAddress">{EmailAddress}</Label>
                                            <Input className="form-control" onChange={handleEmailChange} value={FaxEmailValue} type="email" placeholder="name@example.com" />
                                            {isValid ? null : <p style={{ color: 'red' }}>{InvalidEmailAddress}</p>}
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup className="row">
                                            <Label className=" col-form-label"></Label>
                                            <Col>
                                                <Input
                                                    className="form-control"
                                                    type="file"
                                                    accept=".pdf, .tiff" // Specify the allowed file types
                                                    onChange={event => handleFileInput(event)}
                                                // onChange={handleUpdateFileChange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>

                            <CardFooter className="text-end" >
                                <button
                                    className="m-r-15 btn btn-primary"
                                    type="button"
                                    disabled={isSubmitDisabled}
                                    onClick={SendFax}
                                >
                                    {Submit}
                                </button>


                                <Btn attrBtn={{ color: "secondary", type: "button", }}>{Cancel}</Btn>
                            </CardFooter>
                            {/* <FooterCard footerClass="text-end" /> */}
                        </Form>
                    </Card>
                </Row>
            )}

            {!isContentVisible && (
                <Row className='p-5'>
                    <Card>
                        <CardBody>
                            {ErrorMessage}
                        </CardBody>
                    </Card>
                </Row>
            )}

            <ToastContainer />

        </Fragment >

    );
}
