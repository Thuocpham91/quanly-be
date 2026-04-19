import { transform, snakeCase, camelCase } from "lodash";

export const isEmpty = (target: any) => {
  if (target === undefined || target === null) return true;
  if (typeof target === "string" && !target?.length) return true;
  if (typeof target === "object" && !Object.keys(target).length) return true;
  if (Array.isArray(target) && !target.length) return true;
  return false;
};

export const bufferToJson = <T>(buff: Buffer): T => {
  return JSON.parse(buff.toString());
};

export const jsonToBuffer = (obj: any): Buffer => {
  return Buffer.from(JSON.stringify(obj));
};

export const transformToCamelCase = (obj: any) => {
  return transform(obj, (result, value, key) => {
    result[camelCase(key)] = typeof value === "object" ? transformToCamelCase(value) : value;
  });
};

export const transformToSnakeKey = (obj: any) => {
  return transform(obj, (result, value, key) => {
    result[snakeCase(key)] = typeof value === "object" ? transformToSnakeKey(value) : value;
  });
};

export const getNumberAfterSubString = (str: string, sub: string) => {
  const substringIndex = str.indexOf(sub);
  if (substringIndex === -1) return null;
  const remainingString = str.substring(substringIndex + sub.length);
  const match = remainingString.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export const rodriguesToMatrix = (rodrigues: number[]): number[][] => {
  const theta = Math.sqrt(rodrigues[0] ** 2 + rodrigues[1] ** 2 + rodrigues[2] ** 2);
  const axis = rodrigues.map((val) => val / theta);

  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const oneMinusCosTheta = 1 - cosTheta;

  const x = axis[0];
  const y = axis[1];
  const z = axis[2];

  const rotationMatrix = [
    [
      cosTheta + x ** 2 * oneMinusCosTheta,
      x * y * oneMinusCosTheta - z * sinTheta,
      x * z * oneMinusCosTheta + y * sinTheta,
    ],
    [
      y * x * oneMinusCosTheta + z * sinTheta,
      cosTheta + y ** 2 * oneMinusCosTheta,
      y * z * oneMinusCosTheta - x * sinTheta,
    ],
    [
      z * x * oneMinusCosTheta - y * sinTheta,
      z * y * oneMinusCosTheta + x * sinTheta,
      cosTheta + z ** 2 * oneMinusCosTheta,
    ],
  ];

  return rotationMatrix;
};

export const hconcat = (...arrays) => {
  // Check if arrays are provided
  if (!arrays || arrays.length === 0) {
    return null;
  }

  // Check if arrays have the same number of rows
  const numRows = arrays[0].length;
  for (let i = 1; i < arrays.length; i++) {
    if (!Array.isArray(arrays[i]) || arrays[i].length !== numRows) {
      console.error("Arrays must have the same number of rows for horizontal concatenation.");
      return null;
    }
  }

  // Perform horizontal concatenation
  // eslint-disable-next-line no-unused-vars
  const result = arrays[0].map((_, rowIndex) => arrays.map((array) => array[rowIndex]).flat());

  return result;
};

export function generateCustomRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
