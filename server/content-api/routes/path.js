'use strict';

module.exports = [
  {
    method: "GET",
    path: "/get",
    handler: "byPath.get",
    config: {
      policies: [],
      auth: {
        scope: ["find"],
      },
    },
  },
  {
    method: "GET",
    path: "/all",
    handler: "byPath.all",
    config: {
      policies: [],
      auth: {
        scope: ["find"],
      },
    },
  },
];
