/* eslint-disable prettier/prettier */

import { User } from "src/users/users.model";
import * as bcryptjs from 'bcryptjs';

function removeUserFromList  (userId: string, usersList: User[]): User[]  {
  return usersList.filter((user) => user._id !== userId);
}


function addUserToList(user: User, usersList: User[]): User[]  {
  return  [...usersList, user]
}

function makeId(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateHash(plainText: string) {
  return bcryptjs.hashSync(plainText)
}

function compare(plainText: string, hash:  string) {
  console.log(plainText, hash)
    return bcryptjs.compareSync(plainText.toString(), hash.toString());
  }

export const utilService = {
    removeUserFromList,
    addUserToList,
  makeId, 
  generateHash,
    compare
}