'use strict';

module.exports = [
  {
    method: "GET",
    path: "/get",
    handler: "byPath.get",
    config: {
      policies: [],
    },
  },
];
