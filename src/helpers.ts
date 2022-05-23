import type { EncryptedCookie } from './types';

/**
 * Splits a serialized cookie string into its parts (inverse of merge 👇).
 *
 * @param serializedCookieString - Cookie value to split.
 *
 * @returns - Split cookie object.
 */
export const split = (serializedCookieString: string): EncryptedCookie => {
  const [ciphertext, iv, authTag] = serializedCookieString.split('$');

  return {
    ciphertext: ciphertext ?? '',
    iv: iv ?? '',
    authTag: authTag ?? '',
  };
};

/**
 * Joins an encrypted cookie object into a serialized string (reverse of split 👆)
 *
 * @param encryptedCookie - Encrypted cookie object.
 *
 * @returns - Serialized cookie string.
 */
export const merge = (encryptedCookie: EncryptedCookie): string => {
  const { ciphertext, iv, authTag } = encryptedCookie;

  return [ciphertext, iv, authTag].join('$');
};
