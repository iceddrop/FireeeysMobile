const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Increase middleware timeout to prevent bundling issues
config.server = {
  middlewareTimeout: 120000,
};

module.exports = config;
