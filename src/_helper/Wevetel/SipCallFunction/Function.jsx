import JsSIP from "jssip"
import EventEmitter from "eventemitter3";


class phone extends EventEmitter {
  session = null
  ua = null
  remotestream = null
  localstream = null
  old_session = null

  constructor({ configurations }) {
    super();
    this.configurations = configurations
    this.remotestream = null
    this.ua = new JsSIP.UA(this.configurations);
    // JsSIP.debug.enable('JsSIP:*');
    JsSIP.debug.disable('JsSIP:*');
    // const ua = new JsSI  P.UA(configurations);
    this.ua.on('newRTCSession', (data) => {

      const session = data.session;
      const direction = session.direction;

      // console.log('session', session);
      this.session = session;
      this.emit("setSession", session);

      session.on('peerconnection', (peerData) => {
        //incoming
        peerData.peerconnection.addEventListener('addstream', (e) => {
          const remoteAudio = document.createElement('audio');
          remoteAudio.srcObject = e.stream;
          remoteAudio.play();
          this.remotestream = new MediaStream()
          let tracks = e.stream.getTracks()

          // console.log('trackssss', tracks);
          for (const track of tracks) {
            this.remotestream.addTrack(track)
          }
          this.emit("setStream", e.stream);
          this.localstream = session.connection.getLocalStreams()[0];
          this.emit("setLocalStream", session.connection.getLocalStreams()[0]);
        });


        this.remotestream = new MediaStream()
        peerData.peerconnection.ontrack = (event) => {
          const tracks = event.streams[0].getTracks()
          for (const track of tracks) {
            this.remotestream.addTrack(track)
          }
          this.emit("setStream", this.remotestream)
          // console.log('localstream', this.remotestream);
        }


      });


      if (direction === "incoming" || direction === "outgoing") {
        // console.log('direction', direction);
        if (direction === "incoming") {
          const remote_identity = session.remote_identity;
          const callername = remote_identity.display_name;
          const sdp = session._request.body;
          const isVideo = sdp.includes('m=video');
          this.emit("checkVideocall", isVideo);
          this.emit("getCallername", { callername, direction });
        }
        // Part to transmit video and sound stream after setup
        const connection = session.connection;

        if (direction === "outgoing") {

          this.remotestream = new MediaStream()
          connection.ontrack = (event) => {
            const tracks = event.streams[0].getTracks()
            const remoteAudio = document.createElement('audio');
            remoteAudio.srcObject = event.streams[0];
            remoteAudio.play();

            // console.log('tracks', tracks);
            for (const track of tracks) {
              this.remotestream.addTrack(track)
            }
            this.emit("setStream", this.remotestream)
          }
          // connection.addEventListener('track', (event) => {
          //   console.log("get dao track ma", event.track.kind)
          //   if (event.track.kind === "audio") {
          //     const getRemoteAudio = document.createElement('audio');
          //     getRemoteAudio.srcObject = new MediaStream([event.track]);
          //     getRemoteAudio.play();
          //   }
          //   if (event.track.kind === "video") {
          //     this.remotestream = new MediaStream([event.track])
          //     this.emit("setStream", new MediaStream([event.track]))
          //   }
          // })
        }



        if (connection) {
          this.emit("setLocalStream", connection.getLocalStreams()[0]);
        }
        //   this.remotestream = new MediaStream()
        //   //outoging
        //   connection.ontrack = (data) => {
        //     // console.log("HEHE", data.streams[0].getTracks());
        //     const getRemoteAudio = document.createElement('audio');
        //     getRemoteAudio.srcObject = data.streams[0];
        //     getRemoteAudio.play();
        //     if (data.streams) {
        //       console.log('datasteam', data.streams[0].getTracks())
        //       let tracks = data.streams[0].getTracks()
        //       console.log("phone remote", this.remotestream)

        //       for (let track of tracks) {
        //         this.remotestream.addTrack(track)
        //       }

        //       this.emit("setStream", data.streams[0])
        //       // this.remotestream = data.streams[0];
        //     }
        //   };
        // }
      }



      session.on('confirmed', (data) => {
        this.mute(session, 'video', 'unmute');
        this.emit("checkConfirm", data);
      });

      session.on('accepted', (data) => {
        this.mute(session, 'video', 'mute');
        this.emit("checkAccept", data);
      });

      session.on('failed', (data) => {
        // console.log('123123123');
        const { cause } = data;
        this.emit("call_failed", cause);
      });

      session.on('ended', (data) => {
        if (this.remotestream) {
          this.remotestream.getTracks().forEach((track) => {
            track.stop()
            // console.log(track);
          });
        }
        if (this.localstream) {
          this.localstream.getTracks().forEach((track) => {
            track.stop();
            // console.log(track);
          });
        }
        this.emit("phone_call_ended", data);
      });

      session.on('hold', function () {
        this.emit("checkOnHold", 'hold');
        // console.log('onhold');
      }.bind(this));

      // Event listener for when the session is resumed
      session.on('unhold', function () {
        this.emit("checkOnHold", 'unhold');
        // console.log('unhold');
      }.bind(this));

    });



    this.ua.start()
  }

