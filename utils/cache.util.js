import Keyv from "keyv";
import { TTL, URI } from "../config/env.config.js";

const keyv = new Keyv(URI, { collection: "blackList" });

const setBlackList = (key, value, ttl = TTL) => keyv.set(key, value, ttl); // ttl 1 hour

const getBlackList = (key) => keyv.get(key);

const delBlackList = (key) => keyv.delete(key);

const clearBlackList = () => keyv.clear();

export { setBlackList, getBlackList, delBlackList, clearBlackList };
