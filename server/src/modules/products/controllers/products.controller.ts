import { logObject } from "../../core/utils.js";
import mongoose from "mongoose";
import Product, { IProduct } from "../models/product.model.js";
import { Request, Response, NextFunction } from "express";

export const list = (_: Request, res: Response) => {
  Product.find({}, function (err, products) {
    if (err) return res.status(500).end();
    logObject(products);
    res.json(products);
  });
};

export const create = (req: Request, res: Response) => {
  const newProduct = new Product({
    name: req.body.name,
    qty: req.body.qty,
    item_details: {
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
    },
  });
  newProduct.save().then((product) => {
    logObject(product);
    return res.json(product);
  });
};

export const read = (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(500).send("ID field is required.");
  } else {
    Product.findById(req.params.id, function (err: Error, product: IProduct) {
      if (err) return res.status(500).end();
      logObject(product);
      res.send(product);
    });
  }
};

export const update = (req: Request, res: Response) => {
  const updatedProduct = new Product({
    _id: req.params.id,
    name: req.body.name,
    qty: req.body.qty,
    item_details: {
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
    },
  });
  Product.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: updatedProduct },
    { useFindAndModify: false, new: true },
    function (err) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
};

export const deleteProduct = (req: Request, res: Response) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (product == null) throw "Product doesn't exist";
      product.remove().then(() => res.json({ success: true }));
    })
    .catch((err) => res.status(500).json({ success: false, error: err }));
};

export const productById = (
  _: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Product is invalid",
    });
  }

  Product.findById(id)
    .populate("user", "displayName")
    .exec((err, product) => {
      if (err) {
        return next(err);
      } else if (!product) {
        return res.status(404).send({
          message: "No product with that identifier has been found",
        });
      }
      next();
    });
};

export default { list, create, read, update, deleteProduct, productById };
