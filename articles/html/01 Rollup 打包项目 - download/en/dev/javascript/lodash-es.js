import { debounce } from "lodash-es";

const myFunction = () => {
  console.log("Function executed!");
};

const debouncedFunction = debounce(myFunction, 300);

// 绑定事件
window.addEventListener("resize", debouncedFunction);
