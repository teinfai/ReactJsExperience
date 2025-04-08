import React, { useContext, useState, useEffect } from 'react';
import { Grid } from 'react-feather';
import { Link } from 'react-router-dom';
import { Image } from '../../AbstractElements';
import CubaIcon from '../../assets/images/logo/logo.png';
import CustomizerContext from '../../_helper/Customizer';
import TmIcon from '../../assets/images/tm/TMOne-ManagedVoice_PlayStore.png';
import WevetelIcon from '../../assets/images/wevetel/wevetel_side.png';


const SidebarLogo = () => {
  const { mixLayout, toggleSidebar, toggleIcon, layout, layoutURL } = useContext(CustomizerContext);
  const [logo, setLogo] = useState(false);

  const openCloseSidebar = () => {
    toggleSidebar(!toggleIcon);
  };

  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  useEffect(() => {
    // SetLogo
    const currentUrl = window.location.href;
    const urlPattern = /tm-muc/i; // The 'i' flag makes the match case-insensitive
    const isUrlContainingWord = (currentUrl) => {
      if (urlPattern.test(currentUrl)) {
        setLogo(TmIcon);
      } else {
        setLogo(WevetelIcon);
      }
    };

    isUrlContainingWord(currentUrl);
  }, []);



  return (
    <div className='logo-wrapper text-center'>
      {layout1 !== 'compact-wrapper dark-sidebar' && layout1 !== 'compact-wrapper color-sidebar' && mixLayout ? (
        <Link to={`${process.env.PUBLIC_URL}/wevetel/dashboard/${layoutURL}`}>
          <img
            className="d-inline"
            src={`${logo}`}
            alt=""
            style={{ width: '120px', height: 'auto' }}
          />
        </Link>
      ) : (
        <Link to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}>
          <img
            className="img-fluid d-inline"
            src={require('../../assets/images/logo/logo_dark.png')}
            alt=""
          />
        </Link>
      )}
      <div className='back-btn' onClick={() => openCloseSidebar()}>
        <i className='fa fa-angle-left'></i>
      </div>
      {/* <div className='toggle-sidebar' onClick={openCloseSidebar}>
        <Grid className='status_toggle middle sidebar-toggle' />
      </div> */}
    </div>
  );
};

export default SidebarLogo;
