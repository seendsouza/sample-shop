import React from 'react';

import { Container, Col, Row } from '@bootstrap-styled/v4';

import Cart from './cart';

const ShoppingCartView = () => (
  <div className="shopping-cart bg-primary">
    <Container className="justify-content-center" style={{ minHeight: '75vh' }}>
      <Row className="justify-content-center">
        <Col style={{ maxWidth: 960 }} className="my-auto mx-auto text-center">
          <Cart />
        </Col>
      </Row>
    </Container>
  </div>
);

export default ShoppingCartView;
