import { MAX_LENGTH } from './constants';
import { encrypt, decrypt } from './encryption';
import { merge, split } from './helpers';
import { DecryptedCookie } from './types';

/**
 * Turns a JSON-compatible object literal into a secure cookie string.
 *
 * @param secret - Unique secret associated with cookie.
 * @param data - Cookie data.
 * @param isRolling - Whether cookie auto-renews.
 *
 * @returns - Serialized cookie value.
 */
export const serialize = (
  secret: string,
  data: any,
  isRolling = false
): string => {
  const cookieData = {
    d: data,
    t: isRolling ? Date.now() : undefined,
  };

  const dataString = JSON.stringify(cookieData);
  const result = merge(encrypt(secret, dataString));

  if (result.length > MAX_LENGTH) {
    throw new Error('Data too long to store in a cookie');
  }
  return result;
};

/**
 * Returns a serialized cookie string to its original object.
 *
 * @param secret - Unique secret associated with cookie.
 * @param serializedCookieString - Serialized cookie value.
 *
 * @returns - Deserialized cookie value.
 */
export const deserialize = (
  secret: string,
  serializedCookieString: string
): DecryptedCookie | null => {
  const cookieData = decrypt(secret, split(serializedCookieString));
  const jsonData = JSON.parse(cookieData);

  return {
    data: jsonData.d,
    timestamp: jsonData.t,
  };
};
