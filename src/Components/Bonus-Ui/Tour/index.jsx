import React, { Fragment, useState } from 'react';
import { Container, Row } from 'reactstrap';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Tour from 'reactour';
import { Breadcrumbs } from '../../../AbstractElements';
import UserProfile from './UserProfile';
import UserDetails from '../../Application/Users/UsersProfile/UserDetail';
import UserDetails2 from '../../Application/Users/UsersProfile/UserDetail2';
import UserDetails3 from '../../Application/Users/UsersProfile/UserDetails3';
import UserDetails4 from '../../Application/Users/UsersProfile/UserDetail4';

const steps = [
  {
    selector: '.step1',
    content: 'This is Profile image',
  },
  {
    selector: '.step2',
    content: 'Change Profile image here',
  },
  {
    selector: '.step3',
    content: 'This is the your details',
  },
  {
    selector: '.step4',
    content: 'This is your Social details',
  },
  {
    selector: '.step5',
    content: 'This is the your first Post',
  },
]

const Tours = () => {
  const [opentour, setopentour] = useState(true);
  const closeTour = () => {
    setopentour(false);
  };
  const disableBody = target => disableBodyScroll(target);
  const enableBody = target => enableBodyScroll(target);

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Tour" parent="Bouns Ui" title="Tour" />
      <Tour
        steps={steps}
        rounded={5}
        isOpen={opentour}
        disableInteraction={true}
        disableKeyboardNavigation={false}
        onRequestClose={closeTour}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />
      <Container fluid={true}>
        <div className="user-profile">
          <Row>
            <UserProfile step={steps} />
            <UserDetails  />
            <UserDetails2 />
            <UserDetails3 />
            <UserDetails4 />
          </Row>
        </div>
      </Container>
    </Fragment>

  );
};

export default Tours;