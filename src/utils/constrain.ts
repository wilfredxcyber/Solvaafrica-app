// utils/constrain.ts
import { Platform } from 'react-native';

/**
 * Prevent elements from stretching too wide on web
 */
export const constrain = {
  width: (maxWidth: number = 400) => Platform.select({
    web: { maxWidth, alignSelf: 'center', width: '100%' },
    default: {}
  }),
  
  button: Platform.select({
    web: { maxWidth: 300, alignSelf: 'center' },
    default: {}
  }),
  
  input: Platform.select({
    web: { maxWidth: 400, alignSelf: 'center' },
    default: {}
  }),
  
  image: Platform.select({
    web: { maxWidth: '100%', height: 'auto' },
    default: { resizeMode: 'contain' }
  }),
};