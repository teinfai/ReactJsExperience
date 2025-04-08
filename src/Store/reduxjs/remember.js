// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const rememberSlice = createSlice({
    name: "remember", // Name of the slice
    initialState: {
        value: false, // Initial state with a "value" field
    },
    reducers: {
        showRemember: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showRemember } = rememberSlice.actions;

// Export the reducer function from the counterSlice
export default rememberSlice.reducer;
