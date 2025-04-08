// components/Counter.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../../Store/reduxjs/counterSlice";

// Counter component
const Counter = () => {
  // Use the useSelector hook to access the count state from the Redux store
  const count = useSelector((state) => {
    // console.log("Accessed Redux state: ", state);
    // the state is the entire state of whole redux, specific which state need to use 
    // this is the checkpoint update the value after react trigger re-render event.
    // useSelector will compare old value with current new value get from reducer.
    // if new value the react itself will re-render this part
    return state.counter.value; // Access "counter" slice's "value" field
  });

  // Use the useDispatch hook to get the dispatch function
  const dispatch = useDispatch();

  // Click handler for the Increment button
  const handleIncrement = () => {
    // console.log("Increment button clicked");
    dispatch(increment()); // Dispatch the increment action
  };

  // Click handler for the Decrement button
  const handleDecrement = () => {
    // console.log("Decrement button clicked");
    dispatch(decrement()); // Dispatch the decrement action
  };

  // console.log("Rendering Counter component");

  return (
    <div>
      <h1>Counter</h1>
      {/* Display the current count from the Redux store */}
      <p>Count: {count}</p>

      {/* Button to increment the count */}
      <button type="button" onClick={handleIncrement}>
        Increment
      </button>

      {/* Button to decrement the count */}
      <button type="button" onClick={handleDecrement}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;
