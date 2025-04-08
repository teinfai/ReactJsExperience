// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const counterSlice = createSlice({
  name: "counter", // Name of the slice
  initialState: {
    value: 0, // Initial state with a "value" field
  },
  reducers: {
    increment: (state, action) => {
      // Access action information
      //   console.log("Current state:", state);
      //   console.log("Action type:", action.type);
      //   console.log("Action payload:", action.payload);
      // console.log(state, "Increment action dispatched");
      state.value += 1;
    },
    decrement: (state) => {
      // console.log("Decrement action dispatched");
      state.value -= 1;
    },
  },
});

// Extract the action creators from the counterSlice
export const { increment, decrement } = counterSlice.actions;

// Export the reducer function from the counterSlice
export default counterSlice.reducer;
