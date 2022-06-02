'use strict';

module.exports = [
  {
    method: "GET",
    path: "/findOne/:id",
    handler: "path.findOne",
    config: {
      policies: [],
    },
  },
];
