// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const modalSlice = createSlice({
    name: "modal", // Name of the slice
    initialState: {
        value: false, // Initial state with a "value" field
    },
    reducers: {
        showmodal: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showmodal } = modalSlice.actions;

// Export the reducer function from the counterSlice
export default modalSlice.reducer;
