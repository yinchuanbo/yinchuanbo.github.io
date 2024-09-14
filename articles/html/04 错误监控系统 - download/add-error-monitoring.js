const fs = require("fs");
const { minify } = require("terser");
const path = require("path");

const sourceFilePath = path.join(__dirname, "error-monitoring-template.js");

const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];

langs.forEach((lan) => {
  const destinationFilePath = path.join(
    __dirname,
    lan,
    "dist/js/error-monitoring.min.js"
  );
  const patilesPath = `./${lan}/patiles`;
  const scriptTag =
    '<script type="text/javascript" src="/dist/js/error-monitoring.min.js"></script>\n';
  function processDirectorySync(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          processDirectorySync(filePath);
        } else if (path.extname(file) === ".ejs" && file.endsWith("head.ejs")) {
          processFileSync(filePath);
        }
      });
    } catch (err) {
      console.error("Unable to scan directory:", err);
    }
  }

  function processFileSync(filePath) {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      if (data.includes(scriptTag)) {
        console.log(`Script already exists in: ${filePath}`);
        return;
      }
      const updatedData = scriptTag + data;
      fs.writeFileSync(filePath, updatedData, "utf8");
      console.log(`Script added to: ${filePath}`);
    } catch (err) {
      console.error("Error reading or writing file:", err);
    }
  }

  try {
    const codeContent = fs.readFileSync(sourceFilePath, "utf8");
    minify(codeContent).then((minified) => {
      try {
        fs.writeFileSync(destinationFilePath, minified.code);
        processDirectorySync(patilesPath);
      } catch (err) {
        console.error("Error writing to the destination file:", err);
      }
    });
  } catch (err) {
    console.error("Error reading the source file:", err);
  }
});
