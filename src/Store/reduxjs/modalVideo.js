// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const modalVideoSlice = createSlice({
    name: "modalVideo", // Name of the slice
    initialState: {
        value: false, // Initial state with a "value" field
    },
    reducers: {
        showmodalVideo: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showmodalVideo } = modalVideoSlice.actions;

// Export the reducer function from the counterSlice
export default modalVideoSlice.reducer;
