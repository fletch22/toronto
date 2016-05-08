

class MessagePoster {

  post(message) {
    try {
      // NOTE: This is necessary so our tests don't throw. When some tests are run
      // they are run in a window context as opposed to a worker context. When in the window context
      // then this code will use window.postMessage. PostMessage function expects a second parameter and will throw if it doesn't find one.
      // If we are in the worker context the second (unneeded) parameter will be ignored.
      const domain = (typeof window !== 'undefined') ? location.href : undefined;
      postMessage(message, domain);
    } catch (err) {
      console.error(err, err.stack);
    }
  }
}

export default MessagePoster;