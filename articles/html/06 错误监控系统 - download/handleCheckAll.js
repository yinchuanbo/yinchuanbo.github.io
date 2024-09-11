const fs = require("fs");
const fs2 = require("fs").promises;
const { minify } = require("terser");
const path = require("path");

const sourceFilePath = path.join(__dirname, "checkallExam.js");

const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];

langs.forEach((lan) => {
  const destinationFilePath = path.join(__dirname, lan, "dist/js/check-all.js");
  fs.readFile(sourceFilePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading the source file:", err);
      return;
    }
    const codeContent = data;
    const minified = await minify(codeContent);
    fs.writeFile(destinationFilePath, minified.code, (err) => {
      if (err) {
        console.error("Error writing to the destination file:", err);
      }
    });
  });
});
