'use strict';

module.exports = [
  {
    method: "GET",
    path: "/get/:id",
    handler: "path.get",
    config: {
      policies: [],
    },
  },
];
