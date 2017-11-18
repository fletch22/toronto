class SentStateAuditTrail {
  constructor() {
    this.collection = [];
  }

  collect(statePackageSendArray) {
    if (statePackageSendArray) {
      const ids = [];
      statePackageSendArray.forEach((item) => {
        ids.push(item.clientId);
      });
      this.save(ids);
    }
  }

  gatherRecent() {
    const maxToGather = 100;
    let count = 0;
    const lastSendArrayIndex = this.collection.length - 1;
    const gathered = [];
    for (let i = lastSendArrayIndex; i >= 0; i--) {
      const sendArray = this.collection[i];
      count += sendArray.length;
      gathered.push(sendArray);
      if (count >= maxToGather) {
        break;
      }
    }
    return gathered;
  }

  save(ids) {
    this.collection.push(ids);
  }
}

export default SentStateAuditTrail;

