import { userInfo, googleUser } from "../utils";

global.getUserInfo = getUserInfo;
global.testUserInfo = testUserInfo;
global.test = test;

function testUserInfo() {
  const user = People.People.get('people/me', { personFields: 'names,emailAddresses' });
  return user;
}

function test(args) {
  return {
    gUser: googleUser(),
    user: userInfo(),
  }
}

function getUserInfo() {
  const user = Session.getActiveUser()
  return user.getEmail()
}

global.getUserInfo = getUserInfo;
