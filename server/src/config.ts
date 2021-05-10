import glob from "glob";
import isValidGlob from "is-valid-glob";
const getGlobbedPaths = (pattern) => {
  const opts = {};
  if (isValidGlob(pattern)) return glob.sync(pattern, opts);
};

interface IConfig {
  allJS: Array<string>;
  models: Array<string>;
  routes: Array<string>;
  controllers: Array<string>;
  policies: Array<string>;
}

const config: IConfig = {
  allJS: ["server.js", "config.js", "modules/*/**/*.js"],
  models: getGlobbedPaths("modules/!(core, images, orders)/models/**/*.js"),
  routes: getGlobbedPaths("modules/!(core)/routes/**/*.js"),
  controllers: getGlobbedPaths("modules/!(core)/controllers/**/*.js"),
  policies: getGlobbedPaths("modules/!(core)/policies/*.js"),
};

export default config;
