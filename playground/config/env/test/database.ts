import path from 'path';

export default ({ env }) => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        env("DATABASE_TEST_FILENAME", ".tmp/test.db"),
      ),
    },
    useNullAsDefault: true,
    debug: false,
  },
});
