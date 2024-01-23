import path from 'path';

module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(
        __dirname,
        '..',
        // We need to go back once more to get out of the dist folder
        '..',
        env('DATABASE_FILENAME', '.tmp/data.db')
      ),
    },
    useNullAsDefault: true,
  },
});
