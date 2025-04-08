// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const extSlice = createSlice({
    name: "ext", // Name of the slice
    initialState: {
        value: "", // Initial state with a "value" field
    },
    reducers: {
        showExt: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showExt } = extSlice.actions;

// Export the reducer function from the counterSlice
export default extSlice.reducer;
