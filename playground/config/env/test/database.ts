export default ({ env }) => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: env("DATABASE_TEST_FILENAME", ".tmp/test.db"),
    },
    useNullAsDefault: true,
    debug: false,
  },
});
