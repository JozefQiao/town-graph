import fs from "node:fs/promises";

export class DataService {
  constructor() {}

  readLocalData(data?: string) {
    if (!data) return "AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7";
    return data;
  }

  async readDataFromFile(path: string) {
    const data = await fs.readFile(path, { encoding: "utf8" });
    return data;
  }
}
