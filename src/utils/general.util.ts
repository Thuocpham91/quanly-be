import { Env } from "@common/constans";

export const isDev = () => {
  return process.env.ENVIRONMENT === Env.DEV;
};
