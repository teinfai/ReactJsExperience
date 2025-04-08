// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const DeviceSlice = createSlice({
  name: "login", // Name of the slice
  initialState: {
    DeviceToken: "", // Initial state with a "value" field
  },
  reducers: {
    UpdateDeviceToken: (state, action) => {
      state.DeviceToken = action.payload;
    },
  },
});

// Extract the action creators from the counterSlice
export const { UpdateDeviceToken } = DeviceSlice.actions;

// Export the reducer function from the counterSlice
export default DeviceSlice.reducer;
