// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const NotiStyleSlice = createSlice({
  name: "noti", // Name of the slice
  initialState: {
    value: "", // Initial state with a "value" field
  },
  reducers: {
    NotiStyle: (state, action) => {
      state.value = action.payload;
      // console.log(state.value);
    },
  },
});

// Extract the action creators from the NotiStyleSlice
export const { NotiStyle } = NotiStyleSlice.actions;

// Export the reducer function from the NotiStyleSlice
export default NotiStyleSlice.reducer;
