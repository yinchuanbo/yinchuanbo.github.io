import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import path from "path";
import fs, { promises } from "fs";
import { fileURLToPath } from "url";
import scss from "rollup-plugin-scss";
import chokidar from "chokidar";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import ejs from "ejs";
import json from "@rollup/plugin-json";
import { exec } from "child_process";
import * as sass from "sass";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import eslint from "@rollup/plugin-eslint";
import stylelint from "stylelint";

const lan = "en";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoPath = path.resolve(__dirname, `repo`);

const devJsPath = path.resolve(__dirname, `${lan}/dist/Dev/js`);
const outputJsPath = path.resolve(__dirname, `${lan}/dist/js`);

const devScssPath = path.resolve(__dirname, `${lan}/dist/Dev/scss`);
const outputCssPath = path.resolve(__dirname, `${lan}/dist/css`);

const devEjsPath = path.resolve(__dirname, `${lan}/ejs`);
const outputHtmlPath = path.resolve(__dirname, `${lan}`);

const jsonDataPath = path.resolve(__dirname, `${lan}/dist/lan/index.js`);

const projectRootDir = path.resolve(__dirname);

const getJsFiles = (dir) => {
  return fs.readdirSync(dir).filter((file) => file.endsWith(".js"));
};

function convertToJson(input) {
  input = input.replace(/,(\s*[}\]])/g, "$1");
  input = input.replace(/(\w+)\s*:/g, '"$1":');
  input = input.replace(/;\s*$/, "");
  try {
    const jsonObject = JSON.parse(input);
    return jsonObject;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

const readJsonData = async () => {
  try {
    let data = fs.readFileSync(jsonDataPath, "utf-8");
    data = data.replace(/^module\.exports\s*=\s*/, "");
    data = data.trim();
    if (!data) {
      console.warn(`JSON file ${jsonDataPath} is empty.`);
      return {};
    }
    data = convertToJson(data);
    return data;
  } catch (err) {
    console.error(`Error reading JSON data:`, err);
    return {};
  }
};

const compileEjs = async (filename) => {
  const outputPath = path.resolve(
    outputHtmlPath,
    path.basename(filename, ".ejs") + ".html"
  );
  const jsonData = await readJsonData();
  ejs.renderFile(filename, jsonData, (err, str) => {
    if (err) {
      console.error(`Error rendering ${filename}:`, err);
    } else {
      fs.writeFileSync(outputPath, str);
      console.log(`Compiled ${filename} to ${outputPath}`);
    }
  });
};

const scssTask = (filename) => {
  return new Promise(async (resolve, reject) => {
    const name = path.basename(filename, ".scss");
    const cssPath = path.join(outputCssPath, name + ".min.css");

    // 检查 SCSS 语法
    const lintResult = await stylelint.lint({
      files: filename,
    });

    if (lintResult.errored) {
      throw new Error(
        `Stylelint found errors in ${filename}, ${
          lintResult?.results?.[0]?.["warnings"]?.[0]?.["text"] ||
          lintResult?.results
        }`
      );
    }

    const result = await sass.compileAsync(filename, {
      style: "compressed",
    });

    postcss([autoprefixer])
      .process(result.css, { from: undefined })
      .then((res) => {
        promises
          .writeFile(cssPath, res.css)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(
              `Error writing compiled SCSS file ${cssPath}:${error.message}`
            );
          });
      })
      .catch((error) => {
        reject(`Error processing CSS with PostCSS:${error.message}`);
      });
  });
};

const rebuildJs = () => {
  exec("rollup -c", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing rollup: ${err}`);
      return;
    }
    console.log(`Rollup stdout: ${stdout}`);
    console.error(`Rollup stderr: ${stderr}`);
  });
};

chokidar.watch(`${devScssPath}/*.scss`).on("change", async (file) => {
  try {
    await scssTask(file);
  } catch (error) {
    console.log("error01", error);
  }
});

chokidar.watch(`${repoPath}/scss/*.scss`).on("change", () => {
  fs.readdirSync(devScssPath)
    .filter((file) => file.endsWith(".scss"))
    .forEach(async (item) => {
      try {
        await scssTask(`${devScssPath}/${item}`);
      } catch (error) {
        console.log("error02", error);
      }
    });
});

chokidar.watch(`${repoPath}/ejs/*.ejs`).on("change", () => {
  fs.readdirSync(devEjsPath)
    .filter((file) => file.endsWith(".ejs"))
    .forEach(async (item) => {
      await compileEjs(`${devEjsPath}\\${item}`);
    });
});

chokidar.watch(jsonDataPath).on("change", () => {
  fs.readdirSync(devEjsPath)
    .filter((file) => file.endsWith(".ejs"))
    .forEach(async (item) => {
      await compileEjs(`${devEjsPath}\\${item}`);
    });
});

chokidar.watch(`${repoPath}/javascript/*.js`).on("change", () => {
  rebuildJs();
});

export default {
  input: getJsFiles(devJsPath).reduce((input, file) => {
    const name = path.basename(file, ".js");
    input[name] = path.resolve(devJsPath, file);
    return input;
  }, {}),
  output: {
    dir: outputJsPath,
    format: "es",
    sourcemap: false,
    entryFileNames: "[name].min.js",
    name: "MyBundle",
    globals: {
      jquery: "$",
    },
  },
  treeshake: {
    moduleSideEffects: true,
  },
  plugins: [
    eslint({
      throwOnError: true,
      include: [
        `${devJsPath}/**/*.js`,
        `${repoPath}/**/*.js`,
        `${devScssPath}/**/*.scss`,
        `${repoPath}/**/*.scss`,
      ],
    }),
    alias({
      entries: [
        {
          find: "@js",
          replacement: path.resolve(projectRootDir, "repo/javascript"),
        },
      ],
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs({
      include: "node_modules/**",
      exclude: [],
    }),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
    }),
    terser(),
    scss(),
    json(),
    serve({
      contentBase: path.resolve(__dirname, `${lan}`),
      port: 3000,
      open: false,
    }),
    livereload({
      watch: path.resolve(__dirname, `${lan}`),
    }),
  ],
  watch: {
    include: [
      `${devJsPath}/**/*.js`,
      `${repoPath}/**/*.js`,
      `${devScssPath}/**/*.scss`,
      `${devEjsPath}/**/*.ejs`,
    ],
    clearScreen: false,
    chokidar: {
      usePolling: true,
    },
  },
};
