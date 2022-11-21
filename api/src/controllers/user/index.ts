import { user } from "../../Types";
import { User } from "../../models/User";
import { GoogleUser } from "../../models/googleUser";
const jwt = require("jsonwebtoken");

export const addNewUser = async (user: user) => {
  if (
    !user.name ||
    !user.email ||
    !user.username ||
    !user.password ||
    !user.birthday
  ) {
    throw new Error("Flata enviar datos");
  }
  const userFind = await User.findOne({ name: user.username });
  if (!userFind) {
    let newUser = await User.create({ ...user });
    return newUser;
  } else {
    throw new Error("Username ingresado ya existe");
  }
};

const pageSize = 10;

export const getAllUser = async () => {
  const resultUsers: object = await User.paginate({ deleted: false });
  return resultUsers;
};

export const getUser = async (username: string) => {
  let resultUser = null;
  resultUser = await User.findOne({ username: username }).exec();
  return resultUser;
};

export const updateEmail = async (id: string) => {
  const result = await User.findOneAndUpdate({ _id: id }, { confirmed: true });
  if (!result) {
    throw new Error("No se puede cambiar la propiedad confirmed");
  }
  return result;
};

export const compareUsernames = async (username: string, token: string) => {
  const decodedToken = jwt.verify(token, process.env.SECRETKEY);

  if (username !== decodedToken.username) throw new Error("No autorizado");
};

interface IUserChanges {
  username: string;
  name: string;
  email: string;
  birthday: string;
}

interface putBody {
  username: string;
  name: string;
  email: string;
  birthday: Date;
}
export const updateUser = async (body: putBody, id: number) => {
  // const { username, name, email, birthday} = body;

  await User.findOneAndUpdate({ _id: id }, body);

  const findIdUser = await User.findById({ _id: id });

  const userName = findIdUser?.username;
  const userId = findIdUser?.id.toString();
  const userForToken = { userId, userName };

  const token = jwt.sign(userForToken, process.env.SECRETKEY);
  const decodedToken = jwt.verify(token, process.env.SECRETKEY);
  const usernameToken = decodedToken.username;
  const tokenJson = {
    username: usernameToken,
    token: token,
  };
  // nombre manzana // usuario es pera

  return tokenJson;
};
