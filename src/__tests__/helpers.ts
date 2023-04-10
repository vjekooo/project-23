import {HttpCachingProxy} from '@loopback/http-caching-proxy';
import {merge} from 'lodash';
import path from 'path';
import {GeocoderDataSource} from '../datasources';
import {User} from '../models';
import {Geocoder, GeoPoint} from '../services';

/*
 ==============================================================================
 HELPER FUNCTIONS
 If you find yourself creating the same helper functions across different
 test files, then extracting those functions into helper modules is an easy
 way to reduce duplication.

 Other tips:

 - Using the super awesome Partial<T> type in conjunction with Object.assign
   means you can:
   * customize the object you get back based only on what's important
   to you during a particular test
   * avoid writing test logic that is brittle with respect to the properties
   of your object
 - Making the input itself optional means you don't need to do anything special
   for tests where the particular details of the input don't matter.
 ==============================================================================
 *

/**
 * Generate a complete User object for use with tests.
 * @param User - A partial (or complete) User object.
 */
export function givenUser(user?: Partial<User>) {
  const data = Object.assign(
    {
      title: 'do a thing',
      desc: 'There are some things that need doing',
      isComplete: false,
    },
    user,
  );
  return new User(data);
}

export const aLocation = {
  address: '1 New Orchard Road, Armonk, 10504',
  geopoint: <GeoPoint>{y: 41.10965601083235, x: -73.72466486205613},
  get geostring() {
    return `${this.geopoint.y},${this.geopoint.x}`;
  },
};

export function getProxiedGeoCoderConfig(proxy: HttpCachingProxy) {
  return merge({}, GeocoderDataSource.defaultConfig, {
    options: {
      proxy: proxy.url,
      tunnel: false,
    },
  });
}

export {HttpCachingProxy};
export async function givenCachingProxy() {
  const proxy = new HttpCachingProxy({
    cachePath: path.resolve(__dirname, '.http-cache'),
    logError: false,
    timeout: 5000,
  });
  await proxy.start();
  return proxy;
}

export async function isGeoCoderServiceAvailable(service: Geocoder) {
  try {
    await service.geocode(aLocation.address);
    return true;
  } catch (err) {
    if (err.statusCode === 502) {
      return false;
    }
    throw err;
  }
}
