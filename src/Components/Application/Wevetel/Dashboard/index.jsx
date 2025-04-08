import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { Breadcrumbs, H5, Image, LI, P, UL, H3 } from '../../../../AbstractElements';
import { Card, CardBody, CardHeader, CardFooter, Col, Container, Row } from 'reactstrap';
import ChatAppContext from '../../../../_helper/Chat';
// import { CALL, STATUS, PROFILE, Active, ChataApp_p1, ChataApp_p2, Following, Follower, MarkJecno } from '../../../../Constant';
import ReactPlayer from 'react-player';
import JsSIP from "jssip"
import VideoPlayer from '../videoplayer/video_player';
import ShowCall from './show_call';
import CallData from './call_data';
import { Button, Modal } from 'react-bootstrap';
import { configurations } from '../../../../_helper/Wevetel/SipCallFunction/Function';
import phone from '../../../../_helper/Wevetel/SipCallFunction/Function';
import CallNotification from '../../../../_helper/Wevetel/CallNotification/Function';
// import 'https://webrtc.github.io/adapter/adapter-latest.js';
import 'webrtc-adapter';
import SocketComponent from '../../../../_helper/Socket/Function';
import FetchData from '../../../../_helper/Wevetel/Dashboard/Function';
import tools from '../../../../_helper/Utils/index';




const DashboardContain = () => {

    const { allMemberss } = useContext(ChatAppContext);
    const [session, setSession] = useState(null)
    const [callername, setCallername] = useState(null)
    const [videostream, setVideoStream] = useState(null)
    const [userStream, setuserStream] = useState(null)
    const [showModal, setshowModal] = useState(false)
    const [showCall, setCall] = useState(false)
    const [MissCall_count, setMissCall_count] = useState(0)
    const [Outbound_count, setOutbound_count] = useState(0)
    const [Inbound_count, setInbound_count] = useState(0)
    const ref = React.useRef(null)
    const uservideoref = React.useRef(null)

    const device = JSON.parse(localStorage.device ?? '{}');

    const ws = localStorage.ws ? JSON.parse(localStorage.ws) : null;

    const WevoSocket = new SocketComponent({ url: ws });
    const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const fetchDataInstance = new FetchData();
        const dataResult = await fetchDataInstance.fetchdata();

        if (dataResult) {
            // Now you can use dataResult in this page
            // console.log(dataResult);
            setMissCall_count(dataResult.MissCall_count);
            setOutbound_count(dataResult.Outbound_count);
            setInbound_count(dataResult.Inbound_count);
        }
    };
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const query = {
    //             action: 'RetrieveCallData',
    //             ext: device.ext,
    //         };

    //         const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
    //         const DataResult = await callSocket("WevoSocket", encryptedQuery);

    //         // console.log(DataResult);
    //         if (DataResult?.status == "200" && DataResult?.data) {
    //             setInbound_count(DataResult.data.Inbound_count);
    //             setMissCall_count(DataResult.data.MissCall_count);
    //             setOutbound_count(DataResult.data.Outbound_count);
    //         }
    //     };
    //     fetchData();
    // }, [device.ext]);

    return (
        < Fragment >
            <Container fluid={true} >
                <Row className='py-5 justify-content-center mx-0'>
                    <Col md="4">
                        <Card className='bg-success'>
                            <CardBody>
                                <Row className='mx-0'>
                                    <h3>InBound Call</h3>
                                </Row>
                                <Row className='mx-0'>
                                    <h4>{Inbound_count}</h4>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className='bg-warning'>
                            <CardBody>
                                <Row className='mx-0'>
                                    <h3>OutBound Call</h3>
                                </Row>
                                <Row className='mx-0'>
                                    <h4>{Outbound_count}</h4>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className='bg-danger'>
                            <CardBody>
                                <Row className='mx-0'>
                                    <h3>Missed Call</h3>
                                </Row>
                                <Row className='mx-0'>
                                    <h4>{MissCall_count}</h4>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h3>Call History</h3>
                            </CardHeader>
                            <CardBody>
                                <CallData></CallData>
                            </CardBody>
                        </Card>
                    </Col>


                    {/* <ShowCall call={call} reject={reject} show={showCall} callername={callername}>
                    </ShowCall> */}




                    {/* {
                        videostream && (
                            <VideoPlayer stream={videostream} />
                        )
                    } */}

                    

                    {/* <video id="video" autoplay playsinline src={videostream} ></video>
                    <VideoPlayer /> */}


                </Row>
            </Container >

        </Fragment >
    );
};




export default DashboardContain;