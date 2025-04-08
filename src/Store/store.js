// store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./reduxjs/counterSlice";
import modalReducer from "./reduxjs/modal";
import extReducer from "./reduxjs/ext";
import telephoneReducer from "./reduxjs/telephone";
import incomingReducer from "./reduxjs/incoming";
import sessionReducer from "./reduxjs/session";
import callReducer from "./reduxjs/call";
import rememberReducer from "./reduxjs/remember";
import loginReducer from "./reduxjs/login";
import faxReducer from "./reduxjs/fax";
import deviceReducer from "./reduxjs/device";
import modalVideoReducer from "./reduxjs/modalVideo";
import notiReducer from "./reduxjs/noti";
import notistyleReducer from "./reduxjs/noticstyle";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    modal: modalReducer,
    ext: extReducer,
    telephone: telephoneReducer,
    incoming: incomingReducer,
    session: sessionReducer,
    call: callReducer,
    remember: rememberReducer,
    login: loginReducer,
    fax: faxReducer,
    device: deviceReducer,
    modalVideo: modalVideoReducer,
    noti: notiReducer,
    notistyle: notistyleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
