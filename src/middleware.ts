import Cookies from 'cookies';
import type { RequestHandler } from 'express';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import onHeaders from 'on-headers';
import { DEFAULT_SETTINGS } from './constants';
import { deserialize, serialize } from './serialization';
import type { DecryptedCookie, OvenSettings } from './types';

/**
 * Creates a middleware managing an encrypted cookie session.
 *
 * @param userOptions - Unique settings for the cookie.
 *
 * @returns - Middleware to manage the encrypted cookie.
 */
export default (options: OvenSettings): RequestHandler => {
  const settings: OvenSettings = { ...DEFAULT_SETTINGS, ...options };

  return function cookieOven(request, response, next) {
    const cookies = new Cookies(request, response);
    const cookie = cookies.get(settings.name);

    // Read session data from a request and store it in req[name]
    let session: DecryptedCookie | null;
    if (cookie === undefined) {
      session = null;
    } else {
      try {
        session = deserialize(settings.secret, cookie);
      } catch {
        session = null;
      }
    }
    request[settings.name] = session?.data || {};

    const oldSession = cloneDeep(request[settings.name]);
    const cookieOptions = pick(settings, [
      'maxAge',
      'domain',
      'secure',
      'httpOnly',
      'sameSite',
    ]);

    onHeaders(response, () => {
      if (settings.isRolling || !isEqual(oldSession, request[settings.name])) {
        if (isEqual(request[settings.name], {})) {
          if (cookie !== undefined) {
            cookies.set(settings.name, '', cookieOptions);
          }
        } else {
          let cookieString;
          try {
            cookieString = serialize(
              settings.secret,
              request[settings.name],
              settings.isRolling
            );
          } catch {
            cookieString = '';
          }
          cookies.set(settings.name, cookieString, cookieOptions);
        }
      }
    });
    next();
  };
};
