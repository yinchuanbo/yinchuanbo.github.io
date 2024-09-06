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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devJsPath = path.resolve(__dirname, "en/dev/javascript");
const outputJsPath = path.resolve(__dirname, "en/js");

const devScssPath = path.resolve(__dirname, "en/dev/scss");
const outputCssPath = path.resolve(__dirname, "en/css");

const devEjsPath = path.resolve(__dirname, "en/ejs");
const outputHtmlPath = path.resolve(__dirname, "en");

const jsonDataPath = path.resolve(__dirname, "en/lan/lan.json");

const getJsFiles = (dir) => {
  return fs.readdirSync(dir).filter((file) => file.endsWith(".js"));
};

const readJsonData = () => {
  try {
    const data = fs.readFileSync(jsonDataPath, "utf-8");
    if (!data.trim()) {
      console.warn(`JSON file ${jsonDataPath} is empty.`);
      return {};
    }
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading JSON data:`, err);
    return {};
  }
};

const compileEjs = (filename) => {
  console.log("filename", filename);
  const outputPath = path.resolve(
    outputHtmlPath,
    path.basename(filename, ".ejs") + ".html"
  );
  const jsonData = readJsonData();
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
  const name = path.basename(filename, ".scss");
  const cssPath = path.join(outputCssPath, name + ".min.css");
  sass.render(
    {
      file: filename,
      outputStyle: "compressed",
    },
    (error, result) => {
      if (error) {
        console.error(`Error compiling SCSS file ${filename}:`, error);
      } else {
        postcss([autoprefixer])
          .process(result.css, { from: undefined })
          .then((res) => {
            promises
              .writeFile(cssPath, res.css)
              .then(() => {
                console.log(`SCSS file compiled successfully: ${cssPath}`);
              })
              .catch((error) => {
                console.error(
                  `Error writing compiled SCSS file ${cssPath}:`,
                  error
                );
              });
          })
          .catch((error) => {
            console.error(`Error processing CSS with PostCSS:`, error);
          });
      }
    }
  );
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

chokidar.watch(`${devScssPath}/*.scss`).on("change", (file) => {
  scssTask(file);
});

chokidar.watch(`${devScssPath}/components/*.scss`).on("change", (file) => {
  fs.readdirSync(devScssPath)
    .filter((file) => file.endsWith(".scss"))
    .forEach((item) => {
      scssTask(`${devScssPath}/${item}`);
    });
});

chokidar.watch(`${devEjsPath}/*.ejs`).on("change", (file) => {
  compileEjs(file);
});

chokidar.watch(`${devEjsPath}/components/*.ejs`).on("change", () => {
  fs.readdirSync(devEjsPath)
    .filter((file) => file.endsWith(".ejs"))
    .forEach((item) => {
      compileEjs(`${devEjsPath}/${item}`);
    });
});

chokidar.watch(`${devJsPath}/components/*.js`).on("change", () => {
  rebuildJs();
});

chokidar.watch(jsonDataPath).on("change", () => {
  rebuildJs();
  fs.readdirSync(devEjsPath)
    .filter((file) => file.endsWith(".ejs"))
    .forEach((item) => {
      compileEjs(`${devEjsPath}/${item}`);
    });
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
  // external: ['lodash-es'],
  // external: ['jquery'],
  plugins: [
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
      contentBase: path.resolve(__dirname, "en"),
      port: 3000,
      open: false,
    }),
    livereload({
      watch: path.resolve(__dirname, "en"),
    }),
  ],
  watch: {
    include: [
      `${devJsPath}/**/*.js`,
      `${devScssPath}/**/*.scss`,
      `${devEjsPath}/**/*.ejs`,
    ],
    clearScreen: false,
    chokidar: {
      usePolling: true,
    },
  },
};
