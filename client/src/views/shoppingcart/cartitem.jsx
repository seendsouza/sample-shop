import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card,
  H4,
  H5,
  Button,
  Img,
  Row,
  Col,
  Container,
} from '@bootstrap-styled/v4';
import QuantityDropdown from './quantitydropdown';
import { deleteItem } from '@actions/cartActions';

const CartItem = (props) => (
  <Row>
    <Card className="my-3 mx-auto d-block" style={{ width: '24rem' }}>
      <Row>
        <Col xs={4} className="px-0">
          <Img
            src={props.image}
            alt={props.name}
            style={{ height: 'auto', width: '100%' }}
          />
        </Col>
        <Col xs={8} className="px-0">
          <Container>
            <div className="card-body text-left pt-3">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <H4
                  className="card-title d-inline-block my-auto"
                  style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    verticalAlign: 'middle',
                  }}
                >
                  {props.name}
                </H4>
                <H5
                  className="d-block my-auto mx-auto align-self-right"
                  style={{ fontSize: '0.75rem', opacity: '50%' }}
                >
                  ${props.price}
                </H5>
              </div>
              <p className="card-text pt-1">{props.description}</p>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <QuantityDropdown sku={props.sku} />
                <Button
                  onClick={() => {
                    props.deleteItem(props.cart.cartid, props.sku);
                  }}
                  className="d-bock my-auto mx-auto align-self-right"
                >
                  X
                </Button>
              </div>
            </div>
          </Container>
        </Col>
      </Row>
    </Card>
  </Row>
);

CartItem.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  name: PropTypes.string,
  price: PropTypes.number,
  image: PropTypes.string,
  description: PropTypes.string,
  sku: PropTypes.string,
};

const mapStatetoProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStatetoProps, { deleteItem })(CartItem);
