// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const NotiSlice = createSlice({
  name: "noti", // Name of the slice
  initialState: {
    value: "", // Initial state with a "value" field
  },
  reducers: {
    NotiDetail: (state, action) => {
      state.value = action.payload;
      // console.log(state.value);
    },
  },
});

// Extract the action creators from the NotiSlice
export const { NotiDetail } = NotiSlice.actions;

// Export the reducer function from the NotiSlice
export default NotiSlice.reducer;
