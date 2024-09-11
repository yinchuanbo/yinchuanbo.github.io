const fs = require("fs-extra");
const path = require("path");
const acorn = require("acorn");
const { Translator } = require("google-translate-api-x");
const fetch = require("node-fetch");
global.fetch = fetch;

const languageDirs = [
  "en",
  "ar",
  "de",
  "es",
  "fr",
  "it",
  "jp",
  "kr",
  "pt",
  "tw",
];

const paths = `/dist/js/`;

const noWatchList = [
  "bottom-message",
  "credits",
  "pay",
  "share-dialog",
  "popup",
  "confirm-dialog",
  "commonSignin",
  "self-select",
];

const getFilesInDirectory = (dir, noWatchList) => {
  let filesFound = [];
  const filesAndDirs = fs.readdirSync(dir);
  filesAndDirs.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (noWatchList.includes(item)) {
        const jsFiles = fs
          .readdirSync(fullPath)
          .filter((file) => file.endsWith(".js"))
          .map((file) => path.join(fullPath, file));
        filesFound = filesFound.concat(jsFiles);
      }
    }
  });
  return filesFound;
};

async function translateComments(inputPath, outputPath) {
  const code = await fs.readFile(inputPath, "utf-8");
  const comments = [];
  const ast = acorn.parse(code, {
    ecmaVersion: 2023,
    sourceType: "module",
    locations: true,
    onComment: (block, text, start, end) => {
      comments.push({
        type: block ? "Block" : "Line",
        value: text,
        start,
        end,
      });
    },
  });

  const translator = new Translator();
  for (let comment of comments) {
    if (/[\u4e00-\u9fa5]/.test(comment.value)) {
      const translated = await translator.translate(comment.value.trim(), {
        from: "zh-CN",
        to: "en",
      });
      comment.translatedValue = translated.text;
    }
  }
  let result = "";
  let lastIndex = 0;
  for (let comment of comments) {
    result += code.slice(lastIndex, comment.start);
    if (comment.translatedValue) {
      result +=
        comment.type === "Line"
          ? "//" + comment.translatedValue
          : "/*" + comment.translatedValue + "*/";
    } else {
      result += code.slice(comment.start, comment.end);
    }
    lastIndex = comment.end;
  }
  result += code.slice(lastIndex);
  await fs.outputFile(outputPath, result);
  console.log(`Translated file saved to: ${outputPath}`);
}

const translateCommentsInAllDirectories = async () => {
  for (const langDir of languageDirs) {
    const targetDir = `./${langDir}${paths}`;
    const jsFilesInNoWatchListDirs = getFilesInDirectory(
      targetDir,
      noWatchList
    );
    for (const file of jsFilesInNoWatchListDirs) {
      const inputPath = file;
      const outputPath = file;
      if (!fs.existsSync(inputPath)) {
        console.error(`Error: Input file "${inputPath}" does not exist.`);
        process.exit(1);
      }
      translateComments(inputPath, outputPath).catch((err) => {
        console.error("Translation error:" + inputPath, err, inputPath);
        process.exit(1);
      });
    }
  }
};

translateCommentsInAllDirectories();
