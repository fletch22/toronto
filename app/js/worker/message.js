const MessageTypes = {
  PersistMessage: 1,
  PauseQueue: 2,
  IsPaused: 3
};

exports.MessageTypes = MessageTypes;

const Message = function(messageBody, type) {
  const self = this;

  self.body = messageBody;
  self.type = type;
};

export default Message;
