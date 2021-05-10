import { inspect } from "util";
import glob from "glob";
import fs from "fs";
import http from "http";
import https from "https";
import jwt from "jsonwebtoken";
import { pathToRegexp } from "path-to-regexp";
import type { ValidateFunction } from "ajv";
import type { Request, RequestHandler } from "express";

const secret = process.env.JWT_SECRET;

export const logObject = (obj: object) => {
  if (!(process.env.NODE_ENV === "test")) {
    console.log(inspect(obj, false, null, true));
  }
};

export const isAuthorized = (req: Request) => {
  if (secret == null) return false;
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  try {
    if (token) {
      jwt.verify(token, secret);
      return true;
    }
  } catch {
    return false;
  }
  return false;
};

export const download = (url: string, filename: string, cb) => {
  const file = fs.createWriteStream(filename);
  if (url.startsWith("https")) {
    https.get(url, (res) => {
      res.pipe(file).on("close", cb);
    });
  } else {
    http.get(url, (res) => {
      res.pipe(file).on("close", cb);
    });
  }
};

export const jsonReader = (
  filePath: string,
  cb: (err?: Error, obj?: object) => void
) => {
  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(undefined, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
};
export const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  return new Set([...setA, ...setB]);
};

export const flattenObject = (obj: Object, path: string[] = []): object => {
  return Object.keys(obj).reduce((result: Object, prop: string) => {
    if (typeof obj[prop] !== "object") {
      result[path.concat(prop).join(".")] = obj[prop];
      return result;
    }
    return Object.assign(result, flattenObject(obj[prop], path.concat(prop)));
  }, {});
};

/* Transforms map of key to list value into csv array */
export const transformMapToCsv = (map: Map<string, Array<any>>) => {
  let lengths: number[] = [];
  for (const [_, value] of map.entries()) {
    lengths = [...lengths, value.length];
  }
  const invariant = lengths.every((val, _) => val === lengths[0]);
  console.log(map.entries());
  console.log(lengths[0]);
  console.log(invariant);

  if (!invariant) return [];
  const n = lengths[0];
  let csv = new Array(n + 1).fill([]);
  for (const [key, value] of map.entries()) {
    csv[0] = [...csv[0], key];
    for (let i = 0; i < n; i++) {
      csv[i + 1] = [...csv[i + 1], value[i]];
    }
  }

  return csv;
};
const normalizeObjects = (flattened: Object[]) => {
  const sets = flattened.map((obj: Object) => new Set(Object.keys(obj)));
  const reducer = (acc: Set<string>, curr: Set<string>) =>
    union<string>(acc, curr);
  const allKeys = sets.reduce(reducer);
  let normalized: Object[] = [];
  for (let obj of flattened) {
    for (const key of allKeys) {
      if (!(key in obj)) {
        obj[key] = "";
      }
    }
    normalized.push(obj);
  }
  return normalized;
};

export const transformFlattenedToMap = (
  flattened: object[]
): Map<string, any[]> => {
  const pairArrs = flattened.map((obj) =>
    Object.keys(obj).map((key) => [key, obj[key]])
  );
  let map: Map<string, Array<any>> = new Map();
  for (const pairArr of pairArrs) {
    for (const pair of pairArr) {
      if (!map.has(pair[0])) {
        map.set(pair[0], []);
      }
      map.set(pair[0], [...(map.get(pair[0]) as Array<any>), pair[1]]);
    }
  }
  return map;
};

export const transformObjectsToCsv = (objs: Object[]) => {
  if (!objs || objs.length === 0) return [];
  const flattened = objs.map((obj) => flattenObject(obj));
  const normalized = normalizeObjects(flattened);
  const map = transformFlattenedToMap(normalized);
  return transformMapToCsv(map);
};

export interface Candidate {
  path: string;
  method: string;
  validator: ValidateFunction;
}

interface PathCandidate extends Candidate {
  checkPath: (s: string) => boolean;
}

export const createValidator = (candidates: Candidate[]) => {
  const pathCandidates: PathCandidate[] = candidates.map((candidate) => {
    const checkPath = (s: string) =>
      pathToRegexp(candidate.path).exec(s) != null;
    return { ...candidate, ...{ checkPath: checkPath } };
  });
  const handler: RequestHandler = (req, res, next) => {
    const candidate = pathCandidates.find(
      (candidate) =>
        candidate.checkPath(req.route.path) && candidate.method === req.method
    );

    if (candidate) {
      const validate = candidate.validator;
      if (!validate(req.body)) {
        return res.status(400).json({ error: validate.errors });
      }
    }

    return next();
  };
  return handler;
};

export default {
  logObject,
  isAuthorized,
  download,
  jsonReader,
  flattenObject,
  transformMapToCsv,
  transformObjectsToCsv,
  createValidator,
};
