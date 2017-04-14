import { Asset, Font } from 'exponent';

export function cacheImages(images) {
  return images.map(image => Asset.fromModule(image).downloadAsync());
}

export function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}
