import { isValidPhoneNumber, judgeClient, alertC } from "./components/utils";
import { index, about } from "../../lan/lan.json";

console.log(index["index-1"]);
console.log(about["index-1"]);

// 我是好人

function test11() {
  const res = isValidPhoneNumber("12456");
  const devicce = judgeClient();
  console.log("555", res);
  console.log("666", devicce);
}

test11();

const demo = (str = "") => {
  console.log("str", str);
};

demo("demo");
