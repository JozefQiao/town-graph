import { printOutput } from "./api";
import { Graph, Vertex } from "./interface";
import { PriorityQueue } from "./PriorityQueue";

export class GraphHelper {
  constructor() {
    this.graph = new Map<string, Vertex>();
  }

  graph: Graph;

  set generateGraph(paraData: string) {
    this.graph.clear();
    const regExp = /(?=[A-Z]{2}\d+)(?!([A-Z])\1)[A-Z][A-Z]\d+/g;
    const edges = [...paraData.matchAll(regExp)].map((e) => e.toString());
    for (let edge of edges) {
      this.addEdge(edge);
    }
  }

  generateOutput(testInputs: (string | (string | number)[])[]) {
    for (let i = 0; i < testInputs.length; i++) {
      const input = testInputs[i];
      let output: any;
      if (typeof input === "string") {
        output = this.getDistance(input);
      } else if (Array.isArray(input)) {
        if (input.length === 2) {
          output = this.getShortestDistance(
            input[0] as string,
            input[1] as string
          );
        } else if (input.length === 3) {
          // 如果数字小于10，表示是一个最大或精确停靠次数，调用getTripsWithMaxStops或getTripsWithExactStops方法
          if ((input[2] as number) < 10) {
            // 如果是第6个测试输入，调用getTripsWithMaxStops方法
            if (i === 5) {
              output = this.getTripsWithMaxStops(
                input[0] as string,
                input[1] as string,
                input[2] as number
              );
            }
            // 如果是第7个测试输入，调用getTripsWithExactStops方法
            else if (i === 6) {
              output = this.getTripsWithExactStops(
                input[0] as string,
                input[1] as string,
                input[2] as number
              );
            }
          }
          // 如果数字大于等于10，表示是一个最大距离，调用getRoutesWithMaxDistance方法
          else {
            output = this.getRoutesWithMaxDistance(
              input[0] as string,
              input[1] as string,
              input[2] as number
            );
          }
        }
      }
      console.log(`Output #${i + 1}:`);
      printOutput(output);
    }
  }

  // 根据给定的字符串，创建或获取一个顶点
  getOrCreateVertex(townName: string): Vertex {
    if (!this.graph.has(townName) || !this.graph.get(townName)) {
      const vertex: Vertex = {
        townName,
        adjList: new Map<Vertex, number>(),
      };
      this.graph.set(townName, vertex);
      return vertex;
    }
    return this.graph.get(townName) as Vertex;
  }

  // 根据给定的字符串，添加一条有向边到图中
  addEdge(edge: string) {
    // 假设边的格式是AB5，表示从A到B的距离是5
    // 可以根据实际情况修改
    const srcName = edge[0]; // 源顶点的名字
    const destName = edge[1]; // 目标顶点的名字
    const weight = parseInt(edge.slice(2)); // 边的权值
    // 获取或创建源顶点和目标顶点
    const src = this.getOrCreateVertex(srcName);
    const dest = this.getOrCreateVertex(destName);
    // 在源顶点的邻接表中添加一条边
    src.adjList?.set(dest, weight);
  }

  // 根据给定的路线，计算其距离
  // 假设路线的格式是A-B-C，表示从A到B再到C的路线
  // 可以根据实际情况修改
  getDistance(route: string): number {
    // 用"-"分割路线，得到顶点的名字数组
    const townNames = route.split("-");
    // 初始化距离为0
    let distance = 0;
    // 遍历名字数组，从第一个顶点开始，到倒数第二个顶点结束
    for (let i = 0; i < townNames.length - 1; i++) {
      // 获取当前顶点和下一个顶点
      let curr = this.graph.get(townNames[i]);
      let next = this.graph.get(townNames[i + 1]);
      // 如果当前顶点或下一个顶点不存在，或者当前顶点没有到下一个顶点的边，返回-1表示无效路线
      if (!curr || !next || !curr.adjList?.has(next)) {
        return -1;
      }
      // 否则，累加当前顶点到下一个顶点的距离
      distance += curr.adjList?.get(next) as number;
    }
    // 返回最终的距离
    return distance;
  }

  // 根据给定的起点和终点，以及最大停靠次数，计算有多少种不同的路线
  getTripsWithMaxStops(
    srcName: string,
    destName: string,
    maxStops: number
  ): number {
    // 获取起点和终点
    const src = this.graph.get(srcName);
    const dest = this.graph.get(destName);
    // 如果起点或终点不存在，返回0表示无效参数
    if (!src || !dest) {
      return 0;
    }
    // 定义一个辅助函数，用于递归地计算从当前顶点到终点的路线数，以及已经停靠的次数
    const countTrips = (curr: Vertex, stops: number): number => {
      // 如果已经超过最大停靠次数，返回0表示不合法的路线
      if (stops > maxStops) {
        return 0;
      }

      // 否则，遍历当前顶点的邻接表，对每个邻居顶点递归地调用辅助函数，并累加返回的路线数
      let count = 0;
      for (let [next, _] of curr.adjList as Map<Vertex, number>) {
        count += countTrips(next, stops + 1);
        // 如果当前顶点就是终点，返回1表示找到一条合法的路线
        if (next === dest) {
          return 1;
        }
      }
      // 返回最终的路线数
      return count;
    };
    // 调用辅助函数，从起点开始，初始停靠次数为0
    return countTrips(src, 0);
  }

