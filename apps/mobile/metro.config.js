const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Configuration Metro simplifiée pour tester NativeWind
const config = getDefaultConfig(__dirname);

// Appliquer la configuration NativeWind
module.exports = withNativeWind(config, {
  input: './global.css',
}); 