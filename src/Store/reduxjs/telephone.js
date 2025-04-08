// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const telephoneSlice = createSlice({
    name: "telephone", // Name of the slice
    initialState: {
        value: "", // Initial state with a "value" field
    },
    reducers: {
        showTelephone: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showTelephone } = telephoneSlice.actions;

// Export the reducer function from the counterSlice
export default telephoneSlice.reducer;
