import { mongoose } from "@typegoose/typegoose";

export default interface IJwtPayLoad {
  _id: mongoose.Types.ObjectId,
  firstname: string,
  lastname: string,
  isVerify: boolean,
}