var Store = require("../../src/store");

describe("add", function() {

  var store;

  beforeEach(function() {
    Store.types = {};
    store = new Store();
  });

  it("must add a resource to the store", function () {
    Store.types["products"] = {};
    store.add({
      "type": "products",
      "id": "44"
    });
    expect(store.find("products").length).toBe(1);
    expect(store.find("products")[0].id).toBe("44");
  });

  it("must throw an error if the data doesn't have a type and id", function () {
    expect(function () {
      store.add({});
    }).toThrowError(TypeError, "The data must have a type and id");
  });

  it("must throw an error when called without arguments", function () {
    expect(function () {
      store.add();
    }).toThrowError(TypeError, "You must provide data to add");
  });

  it("must throw an error if the type has not been defined", function () {
    expect(function () {
      store.add({
        "type": "products",
        "id": "44"
      });
    }).toThrowError(TypeError, "Unknown type 'products'");
  });

  it("must use deserialize functions provided by type definitions", function () {
    Store.types["products"] = {
      title: {
        deserialize: function (data, key) {
          return "Example " + data.id + " " + key;
        }
      }
    };
    store.add({
      "type": "products",
      "id": "44"
    });
    expect(store.find("products", "44").title).toBe("Example 44 title");
  });

  it("must not set fields when the deserialize function returns undefined", function () {
    Store.types["products"] = {
      title: {
        deserialize: function (data) {
          if (data.attributes && data.attributes.title) {
            return "Example";
          }
        }
      }
    };
    store.add({
      "type": "products",
      "id": "44",
      "attributes": {
        "title": true
      }
    });
    expect(store.find("products", "44").title).toBe("Example");
    store.add({
      "type": "products",
      "id": "44"
    });
    expect(store.find("products", "44").title).toBe("Example");
  });

  it("must set fields when the deserialize function returns null", function () {
    Store.types["products"] = {
      title: {
        deserialize: function (data) {
          if (data.attributes && data.attributes.title) {
            return "Example";
          } else {
            return null;
          }
        }
      }
    };
    store.add({
      "type": "products",
      "id": "44",
      "attributes": {
        "title": true
      }
    });
    expect(store.find("products", "44").title).toBe("Example");
    store.add({
      "type": "products",
      "id": "44"
    });
    expect(store.find("products", "44").title).toBe(null);
  });

  it("must call deserialize functions in the context of the store", function () {
    Store.types["products"] = {
      example: {
        deserialize: function () {
          return this;
        }
      }
    };
    store.add({
      "type": "products",
      "id": "44",
      "attributes": {
        "example": true
      }
    });
    expect(store.find("products", "44").example).toBe(store);
  });

});
