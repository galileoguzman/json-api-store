# JSON API Store [![Build Status](https://travis-ci.org/haydn/json-api-store.svg?branch=master)](https://travis-ci.org/haydn/json-api-store)

A lightweight JavaScript library that acts as a data store and uses the
[JSON API](http://jsonapi.org) specification. You can use it in the browser to
easily communicate with a JSON API compliant server.

## Usage

### Browser

At the moment the primary use can for JSON API Store is in the browser:

```javascript

// Create a new store instance.
var adapter = new Store.AjaxAdapter({ base: "http://example.com/api/v1" });
var store = new Store(adapter);

// Define the "categories" type.
store.define([ "categories", "category" ], {
  title: Store.attr(),
  products: Store.hasMany()
});

// Define the "products" type.
store.define([ "products", "product" ], {
  title: Store.attr(),
  category: Store.hasOne()
});

// Load all the products.
store.load("products", { include: [ "category" ] }, function (products) {

  products.length; // 1
  products[0].id; // "1"
  products[0].title; // "Example Book"
  products[0].category.id; // "1"
  products[0].category.title; // "Books"

  products[0] === store.find("products", "1"); // true
  products[0].category === store.find("categories", "1"); // true

});

```

### Node

You can also use JSON API Store in a Node.js environment (adapters that work in
a Node.js are in the works):

**NOTE**: Without an adapter the `create`, `load`, `update` and `destroy`
methods cannot be used.

```javascript

var Store = require("json-api-store");

var store = new Store();

store.define([ "categories", "category" ], {
  title: Store.attr(),
  products: Store.hasMany()
});

store.define([ "products", "product" ], {
  title: Store.attr(),
  category: Store.hasOne()
});

store.add({
  type: "products",
  id: "1",
  attributes: {
    title: "Example Product"
  },
  relationships: {
    category: {
      data: {
        type: "categories",
        id: "1"
      }
    }
  }
});

store.add({
  type: "categories",
  id: "1",
  attributes: {
    title: "Example Category"
  }
});

store.find("products", "1").category.title; // "Example Category"

```

## Installing

#### NPM

```
npm i json-api-store
```

#### Bower

```
bower i json-api-store
```

#### Manually

Grab the [store.js](https://raw.githubusercontent.com/haydn/json-api-store/master/dist/store.js) file.

## Documentation

Documentation is available on the website:

http://particlesystem.com/json-api-store/