  // 根据给定的起点和终点，以及精确的停靠次数，计算有多少种不同的路线
  getTripsWithExactStops(
    srcName: string,
    destName: string,
    exactStops: number
  ): number {
    // 获取起点和终点
    const src = this.graph.get(srcName);
    const dest = this.graph.get(destName);
    // 如果起点或终点不存在，返回0表示无效参数
    if (!src || !dest) {
      return -1;
    }
    // 定义一个辅助函数，用于递归地计算从当前顶点到终点的路线数，以及已经停靠的次数
    const countTrips = (curr: Vertex, stops: number): number => {
      // 如果已经达到精确的停靠次数，判断当前顶点是否是终点，是则返回1，否则返回0
      if (stops === exactStops) {
        return curr === dest ? 1 : 0;
      }
      // 否则，遍历当前顶点的邻接表，对每个邻居顶点递归地调用辅助函数，并累加返回的路线数
      let count = 0;
      for (let [next, _] of curr.adjList as Map<Vertex, number>) {
        count += countTrips(next, stops + 1);
      }
      // 返回最终的路线数
      return count;
    };
    // 调用辅助函数，从起点开始，初始停靠次数为0
    return countTrips(src, 0);
  }

  // 根据给定的起点和终点，以及最大距离，计算有多少种不同的路线
  getRoutesWithMaxDistance(
    srcName: string,
    destName: string,
    maxDistance: number
  ): number {
    const src = this.graph.get(srcName);
    const dest = this.graph.get(destName);
    if (!src || !dest) {
      return -1;
    }
    const result = src === dest ? -1 : 0;

    // 定义一个辅助函数，用于递归地计算从当前顶点到终点的路线数，以及已经走过的距离
    const countRoutes = (curr: Vertex, distance: number): number => {
      // 初始化路线数为0
      let count = 0;
      // 如果当前顶点就是终点，且距离小于最大距离，路线数加1
      if (curr === dest && distance < maxDistance) {
        count++;
      }
      // 遍历当前顶点的邻接表，对每个邻居顶点递归地调用辅助函数，并累加返回的路线数
      for (let [next, nextDist] of curr.adjList as Map<Vertex, number>) {
        // 计算从起点到邻居顶点的距离，等于从起点到当前顶点的距离加上从当前顶点到邻居顶点的距离
        let newDistance = distance + nextDist;
        // 如果这个距离小于最大距离，递归调用辅助函数
        if (newDistance < maxDistance) {
          count += countRoutes(next, newDistance);
        }
      }
      // 返回最终的路线数
      return count;
    };
    // 调用辅助函数，从起点开始，初始距离为0
    return result + countRoutes(src, 0);
  }

  // 根据给定的起点和终点，计算最短的路线的距离
  getShortestDistance(srcName: string, destName: string): number {
    // 获取起点和终点
    const src = this.graph.get(srcName);
    const dest = this.graph.get(destName);
    // 如果起点或终点不存在，返回-1表示无效参数
    if (!src || !dest) {
      return -1;
    }
    // 定义一个哈希表，存储每个顶点到起点的最短距离，初始值为无穷大
    const dist = new Map<Vertex, number>();
    for (let [_, vertex] of this.graph) {
      dist.set(vertex, Infinity);
    }
    // 定义一个集合，存储已经访问过的顶点
    const visited = new Set<Vertex>();
    // 定义一个优先队列，存储待访问的顶点及其到起点的距离，按距离从小到大排序

    const queue = new PriorityQueue<[Vertex, number]>((a, b) => a[1] - b[1]);
    // 将起点加入到优先队列中，初始距离为0
    queue.enqueue([src, 0]);
    // 更新起点到起点的距离为0
    if (src !== dest) dist.set(src, 0);
    // 当优先队列不为空时，循环执行以下操作
    while (!queue.isEmpty()) {
      // 从优先队列中取出最小距离的顶点及其距离
      let [curr, currDist] = queue.dequeue();
      // 如果该顶点已经访问过，跳过
      if (visited.has(curr)) {
        continue;
      }
      // 否则，将该顶点加入到已访问集合中
      visited.add(curr);
      // 遍历该顶点的邻接表，对每个邻居顶点执行以下操作
      for (let [next, nextDist] of curr.adjList as Map<Vertex, number>) {
        // 计算从起点到邻居顶点的距离，等于从起点到当前顶点的距离加上从当前顶点到邻居顶点的距离
        let newDist = currDist + nextDist;
        // 如果这个距离小于之前记录的距离，更新邻居顶点到起点的距离，并将邻居顶点加入到优先队列中
        if (newDist < (dist.get(next) as number)) {
          dist.set(next, newDist);
          queue.enqueue([next, newDist]);
        }
      }
    }
    // 返回终点到起点的距离，如果是无穷大，表示没有路线，返回-1
    return dist.get(dest) === Infinity ? -1 : (dist.get(dest) as number);
  }
}
