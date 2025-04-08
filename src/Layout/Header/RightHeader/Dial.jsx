import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { showmodal } from "../../../Store/reduxjs/modal";
import { Button } from 'reactstrap';

const Dial = () => {
    const [isActive, setIsActive] = useState(false);

    const handleMouseEnter = () => {
        setIsActive(true);
    };

    const handleMouseLeave = () => {
        setIsActive(false);
    };

    const dispatch = useDispatch();

    // Click handler for the Increment button
    const modalshow = () => {
        // console.log("Increment button clicked");
        dispatch(showmodal(true)); // Dispatch the increment action
    };

    return (


        <Button onClick={modalshow}
            outline
            color={isActive ? "" : "info"} // Change color based on isActive state
            active={isActive ? false : true}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <i
                // onClick={modalshow}
                style={{
                    'fontSize': '25px',
                    'cursor': 'pointer',
                    // 'transition': 'border 0.3s',
                    // 'border': '110px solid transparent'
                }}
                // onMouseEnter={(e) => e.target.style.border = '1px solid black'} // Change border on hover
                // onMouseLeave={(e) => e.target.style.border = '1px solid transparent'} // Reset border on hover out
                className='fa fa-phone' >
            </i>
        </Button >

        // <div className='text-center px-0'>
        //     <i onClick={modalshow}
        //         style={{
        //             'fontSize': '35px',
        //             'cursor': 'pointer',
        //             'transition': 'border 0.3s',
        //             'border': '110px solid transparent'
        //         }}
        //         onMouseEnter={(e) => e.target.style.border = '1px solid black'} // Change border on hover
        //         onMouseLeave={(e) => e.target.style.border = '1px solid transparent'} // Reset border on hover out
        //         className='fa fa-phone' >
        //     </i>
        // </div>
    );
};

export default Dial;
