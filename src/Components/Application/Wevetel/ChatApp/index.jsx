import React, { Fragment, useState, useEffect, useContext } from 'react';
import ChatStatus from './ChatStatus';
import Chatting from './Chatting';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';



const ChatAppContain = () => {

  return (
    <Fragment>
      <Container className='p-4' fluid={true}>
        <Row >
          <Col xs={4} className='call-chat-sidebar'>
            <Card className='mb-0 h-100 overflow-auto'>
              <CardBody className='chat-body'>
                <ChatStatus />
              </CardBody>
            </Card>
          </Col>
          <Col xs={8} className='call-chat-body'>
            <Card className='mb-0'>
              <CardBody className='p-0'>
                <Chatting />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment >
  );
};
export default ChatAppContain;
