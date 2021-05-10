import React from "react";

import ProductList from "./productlist";
import RightBar from "@components/rightbar";

const HomeView = () => (
  <div className="home bg-primary">
    <div className="container-fluid">
      <div className="row py-3">
        <RightBar />

        <div className="col order-2" id="main">
          <div className="container-fluid text-left">
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeView;
