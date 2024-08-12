import mongoose from "mongoose";
import { URI } from "../config/env.config.js";

mongoose.set("strictQuery", false);

export const connectToMongo = async () => {
  try {
    // const conn =await mongoose.createConnection(URI, {}).asPromise();
    
    mongoose.connect(URI, {});
    console.log("connected to db");
  } catch (error) {
    console.log(err);
  }
};
