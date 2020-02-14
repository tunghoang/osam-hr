import { GoogleUser, User, UserRole, Department } from "../@types/user";
import { db } from "../db";
import { googleUser, userInfo, isValid } from "../utils";

global.listUsersDomain  = listUsersDomain;
global.listUsers        = listUsers;
global.addNewDepartment = addNewDepartment;

function listUsersDomain(maxResults) {
  var optionalArgs = {
      customer: 'my_customer',
      maxResults: maxResults || 100,
      orderBy: 'email'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return { total: response.users.length, users: response.users };
}


function listUsers() {
  return db.from<User>('user').toJSON();
}

function addNewDepartment(data){
  return db.from<Department>('department').insert(data);
}

