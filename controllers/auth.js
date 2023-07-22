const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  //check we are getting email and password? with some kind of values
  //if not we send back bad request error
  //if yes we check in the database
  //if not find in databse send back error
  //otherwise we send back user
  const { email, password } = req.body;
  // 1
  if (!email || !password) {
    throw new BadRequestError("Please Provide Email and Password");
  }
  //check email in database
  const user = await User.findOne({ email });
  //check email and compare password
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  //then invoke JWT mongodb instance method which is createJWT()
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
