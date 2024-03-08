export type Graph = Map<string, Vertex>;

export interface Vertex {
  // 顶点的名字，如A, B, C等
  townName: string;
  // 顶点的邻接表，存储了从该顶点出发的所有有向边的终点和权值
  adjList: Map<Vertex, number>;
}
