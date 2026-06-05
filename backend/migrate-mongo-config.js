require('dotenv').config();

module.exports = {
  mongodb: {
    url: process.env.MONGODB_URI,
    databaseName: "careerpilot",
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};