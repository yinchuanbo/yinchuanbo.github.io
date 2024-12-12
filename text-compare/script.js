$(document).ready(function () {
  // 等待所有资源加载完成
  setTimeout(function () {
    // 初始化 Mergely
    const doc = new Mergely("#compare", {
      license: "lgpl-separate-notice",
      lhs: "",
      rhs: "",
      width: "auto",
      height: "calc(100vh - 56px)",
      editor_width: "calc(50% - 25px)",
      editor_height: "100%",
      editor_options: {
        lineNumbers: true,
        lineWrapping: true,
        theme: "ayu-dark",
        styleActiveLine: true,
        matchBrackets: true,
        readOnly: false,
      },
      change_timeout: 150,
      fgcolor: {
        a: "#4b9fff", // 当前活动行
        c: "#a2d2ff", // 内联变化
        d: "#ff7875", // 删除
        ca: "#4b9fff", // 冲突-添加
        cb: "#4b9fff", // 冲突-开始
        cc: "#4b9fff", // 冲突-中间
        cd: "#4b9fff", // 冲突-结束
      },
    });

    // 清空按钮事件
    $("#clearButton").on("click", function () {
      doc.clear("lhs");
      doc.clear("rhs");
    });

    // 比较按钮事件
    $("#compareButton").on("click", function () {
      $("#compare").mergely("update");
    });
  }, 500); // 给一个小延时确保所有资源加载完成
});
