import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'reactstrap';
import telephone from "../../../../_helper/Wevetel/SipCallFunction/telephone"

const YourComponent = (props) => {
    const { micOn, micOff, camOn, camOff, endVideo, mic, camera, isEnd, stream, direction, mute, muteAudio, localStream } = props;

    // console.log(mute);
    let newStream = null;
    const userRef = useRef(null);
    const videoRef = useRef(null);
    const [userStream, setUserStream] = useState(null);
    const [localStreams, setLocalStream] = useState(null);

    const mediaStreamConstraints = { audio: true, video: true };

    const stopTracks = (stream) => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    };

    const endVideoCall = async () => {
        await endVideo();
        stopTracks(userStream);
        stopTracks(localStreams);
        stopTracks(localStream);
    };



    useEffect(() => {
        const getLocalVideoStream = async () => {
            try {
                // const localStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
                videoRef.current.srcObject = localStream;
                setLocalStream(localStream);
            } catch (error) {
                console.error('Error accessing local video stream:', error);
            }
        };

        const showRemoteVideoStream = (remoteStream) => {
            // console.log("in", remoteStream);
            const tele = telephone;

            if (remoteStream) {
                let video_obj = document.getElementById("remoteCam")
                newStream = new MediaStream();
                // video_obj.srcObject = tele.telephony.telephone.remotestream;
                // console.log("remote", tele.telephony.telephone.remotestream.getTracks())
                // console.log(userRef.current.srcObject)
                // console.log(document.getElementById("remoteCam"))

                try {
                    userRef.current.addEventListener('loadedmetadata', () => {
                        // console.log('Remote Video Metadata Loaded');
                    });
                    // remoteStream.getTracks().forEach((track) => {
                    //     newStream.addTrack(track);
                    // });

                    tele.telephony.telephone.remotestream.getTracks().forEach(element => {
                        if (element.kind == "video") {
                            video_obj.srcObject = tele.telephony.telephone.remotestream
                        }
                    });

                    // webcamVideo.srcObject = newStream;
                    // video_obj.play()

                } catch (error) {
                    console.log('Error accessing remote video stream:', error);
                }
            }
        };

        if (isEnd === "calling") {
            // camOn();
            getLocalVideoStream();
            showRemoteVideoStream(stream);
            // setTimeout(() => {
            //     camOff();
            // }, 3000);
        }

        if (isEnd == 'end') {
            camOn();
            micOn();
            stopTracks(userStream);
            stopTracks(localStream);
            stopTracks(localStreams);
        }

        return () => {
            stopTracks(userStream);
            stopTracks(localStream);
            stopTracks(localStreams);
        };
    }, [stream, isEnd]);



    return (
        <div>
            <Row>
                <div className='row mx-0'>
                    <div className="col-12 px-0">
                        <video id="remoteCam" ref={userRef} className='w-100' autoPlay muted playsInline></video>
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', right: '0' }} className="col-4">
                        <video ref={videoRef} className='w-100' autoPlay playsInline></video>
                    </div>
                </div>
            </Row>
            <Row className='justify-content-center'>
                <Col xs='6'>
                    <Row className='justify-content-between mx-0'>
                        <Col className='text-center my-3 px-0'>
                            {muteAudio == "mute" ?
                                <button onClick={micOn} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: mic.background }}>
                                    <i className={mic.icon} style={{ color: mic.color, fontSize: '20px' }} ></i>
                                </button>
                                :
                                <button onClick={micOff} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: mic.background }}>
                                    <i className={mic.icon} style={{ color: mic.color, fontSize: '20px' }} ></i>
                                </button>
                            }
                        </Col>
                        <Col className='text-center my-3 px-0'>
                            {mute == "mute" ?
                                <button onClick={camOn} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: camera.background }}>
                                    <svg style={{ fill: camera.color }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                        <path d="M633.8 458.1l-55-42.5c15.4-1.4 29.2-13.7 29.2-31.1v-257c0-25.5-29.1-40.4-50.4-25.8L448 177.3v137.2l-32-24.7v-178c0-26.4-21.4-47.8-47.8-47.8H123.9L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4L42.7 82 416 370.6l178.5 138c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.5-6.9 4.2-17-2.8-22.4zM32 400.2c0 26.4 21.4 47.8 47.8 47.8h288.4c11.2 0 21.4-4 29.6-10.5L32 154.7v245.5z" />
                                    </svg>
                                </button> :
                                <button onClick={camOff} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: camera.background }}>
                                    <svg style={{ fill: camera.color }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                        <path d="M633.8 458.1l-55-42.5c15.4-1.4 29.2-13.7 29.2-31.1v-257c0-25.5-29.1-40.4-50.4-25.8L448 177.3v137.2l-32-24.7v-178c0-26.4-21.4-47.8-47.8-47.8H123.9L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4L42.7 82 416 370.6l178.5 138c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.5-6.9 4.2-17-2.8-22.4zM32 400.2c0 26.4 21.4 47.8 47.8 47.8h288.4c11.2 0 21.4-4 29.6-10.5L32 154.7v245.5z" />
                                    </svg>
                                </button>
                            }
                        </Col>
                        <Col className='text-center my-3 px-0'>
                            <button onClick={endVideoCall} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid red' }}>
                                <i className='fa fa-phone' style={{ color: 'red', fontSize: '20px' }} ></i>
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default YourComponent;
