import mongoose from "mongoose";
import { URI } from "../config/env.config.js";

mongoose.set("strictQuery", false);

export const connectToMongo = async () => {
  try {
    await mongoose.connect(URI, {});
    console.log("connected to db");
  } catch (error) {
    console.log(err);
  }
};
