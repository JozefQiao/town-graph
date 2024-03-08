// 定义一个类来表示优先队列，使用数组实现，可以根据给定的比较函数排序元素
export class PriorityQueue<T> {
  // 存储元素的数组
  private data: T[];
  // 比较函数，用于确定元素的优先级
  private compare: (a: T, b: T) => number;

  // 构造函数，初始化数组和比较函数
  constructor(compare: (a: T, b: T) => number) {
    this.data = [];
    this.compare = compare;
  }

  // 判断优先队列是否为空
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  // 返回优先队列的大小
  size(): number {
    return this.data.length;
  }

  // 向优先队列中插入一个元素
  enqueue(item: T) {
    // 将元素添加到数组末尾
    this.data.push(item);
    // 获取该元素的索引
    let index = this.data.length - 1;
    // 如果该元素不是根节点，且优先级高于父节点，执行上浮操作
    while (
      index > 0 &&
      this.compare(this.data[index], this.data[this.parent(index)]) < 0
    ) {
      // 交换该元素和父节点的位置
      this.swap(index, this.parent(index));
      // 更新索引为父节点的索引
      index = this.parent(index);
    }
  }

  // 从优先队列中取出最高优先级的元素
  dequeue(): T {
    // 如果优先队列为空，抛出异常
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    // 获取根节点，即最高优先级的元素
    let root = this.data[0];
    // 获取最后一个节点
    let last = this.data.pop() as T;
    // 如果优先队列不为空，将最后一个节点放到根节点的位置，执行下沉操作
    if (!this.isEmpty()) {
      this.data[0] = last;
      this.sink(0);
    }
    // 返回根节点
    return root;
  }

  // 返回最高优先级的元素，但不删除
  peek(): T {
    // 如果优先队列为空，抛出异常
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    // 返回根节点
    return this.data[0];
  }

  // 根据索引获取父节点的索引
  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  // 根据索引获取左子节点的索引
  private left(index: number): number {
    return index * 2 + 1;
  }

  // 根据索引获取右子节点的索引
  private right(index: number): number {
    return index * 2 + 2;
  }

  // 交换数组中两个元素的位置
  private swap(i: number, j: number) {
    let temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
  }

  // 下沉操作，用于恢复堆的有序性
  private sink(index: number) {
    // 获取左右子节点的索引
    let left = this.left(index);
    let right = this.right(index);
    // 假设当前节点是最小的节点
    let smallest = index;
    // 如果左子节点存在，且优先级高于当前节点，更新最小节点为左子节点
    if (
      left < this.data.length &&
      this.compare(this.data[left], this.data[smallest]) < 0
    ) {
      smallest = left;
    }
    // 如果右子节点存在，且优先级高于当前最小节点，更新最小节点为右子节点
    if (
      right < this.data.length &&
      this.compare(this.data[right], this.data[smallest]) < 0
    ) {
      smallest = right;
    }
    // 如果最小节点不是当前节点，交换它们的位置，并对最小节点递归地执行下沉操作
    if (smallest !== index) {
      this.swap(index, smallest);
      this.sink(smallest);
    }
  }
}
