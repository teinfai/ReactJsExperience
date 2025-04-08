import React, { Fragment, useEffect, useState, useContext } from "react";
import { Btn, H4 } from "../../../../../AbstractElements";
import { useForm } from "react-hook-form";
import { Row, Col, CardHeader, Card, CardBody, CardFooter, Form, FormGroup, Label, Input } from 'reactstrap'
import { EditProfile, Company, Username, UsersCountryMenu, AboutMe, UpdateProfile, FirstName, LastName, Address, EmailAddress, PostalCode, Country, City } from '../../../../../Constant';
import { Modal } from 'react-bootstrap';
import SocketComponent from '../../../../../_helper/Socket/Function';
import tools from '../../../../../_helper/Utils/index';
import { ToastContainer, toast } from "react-toastify";
import CustomizerContext from "../../../../../_helper/Customizer";
import { useNavigate } from "react-router-dom";


const EditMyProfile = () => {
    const WevoSocket = new SocketComponent({ url: process.env.REACT_APP_SOCKET });
    const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });
    const profile_device = JSON.parse(localStorage.device);
    const profile_email = JSON.parse(localStorage.login).email;
    const { layoutURL } = useContext(CustomizerContext);
    const history = useNavigate();

    const [formData, setFormData] = useState({
        email: profile_email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onEditSubmit = async (e) => {
        const Socket = async (type, message) => {
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

        if (formData.newPassword === formData.confirmPassword) {
            try {
                const changePass = {
                    action: 'ChangePassword',
                    data: {
                        email: profile_email,
                        currentPassword: tools.RandomPassword.HashedPassword(formData.currentPassword),
                        newPassword: tools.RandomPassword.HashedPassword(formData.newPassword),
                        confirmPassword: tools.RandomPassword.HashedPassword(formData.confirmPassword)
                    }
                };

                const changePassword = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(changePass));
                const changePasswordReturn = await Socket("CloudSocket", changePassword);

                if (changePasswordReturn.status == 200) {
                    history(`${process.env.PUBLIC_URL}/wevetel/edit_profile/${layoutURL}`);
                    toast.success('Password has been changed');
                } else {
                    toast.error(changePasswordReturn.message);
                }

            } catch (error) {
                toast.error("Contact Admin");
                return;
            }
        } else {
            toast.error("New password and confirm password do not match");
        }


    };

    const [showModal, setshowModal] = useState(false);
    const openModal = () => {
        setshowModal(true);
    };
    const closeModal = () => {
        setshowModal(false);
    };



    return (
        <Fragment>

            <Card>
                <CardBody>
                    <Row>
                        <Col sm="12" md="6">
                            <FormGroup> <Label className="form-label">Device ID</Label>
                                <Input className="form-control" type="text" placeholder="Device ID" value={profile_device.id} readOnly />
                            </FormGroup>
                        </Col>
                        <Col sm="12" md="6">
                            <FormGroup> <Label className="form-label">Extension</Label>
                                <Input className="form-control" type="text" placeholder="Extension" value={profile_device.ext} readOnly />
                            </FormGroup>
                        </Col>
                        <Col sm="12" md="6">
                            <FormGroup> <Label className="form-label">{EmailAddress}</Label>
                                <Input className="form-control" type="email" placeholder="Email" value={profile_email} readOnly />
                            </FormGroup>
                        </Col>
                        <Col sm="12" md="6">
                            <FormGroup> <Label className="form-label">Domain</Label>
                                <Input className="form-control" type="text" placeholder="Domain" value={localStorage.domain} readOnly />
                            </FormGroup>
                        </Col>
                        {false &&
                            <Col sm="12" className="mt-3">
                                {/* <Btn onClick={() => openModal()} attrBtn={{ color: "primary", type: "button" }} >Change Password</Btn> */}
                                <button type="button" className="btn btn-primary" onClick={() => openModal()} >Change Password</button>
                            </Col>
                        }
                    </Row>
                </CardBody>
            </Card>
            {/* <CardFooter className="text-end">
                    <Btn attrBtn={{ color: "primary", type: "submit" }} >{UpdateProfile}</Btn>
                </CardFooter> */}
            <Modal show={showModal} centered>
                <Form>
                    <Modal.Body>
                        <h3 className="mb-4">Change Password</h3>
                        <Col sm="12">
                            <FormGroup>
                                <Label className="form-label">Current Password</Label>
                                <Input
                                    className="form-control"
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Current Password"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label className="form-label">New Password</Label>
                                <Input
                                    className="form-control"
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="New Password"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label className="form-label">Confirm Password</Label>
                                <Input
                                    className="form-control"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                />
                            </FormGroup>
                        </Col>
                    </Modal.Body>
                    <Modal.Footer>
                        <Col sm="3" className="mt-3">
                            <button type="button" className="btn btn-danger" onClick={() => closeModal()}>
                                Close
                            </button>
                        </Col>
                        <Col sm="3" className="mt-3">
                            <button type="button" className="btn btn-success" onClick={onEditSubmit}>
                                Submit
                            </button>
                        </Col>
                    </Modal.Footer>
                </Form>
            </Modal>


        </Fragment >
    )
}
export default EditMyProfile