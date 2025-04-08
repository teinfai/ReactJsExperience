import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { Breadcrumbs, H5, Image, LI, P, UL, H3 } from '../../../../AbstractElements';
import { Card, CardBody, CardHeader, CardFooter, Col, Container, Row } from 'reactstrap';

const ShowCall = (props) => {
    const { call, reject, videocall, micOn, micOff, mute, mic, onHoldStatus, onHold, unhold, holdStyle, callStatus, status, transfer } = props;
    const [inputValue, setInputValue] = useState('');
    const [transferValue, setTransferValue] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    const inputnumber = (num) => {
        setInputValue((prevValue) => prevValue + num);
    };

    const delnumber = () => {
        setInputValue((prevValue) => prevValue.slice(0, -1));
    };

    const inputvalue = (event) => {
        setInputValue(event.target.value);
    }

    const transfernumber = (num) => {
        setTransferValue((prevValue) => prevValue + num);
    };

    const deltransnumber = () => {
        setTransferValue((prevValue) => prevValue.slice(0, -1));
    };

    const transfervalue = (event) => {
        setTransferValue(event.target.value);
    }

    const transferCallHide = () => {
        setIsVisible(!isVisible);
    }

    if (callStatus == "end") {
        if (onHoldStatus == "hold") {
            unhold();
        }

        if (mute == 'mute') {
            micOn();
        }
    }

    return (
        < Fragment >
            {isVisible ? (
                !props.show ? (
                    // <Col xs="12" md="6" className='mt-md-0 mt-4'>
                    <Row className='justify-content-center mx-0'>
                        <Col xs="12">
                            <Card style={{ height: '100%' }}><CardBody>
                                <Row className='mx-0'>
                                    <input className='text-center' type="tel" onInput={inputvalue} value={inputValue} style={{ width: '100%', 'fontSize': '50px', border: '0', 'WebkitAppearance': 'none', 'wordWrap': 'break-word' }} />
                                </Row>
                                <Row className='justify-content-end mx-0'>
                                    <Col xs="4" className='text-center my-5 px-0'><button onClick={() => inputnumber('1')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>1</button></Col>
                                    <Col xs="4" className='text-center my-5 px-0'><button onClick={() => inputnumber('2')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>2</button></Col>
                                    <Col xs="4" className='text-center my-5 px-0'><button onClick={() => inputnumber('3')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>3</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('4')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>4</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('5')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>5</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('6')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>6</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('7')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>7</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('8')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>8</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('9')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>9</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('#')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>#</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('0')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>0</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => inputnumber('*')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>*</button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => videocall(inputValue)} className='btn-success p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z" /></svg>
                                    </button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => call(inputValue)} className='btn-success p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-phone' ></i></button></Col>
                                    <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => delnumber()} className='btn p-4'><span><i className='fa fa-undo' ></i></span></button></Col>
                                </Row>
                            </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    // </Col>
                ) :
                    <Col xs="12">
                        <Row className='justify-content-center mx-0' style={{ height: '100%' }}>
                            <Col xs="12" >
                                <Card style={{ height: '100%' }}>
                                    <CardBody style={{ height: '430px' }}>
                                        <Row className='mx-0'>
                                            <input type="text" readOnly value={props.callername ? props.callername : inputValue} style={{ width: '100%', 'textAlign': 'center', 'fontSize': '50px', border: '0', 'WebkitAppearance': 'none', 'wordWrap': 'break-word' }} />
                                        </Row>
                                        <Row className='mx-0'>
                                            <div style={{ width: '100%', 'textAlign': 'center', 'fontSize': '20px', border: '0', 'WebkitAppearance': 'none', 'wordWrap': 'break-word' }}>
                                                {status ? status : ""}
                                            </div>
                                        </Row>
                                    </CardBody>
                                    <CardFooter className='px-0'>
                                        <Row className='justify-content-center mx-0'>
                                            <Col xs="3" className='text-center mb-5 px-0'>
                                                {mute == 'mute' ?
                                                    <button onClick={micOn} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: mic.background }}>
                                                        <i className={mic.icon} style={{ color: mic.color, fontSize: '20px' }} ></i>
                                                    </button>
                                                    :
                                                    <button onClick={micOff} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: mic.background }}>
                                                        <i className={mic.icon} style={{ color: mic.color, fontSize: '20px' }} ></i>
                                                    </button>
                                                }
                                            </Col>
                                            <Col xs="3" className='text-center mb-5 px-0'><button onClick={transferCallHide} className='btn-info p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-share' ></i></button></Col>
                                            <Col xs="3" className='text-center mb-5 px-0'><button onClick={reject} className='btn-danger p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-phone' ></i></button></Col>
                                            <Col xs="3" className='text-center mb-5 px-0'>
                                                {onHoldStatus == 'hold' ?
                                                    <button onClick={unhold} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: holdStyle.background }}>
                                                        <i className={holdStyle.icon} style={{ color: holdStyle.color, fontSize: '20px' }} ></i>
                                                    </button>
                                                    :
                                                    <button onClick={onHold} className='btn p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', border: '1px solid #636363', background: holdStyle.background }}>
                                                        <i className={holdStyle.icon} style={{ color: holdStyle.color, fontSize: '20px' }} ></i>
                                                    </button>
                                                }
                                            </Col>
                                            {/* <Col xs="4" className='text-center mb-5 px-0'><button onClick={onHold} className='btn-danger p-4' style={{ 'width': '70px', 'height': 'auto', 'border-radius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-phone' ></i></button></Col> */}
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
            ) : (
                < Row className='justify-content-center mx-0'>
                    <Col xs="12">
                        <Card style={{ height: '100%' }}><CardBody>
                            <Row className='mx-0'>
                                <input className='text-center' type="tel" onInput={transfervalue} value={transferValue} style={{ width: '100%', 'fontSize': '50px', border: '0', 'WebkitAppearance': 'none', 'wordWrap': 'break-word' }} />
                            </Row>
                            <Row className='justify-content-end mx-0'>
                                <Col xs="4" className='text-center my-5 px-0'><button onClick={() => transfernumber('1')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>1</button></Col>
                                <Col xs="4" className='text-center my-5 px-0'><button onClick={() => transfernumber('2')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>2</button></Col>
                                <Col xs="4" className='text-center my-5 px-0'><button onClick={() => transfernumber('3')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>3</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('4')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>4</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('5')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>5</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('6')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>6</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('7')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>7</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('8')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>8</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('9')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>9</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('#')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>#</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('0')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>0</button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfernumber('*')} className='btn-outline-light p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}>*</button></Col>
                                <Col xs="3" className='text-center mb-5 px-0'><button onClick={transferCallHide} className='btn-danger p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-backward' ></i></button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => transfer(transferValue)} className='btn-success p-4' style={{ 'width': '70px', 'height': 'auto', 'borderRadius': '50%', 'border': '1px solid #5A5A5A' }}><i className='fa fa-share' ></i></button></Col>
                                <Col xs="4" className='text-center mb-5 px-0'><button onClick={() => deltransnumber()} className='btn p-4'><span><i className='fa fa-undo' ></i></span></button></Col>
                            </Row>
                        </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
        </Fragment >
    );
};

export default ShowCall;