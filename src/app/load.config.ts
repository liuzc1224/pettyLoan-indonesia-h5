import bridge from '../tools/bridge';
// @Injectable()

export class JokesProvider {
    constructor() {

    }
    load() {
        return bridge['getUserLoginInfo']();
    }
}

