import { throws } from "assert";

class Route {
    constructor(
        private path: string,
        private callback: Function,
    ) {};

    get Path() {
        return this.path;
    }

    get Callback() {
        return this.callback;
    }
}

export default Route;