// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const sessionSlice = createSlice({
    name: "session", // Name of the slice
    initialState: {
        value: "", // Initial state with a "value" field
    },
    reducers: {
        showSession: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showSession } = sessionSlice.actions;

// Export the reducer function from the counterSlice
export default sessionSlice.reducer;
