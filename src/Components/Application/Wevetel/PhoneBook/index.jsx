
import React, { Fragment, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Card, CardBody, CardHeader, CardFooter, Col, Container, Row } from 'reactstrap';
import { Tag } from 'primereact/tag';
import SocketComponent from '../../../../_helper/Socket/Function';
import tools from '../../../../_helper/Utils/index';
import { Button } from 'primereact/button';
import sip from '../../../../_helper/Wevetel/SipCallFunction/telephone';
import { Modal } from 'react-bootstrap';
import ShowCall from '../../../../Components/Application/Wevetel/Dashboard/show_call';
import phone from '../../../../_helper/Wevetel/SipCallFunction/Function';
import JsSIP from "jssip";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { showmodal } from "../../../../Store/reduxjs/modal";
import { showIncoming } from "../../../../Store/reduxjs/incoming";
import { showExt } from "../../../../Store/reduxjs/ext";
import { showSession } from "../../../../Store/reduxjs/session";
import { showCall } from "../../../../Store/reduxjs/call";

export default function AdvancedFilterDemo() {

    const telephone = sip.telephony.telephone;
    const WssAddress = JSON.parse(localStorage.ws);
    // console.log(WssAddress);
    const WevoSocket = new SocketComponent({ url: WssAddress });
    const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });

    const sessions = useSelector((state) => {
        return state.session.value;
    });

    const ext_name = useSelector((state) => {
        return state.ext.value;
    });

    const showcall = useSelector((state) => {
        return state.call.value;
    });

    const callSocket = async (type, message, info = "") => {
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

    const RetrievePhoneBook = async () => {
        // console.log(JSON.parse(localStorage.login)[0].id);
        // console.log(JSON.parse(localStorage.login)[0].id);
        const query = {
            // action: 'Query',
            // query: `SELECT * FROM users`,
            action: 'RetrievePhoneBook',
            // data: JSON.parse(localStorage.device).ext,
            data: "",
        };

        const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
        const PhoneBookResult = await callSocket("WevoSocket", encryptedQuery);
        // console.log(PhoneBookResult);
        if (PhoneBookResult != "") {
            const JsonPhoneBook = tools.EncryptionUtility.encrypt_decrypt('decrypt', JSON.parse(PhoneBookResult).phonebook);
            if (JsonPhoneBook) {
                const records = [];
                for (const item of JsonPhoneBook) {
                    const record = {
                        id: item.id,
                        default_extension: item.default_extension,
                        username: item.username,
                        // destination: item.dst,
                        // disposition: item.disposition,
                    };
                    records.push(record);
                }

                // console.log(records);
                setRecords(records);

            } else {
                //     // Handle the error case
                //     console.error("Socket call failed.");
            }
        } else {

        }
        // /var/lib/asterisk/static-http/

    };

    const [records, setRecords] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [session, setSession] = useState(null)
    const [callername, setCallername] = useState(null)
    const [videostream, setVideoStream] = useState(null)
    const [userStream, setuserStream] = useState(null)
    // const [showModal, setshowModal] = useState(false)
    // const [exts, setExt] = useState("")
    // const device_id = JSON.parse(localStorage.device).id;
    // const device_secret = JSON.parse(localStorage.device).secret;
    // const device_sip = JSON.parse(localStorage.settings ?? "{}");
    const [callEnded, setCallEnd] = useState("");
    const [muteVideo, setMute] = useState("unmute");
    const [muteAudio, setMuteAudio] = useState("unmute");
    const [onHold, setOnHold] = useState("unhold");
    const [callingStatus, setStatus] = useState("");


    const getSeverity = (status) => {
        switch (status) {
            case 'incoming':
                return 'success';

            case 'outgoing':
                return 'warning';
        }
    };

    useEffect(() => {
        RetrievePhoneBook();
        initFilters();
    }, []);


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                {/* <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} /> */}
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </span>
            </div>
        );
    };


    const dateHistory = (rowData) => {
        return rowData.date;
    };

    const timeHistory = (rowData) => {
        return rowData.time;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const header = renderHeader();

    // id: item.id,
    // default_extension: item.default_extension,
    // username: item.username,

    const callDirect = (ext, name) => {
        setStatus('Dailing');
        telephone.makeCall({
            target: ext,
            options: { mediaConstraints: { audio: true, video: false } }
        });

        dispatch(showmodal(true));
        dispatch(showCall(true));
        dispatch(showExt(name));
    };

    const reject = () => {
        if (sessions) {
            if (sessions._status != 8) {
                sessions.terminate()
            }
        }
        dispatch(showCall(false));
        dispatch(showSession(null));
        dispatch(showmodal(false));
        dispatch(showIncoming(false));
        dispatch(showExt(""));
    }

    const transfer = (value) => {
        if (value) {
            // console.log('sip:' + value + '@' + localStorage.domain);
            let transferTarget = 'sip:' + value + '@' + localStorage.domain;
            sessions.refer(transferTarget);
            dispatch(showCall(false));
            dispatch(showmodal(false));
            dispatch(showIncoming(false));
            dispatch(showSession(null));
            dispatch(showExt(""));
        }
    };




    // Event listeners
    if (!!telephone) {
        telephone.on("call_in_progress", (event) => {
            setStatus('Dailing');
            dispatch(showmodal(true));
            dispatch(showIncoming(false));
            dispatch(showCall(true));
        })
        telephone.on("call_failed", (event) => {
            setCallEnd('end');
            setStatus('Rejected');
            dispatch(showIncoming(false));
            dispatch(showmodal(false));
            dispatch(showSession(null));
            dispatch(showExt(""));
            dispatch(showCall(false));

        })
        telephone.on("call_ended", (event) => {
            setCallEnd('end');
            dispatch(showIncoming(false));
            dispatch(showmodal(false));
            dispatch(showSession(null));
            dispatch(showExt(""));
            dispatch(showCall(false));

        })
        telephone.on("call_confirmed", (event) => {
            setStatus('In Call');
            dispatch(showCall(true));
        })

        telephone.on("setSession", (event) => {
            setCallEnd('calling');
            if (telephone.session) {
                dispatch(showSession(telephone.session));
                setSession(telephone.session);
            } else {
                dispatch(showSession(null));
            }
        })

        telephone.on("getCallername", ({ callername, direction }) => {
            // console.log('caller', callername);
            if (callername != undefined) {
                setCallername(callername);
            }
            if (direction == "incoming") {
                dispatch(showmodal(false));
                dispatch(showIncoming(true));
                dispatch(showExt(callername));
            }
        })

        telephone.on("setStream", (event) => {
            setVideoStream(event);
        })

        telephone.on("checkOnHold", (event) => {
            if (event == "hold") {
                setStatus('On Hold');
            } else {
                setStatus('In Call');
            }
        })

        telephone.on("phone_call_ended", (event) => {
            setCallEnd('end');
            dispatch(showCall(false));
            dispatch(showmodal(false));
            dispatch(showIncoming(false));
            dispatch(showSession(null));
            dispatch(showExt(""));
        })

    }
    // Call function
    const call = (value) => {
        if (telephone) {
            telephone.makeCall({
                target: value,
                options: { mediaConstraints: { audio: true, video: false } }
            });
        }
    };

    const [mic, setMic] = useState({
        color: 'white',
        background: '#636363',
        icon: 'fa fa-microphone',
        status: true
    });

    const [hold, setHold] = useState({
        color: 'white',
        background: '#636363',
        icon: 'fa fa-pause',
        status: true
    });

    const micOn = () => {
        setMuteAudio('unmute')
        // let micobj = mic
        setMic({
            color: 'white',
            background: '#636363',
            icon: 'fa fa-microphone',
            status: true
        });

        if (sessions) {
            telephone.mute(sessions, 'audio', 'unmute')
        }

    };

    const micOff = () => {
        setMuteAudio('mute')
        // let micobj = mic
        setMic({
            color: '#636363',
            background: 'white',
            icon: 'fa fa-microphone-slash',
            status: false
        });

        if (sessions) {
            telephone.mute(sessions, 'audio', 'mute');
        }

    };

    const holdClick = () => {
        // let camobj = camera;
        setOnHold('hold');
        setHold({
            color: '#636363',
            background: 'white',
            icon: 'fa fa-pause',
            status: false
        });

        if (sessions) {
            telephone.hold(sessions, true);
        }
    };
    const unholdClick = () => {
        // let camobj = camera;
        setOnHold('unhold');
        setHold({
            color: 'white',
            background: '#636363',
            icon: 'fa fa-pause',
            status: true
        });

        if (sessions) {
            telephone.hold(sessions, false);
        }
    };

    window.addEventListener('beforeunload', (event) => {
        if (sessions && sessions._status != 8) {
            setCallEnd('end');
            sessions.terminate();
        }
    });

    const modal = useSelector((state) => {
        return state.modal.value;
    });

    const dispatch = useDispatch();

    const modalhide = () => {
        // console.log('12322');
        if (session)
            dispatch(showmodal(false));
    };

    return (
        < Fragment >
            <Row className='py-5 justify-content-center mx-0'>
                <Col xs="12">
                    <Card>
                        <CardHeader>
                            <h3>Phonebook</h3>
                        </CardHeader>
                        <CardBody>
                            <DataTable value={records} paginator showGridlines rows={10} loading={loading}
                                filters={filters} globalFilterFields={['id', 'default_extension', 'username']} header={header}
                                emptyMessage="No data found.">
                                <Column field="default_extension" header="Extension" style={{ minWidth: '12rem' }} />
                                <Column field="username" header="Name" style={{ minWidth: '12rem' }} />
                                <Column header="Action" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <Button onClick={() => callDirect(rowData.default_extension, rowData.username)}><span className='fa fa-phone'></span></Button>
                                )} />
                            </DataTable>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal show={modal} centered className="ps-0">
                <Modal.Header className="pb-0 justify-content-end">
                    <button className="btn" type="button" onClick={() => reject()}><i className="fa fa-close"></i></button>
                </Modal.Header>
                <Modal.Body className='text-center p-0 t-0' >
                    <ShowCall
                        call={call}
                        reject={reject}
                        // videocall={videoCall}
                        // modalVideo={modalVideo}
                        show={showcall}
                        callername={ext_name}
                        micOn={micOn}
                        micOff={micOff}
                        mute={muteAudio}
                        mic={mic}
                        onHoldStatus={onHold}
                        onHold={holdClick}
                        unhold={unholdClick}
                        holdStyle={hold}
                        callStatus={callEnded}
                        status={callingStatus}
                        transfer={transfer}
                    ></ShowCall>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </Fragment >

    );
}
