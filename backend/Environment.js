export class Env {
  constructor() {
    this.variables = new Map();
    this.functions = new Map();
  }

  declareVar(name, val) {
    if (this.variables.has(name))
      throw new Error(`Redefining variable: ${name}`);
    this.variables.set(name, val);
  }

  assignVar(name, val) {
    if (!this.variables.has(name))
      throw new Error(`Assignment to an undefined variable: ${name}`);
    this.variables.set(name, val);
  }

  getVar(name) {
    try {
      return this.variables.get(name);
    } catch {
      throw Error(`Unkown variable: ${name}`);
    }
  }
}
