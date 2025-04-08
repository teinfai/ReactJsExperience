// SipPhone.js
import JsSIP from 'jssip'; // Make sure to import JsSIP library
import phone from './Function';

class createSipPhone {
    constructor() {
        const device_id = localStorage.device ? JSON.parse(localStorage.device).id : null;
        const device_secret = localStorage.device ? JSON.parse(localStorage.device).secret : null;
        const device_sip = JSON.parse(localStorage.settings ?? "{}");


        this.telephony = null;

        if (localStorage.domain && device_sip.SIP) {
            const configurations = {
                uri: "sip:" + device_id + "@" + localStorage.domain + "",
                password: device_secret,
                sockets: new JsSIP.WebSocketInterface('wss://' + localStorage.domain + ':' + device_sip.SIP + '/ws'),
                displayname: device_id,
                authorization_user: device_id,
                contact_uri: "sip:" + device_id + "@" + localStorage.domain + "",
                realm: localStorage.domain,
                session_timers: false,
                session_timers_refresh_method: 'INVITE',
                session_timers_min_se: 90,
                iceServers:
                {
                    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
                }
            }

            this.telephony = {
                telephone: new phone({ configurations: configurations }),
            };
        }
    }


    initphone() {
        const device_id = localStorage.device ? JSON.parse(localStorage.device).id : null;
        const device_secret = localStorage.device ? JSON.parse(localStorage.device).secret : null;
        const device_sip = JSON.parse(localStorage.settings ?? "{}");

        if (localStorage.domain && device_sip.SIP) {
            const configurations = {
                uri: "sip:" + device_id + "@" + localStorage.domain + "",
                password: device_secret,
                sockets: new JsSIP.WebSocketInterface('wss://' + localStorage.domain + ':' + device_sip.SIP + '/ws'),
                displayname: device_id,
                authorization_user: device_id,
                contact_uri: "sip:" + device_id + "@" + localStorage.domain + "",
                realm: localStorage.domain,
                session_timers: false,
                session_timers_refresh_method: 'INVITE',
                session_timers_min_se: 90,
                iceServers:
                {
                    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
                }
            }

            this.telephony = {
                telephone: new phone({ configurations: configurations }),
            };
        }
    }

};

const sip = new createSipPhone();

export default sip;