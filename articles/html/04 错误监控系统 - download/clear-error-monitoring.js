const fs = require("fs");
const { glob } = require("glob");

// 要删除的 script 标签
const scriptToRemove = /(\r?\n)?<script type="text\/javascript" src="\/dist\/js\/error-monitoring\.min\.js"><\/script>(\r?\n)?/g;

// 匹配的文件路径
const patterns = ["**/*.ejs", "**/*.html"];


patterns.forEach(async (pattern) => {
  const files = await glob(pattern, { ignore: "node_modules/**" });
  files.forEach((file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}: ${err}`);
        return;
      }

      // 删除指定的 script 标签
      const result = data.replace(new RegExp(scriptToRemove, "g"), "");

      // 如果文件内容有所改变，则写回文件
      if (result !== data) {
        fs.writeFile(file, result, "utf8", (err) => {
          if (err) {
            console.error(`Error writing file ${file}: ${err}`);
          } else {
            console.log(`Removed script from ${file}`);
          }
        });
      } else {
        console.log(`No changes made to ${file}`);
      }
    });
  });
});
