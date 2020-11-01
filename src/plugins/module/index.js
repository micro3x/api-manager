
class Main {
  constructor() {
    this.s3 = null;
  }

  init = (dependencies) => {
    this.s3 = dependencies['awsS3'];
  }
}

let instance = new Main();

function getInstance() {
  if(!instance) {
    instance = new Main;
  }
  return instance;
}

export default getInstance();
