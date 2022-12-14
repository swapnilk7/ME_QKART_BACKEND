const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  try {
    const userResult = await User.findById(id);
    if (userResult) {
      return userResult;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  try {
    const result = await User.findOne({ email }).exec();
    if (!result) throw new Error("Invalid Email");
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
};

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */

const createUser = async (body) => {
  const isEmailTaken = await User.isEmailTaken(body.email);
  if (isEmailTaken) {
    throw new ApiError(httpStatus.OK, "Email already taken");
  } else {
    const hashedPassword = await encryptPassword(body.password);
    const newDoc = await User.create({ ...body, password: hashedPassword });
    return newDoc;
  }
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = { getUserById, getUserByEmail, createUser };
