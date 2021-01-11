class Middleware<T = Object | null> {//задокумментировать
  constructor(
      private chainHandlers: Array<Function> = [],
  ) {}
  public use(handler: Function) {
     this.chainHandlers.push(handler);
  }
  private executeMiddleware(objectData: T) {
    this.chainHandlers.reduce(
        (previousReturned, currentHandler) => currentHandler(previousReturned),
        objectData,
    );
  }
  public run(objectData: T) {
      return this.executeMiddleware(objectData);
  }
}

export default Middleware;