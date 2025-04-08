// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const faxSlice = createSlice({
  name: "login", // Name of the slice
  initialState: {
    Faxheader: "", // Initial state with a "value" field
    LocalStationIdentifier: "", // Initial state with a "value" field
    Email: "", // Initial state with a "value" field
    FaxDestination: "", // Initial state with a "value" field
    FileContent: "", // Initial state with a "value" field
    FileFlag: true, // Initial state with a "value" field
    EmailFlag: true, // Initial state with a "value" field
    FaxHeaderFlag: true, // Initial state with a "value" field
    LocalStationIdentifierFlag: true, // Initial state with a "value" field
    FaxDestinationFlag: true, // Initial state with a "value" field
  },
  reducers: {
    UpdateFaxheader: (state, action) => {
      state.Faxheader = action.payload;
    },
    UpdateLocalStationIdentifier: (state, action) => {
      state.LocalStationIdentifier = action.payload;
    },
    UpdateEmail: (state, action) => {
      state.Email = action.payload;
    },
    UpdateFaxDestination: (state, action) => {
      state.FaxDestination = action.payload;
    },
    UpdateFile: (state, action) => {
      state.FileFlag = action.payload;
    },
    UpdateEmailFlag: (state, action) => {
      state.EmailFlag = action.payload;
    },
    UpdateFaxHeaderFlag: (state, action) => {
      state.FaxHeaderFlag = action.payload;
      // console.log(state.FaxHeaderFlag);
    },
    UpdateLocalStationIdentifierFlag: (state, action) => {
      state.LocalStationIdentifierFlag = action.payload;
    },
    UpdateFaxDestinationFlag: (state, action) => {
      state.FaxDestinationFlag = action.payload;
      // console.log(state.FaxDestinationFlag);
    },
    UpdateFileContent: (state, action) => {
      state.FileContent = action.payload;
    },
  },
});

// Extract the action creators from the counterSlice
export const {
  UpdateFaxheader,
  UpdateLocalStationIdentifier,
  UpdateEmail,
  UpdateFaxDestination,
  UpdateFile,
  UpdateFileContent,
  UpdateEmailFlag,
  UpdateFaxHeaderFlag,
  UpdateLocalStationIdentifierFlag,
  UpdateFaxDestinationFlag,
} = faxSlice.actions;

// Export the reducer function from the counterSlice
export default faxSlice.reducer;
