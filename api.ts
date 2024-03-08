// 定义一个函数，用于打印输出结果
export function printOutput(output: any) {
  // 如果输出是一个数字，直接打印
  if (typeof output === "number" && output !== -1) {
    console.log(output);
  }
  // 如果输出是-1，表示没有路线，打印"NO SUCH ROUTE"
  else if (output === -1) {
    console.log("NO SUCH ROUTE");
  }
  // 否则，打印输出的字符串表示
  else {
    console.log(output.toString());
  }
}
