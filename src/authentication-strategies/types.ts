import {User} from "../models";
import {securityId, UserProfile} from '@loopback/security';

/**
* Map passport profile to UserProfile in `@loopback/security`
* @param user
*/
export const mapProfile = function (user: User): UserProfile {
  const userProfile: UserProfile = {
    [securityId]: '' + user.id,
    profile: {
      ...user,
    },
  };
  return userProfile;
};