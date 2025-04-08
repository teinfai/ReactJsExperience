// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const incomingSlice = createSlice({
    name: "incoming", // Name of the slice
    initialState: {
        value: false, // Initial state with a "value" field
    },
    reducers: {
        showIncoming: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showIncoming } = incomingSlice.actions;

// Export the reducer function from the counterSlice
export default incomingSlice.reducer;
