import { GraphHelper } from "./GraphHelper";

export class GraphController {
  constructor(private readonly graphHelper: GraphHelper) {}

  test(paraData: string, testInputs: (string | (string | number)[])[]) {
    this.graphHelper.generateGraph = paraData;
    this.graphHelper.generateOutput(testInputs);
  }
}
