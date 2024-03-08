import { GraphHelper } from "./GraphHelper";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { DataService } from "./DataService";
import { GraphController } from "./GraphController";

async function main() {
  const testInputs = [
    "A-B-C", // 1. The distance of the route A-B-C.
    "A-D", // 2. The distance of the route A-D.
    "A-D-C", // 3. The distance of the route A-D-C.
    "A-E-B-C-D", // 4. The distance of the route A-E-B-C-D.
    "A-E-D", // 5. The distance of the route A-E-D.
    ["C", "C", 3], // 6. The number of trips starting at C and ending at C with a maximum of 3 stops.
    ["A", "C", 4], // 7. The number of trips starting at A and ending at C with exactly 4 stops.
    ["A", "C"], // 8. The length of the shortest route (in terms of distance to travel) from A to C.
    ["B", "B"], // 9. The length of the shortest route (in terms of distance to travel) from B to B.
    ["C", "C", 30], // 10. The number of different routes from C to C with a distance of less than 30.
  ];

  let paraData = "";
  const db = new DataService();
  const rl = readline.createInterface({ input, output });
  const gh = new GraphHelper();
  const gc = new GraphController(gh);

  console.log(`Please select one way to input data:
    1: Use the default data(Graph: AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7)
    2: Import data from file(local)
    3: Manual Input`);

  rl.on("line", (input) => {
    switch (input) {
      case "1":
        paraData = db.readLocalData();
        console.log("default:" + paraData);
        gc.test(paraData, testInputs);
        rl.close();
        break;
      case "2":
        rl.question("Please input the file path:", async (answer) => {
          try {
            paraData = await db.readDataFromFile(answer);
            console.log(`Your input data is ${paraData}`);
            gc.test(paraData, testInputs);
          } catch (err) {
            console.error(err);
          }
          rl.close();
        });
        break;
      case "3":
        rl.question("Please input your parameters:\n", (answer) => {
          paraData = db.readLocalData(answer);
          gc.test(paraData, testInputs);
          rl.close();
        });
        break;
      default:
        console.log("Illegal input, please input the right number");
        break;
    }
  });
}

main();
