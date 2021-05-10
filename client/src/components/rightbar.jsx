import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import CartIcon from "../components/carticon";

const RightBar = () => {
  return (
    <div className="col-1 order-3 d-none d-lg-block" id="sticky-sidebar">
      <div className="sticky-top" style={{ top: "5%" }}>
        <div className="nav flex-column">
          <div style={{ fontSize: "4em" }}>
            <LinkContainer to="/shopping-cart">
              <a href="/shopping-cart">
                <div style={{ color: "black" }}>
                  <CartIcon />
                </div>
              </a>
            </LinkContainer>
          </div>
        </div>
      </div>
      <div className="sticky-top" style={{ top: "85%" }}></div>
    </div>
  );
};
export default RightBar;
