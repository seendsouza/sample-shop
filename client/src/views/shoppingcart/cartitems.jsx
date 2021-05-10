import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from '@bootstrap-styled/v4';
import { getCart } from '@actions/cartActions';
import CartItem from './cartitem';

const CartItems = (props) => {
  const { getCart, cartid } = props;
  useEffect(() => {
    getCart(cartid);
  }, [getCart,cartid]);

  return (
    <Container className="align-items-left">
      {props.items.map(({ _id, name, item_details, qty }) => (
        <CartItem
          key={_id}
          sku={_id}
          image={item_details.image}
          name={name}
          price={item_details.price}
          qty={qty}
          description={item_details.description}
        />
      ))}
    </Container>
  );
};

CartItems.propTypes = {
  getCart: PropTypes.func.isRequired,
  cartid: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

const mapStatetoProps = (state) => ({
  cartid: state.cart.cartid,
  items: state.cart.items ? state.cart.items : [],
});

export default connect(mapStatetoProps, { getCart })(CartItems);
