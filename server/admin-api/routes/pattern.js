'use strict';

module.exports = [
  {
    method: "GET",
    path: "/pattern/findOne/:id",
    handler: "pattern.findOne",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/pattern/findMany",
    handler: "pattern.findMany",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/pattern/delete/:id",
    handler: "pattern.delete",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/pattern/update/:id",
    handler: "pattern.update",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/pattern/create",
    handler: "pattern.create",
    config: {
      policies: [],
    },
  },
];