  start() {
    this.ua.start()
  }

  answer_call = (session, isVid) => {
    const answer_sdp = session._request.body;
    const isVideo = answer_sdp.includes('m=video') && isVid;
    // session.answer();
    if (isVideo) {
      session.answer({ mediaConstraints: { audio: true, video: true } });
    } else {
      session.answer({ mediaConstraints: { audio: true, video: false } });
    }
  }

  mute(session, type, mute) {
    if (mute == 'mute') {
      if (type == "audio") {
        session.mute({
          audio: true,
        });
      } else {
        session.mute({
          video: true,
        });
      }
    } else {
      if (type == "audio") {
        session.unmute({
          audio: true,
        });
      } else {
        session.unmute({
          video: true,
        });
      }
    }
  }

  hold(session, isHold) {
    if (isHold) {
      session.hold();
    } else {
      session.unhold();
    }
  }



  // terminate_call() {

  //   this.emit("terminate_session")
  // session.terminate()
  // }



  isConnected() {
    if (this.ua) {
      return this.ua.isConnected()
    }
    return null
  }

  async makeCall({ target, options }) {

    const eventHandlers = {
      'progress': (e) => {
        // console.log("here1", this)
        this.emit("call_in_progress", e)

        // console.log("++function", 'call is in progress', e);
      },
      'failed': (e) => {
        this.emit("call_failed", e)
        // console.log("++function", 'call failed with cause: ', e);
      },
      'ended': (e) => {
        this.emit("call_ended", e)
        // console.log("++function", 'call ended with cause: ' + e);
      },
      'confirmed': (e) => {
        this.emit("call_confirmed")
        // const rtcSession = e.session;
        // this.emit("start-call", "hello")
        // this.emit("error    ", this)

        // console.log("++function", e);
        // CallMessage = "confirmed";
        // CallMessage = { rtcSession: e.session };
        // const mediaStream = rtcSession.connection.getRemoteStreams()[0];
        // if(mediaStream) {
        //     const audioElement = new Audio()
        //     audioElement.srcObject = mediaStream
        //     audioElement.play()
        // }
      }
    };

    if (!options.mediastream) {
      // options.mediaConstraints = { audio: true, video: true };
      options.eventHandlers = eventHandlers;
      // options.mediastream = await navigator.mediaDevices.getUserMedia(options.mediaConstraints);
    }



    if (this.isConnected()) {
      // options.pcConfig = {
      //   iceServers: [
      //     {
      //       urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      //     }
      //   ],
      //   iceCandidatePoolSize: 1
      // }
      const sess = this.ua.call(target, options);

      sess.connection.addEventListener('addstream', (e) => {
        this.localstream = sess.connection.getLocalStreams()[0];

        this.emit("setLocalStream", sess.connection.getLocalStreams()[0]);
        // sess.connection.getLocalStreams()[0].getTracks().forEach((track) => {
        //   console.log('sess', track);
        // });
      });
    }


  }

}

export default phone;


/// testing account
// const configurations = {
//   uri: "sip:1234512345@sbc.wevo.my",
//   password: "4ebd7793d8477d09525d76aae9070950",
//   sockets: new JsSIP.WebSocketInterface('wss://sbc.wevo.my:8089/ws'),
//   displayname: "1234512345",
//   authorization_user: "1234512345",
//   // register: true,
//   // register_expires: 129600,
//   contact_uri: "sip:1234512345@sbc.wevo.my",
//   realm: "sbc.wevo.my",
//   user_agent: "Wevetel"
// }
