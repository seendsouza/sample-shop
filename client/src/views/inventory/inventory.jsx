import React from "react";

import { Col, Row, Container, H2 } from "@bootstrap-styled/v4";
import InventoryList from "./inventorylist";

const InventoryView = () => (
  <div className="inventory bg-primary">
    <Container className="text-align-center vertical-align-center vh-100">
      <Row
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        }}
      >
        <Col>
          <H2 className="py-4 text-center">Current Products</H2>
          <InventoryList />
        </Col>
      </Row>
    </Container>
  </div>
);

export default InventoryView;
