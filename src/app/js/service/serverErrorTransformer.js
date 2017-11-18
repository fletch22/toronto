class ServerErrorTransformer {
  transform(error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
}

export default new ServerErrorTransformer();
