'use strict';

export default [
  {
    method: "GET",
    path: "/findOne/:id",
    handler: "path.findOne",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/path/findMany",
    handler: "path.findMany",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/path/editLink",
    handler: "path.editLink",
    config: {
      policies: [],
    },
  },
];
