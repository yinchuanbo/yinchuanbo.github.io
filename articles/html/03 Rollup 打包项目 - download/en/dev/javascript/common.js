import { isValidPhoneNumber, judgeClient, alertC } from "./components/utils";
import { index, about } from "../../lan/lan.json";

console.log(index["index-1"]);
console.log(about["index-1"]);

function test11() {
  const res = isValidPhoneNumber("12456");
  // alertC();
  const devicce = judgeClient();
  console.log("555", res);
  console.log("77777", devicce);
}

test11()