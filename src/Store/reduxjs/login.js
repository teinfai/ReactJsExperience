// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const loginSlice = createSlice({
  name: "login", // Name of the slice
  initialState: {
    value: "", // Initial state with a "value" field
  },
  reducers: {
    LoginAuth: (state, action) => {
      state.value = action.payload;
      // console.log(state.value);
    },
  },
});

// Extract the action creators from the counterSlice
export const { LoginAuth } = loginSlice.actions;

// Export the reducer function from the counterSlice
export default loginSlice.reducer;
