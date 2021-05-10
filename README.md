# Sample Shop

[![client](https://github.com/seendsouza/sample-shop/actions/workflows/client.yaml/badge.svg)](https://github.com/seendsouza/sample-shop/actions/workflows/client.yaml)
[![server](https://github.com/seendsouza/sample-shop/actions/workflows/server.yaml/badge.svg)](https://github.com/seendsouza/sample-shop/actions/workflows/server.yaml)

## Prerequisites

Either:

* Docker
* Docker Compose

or

* Node >=15
* MongoDB

## Getting Started


### Add env files to server and client.

If you don't have Stripe or Paypal secrets, leave them as they are as shown below.


In /.env add:

```
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_DEVICE_NAME=<stripe-device-name>
```

In client/.env, add:

```
VITE_PUBLIC_PAYPAL_CLIENT_ID_SAND=<paypal-client-id>
VITE_PUBLIC_PAYPAL_ENV=sandbox
VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
```

In server/.env, add:

```
JWT_SECRET=password
MONGO_URI=mongodb://localhost:27017/sample-shop
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=<paypal-client-id>
PAYPAL_CLIENT_SECRET=<paypal-client-secret>
STRIPE_SECRET=<stripe-secret>
STRIPE_ENDPOINT_SECRET=<stripe-endpoint-secret>
```

### Install (if not using Docker)

In client/ run:

```
npm install
```

In server/ run:

```
npm install
```

### Run (if not using Docker)

In server/ run:

```
npm run dev
```

You should be able to open the site on localhost:3000

### Run (if using Docker)

In / run:

```
docker-compose up
```

## Navigating the site

1. Open localhost:3000/
2. Click Sign Up
3. Sign up (it should redirect you to localhost:3000/login if successful)
4. Log in (it should redirect you to localhost:3000/inventory if successful)
5. Add some products
6. Go back to localhost:3000/
7. Add a product to cart
8. Click the cart icon
9. Pay with your preferred payment gateway





