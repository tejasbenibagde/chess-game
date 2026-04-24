const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add inlineRem: 16 as required
module.exports = withNativeWind(config, { 
  input: './app/global.css',
  inlineRem: 16, 
});