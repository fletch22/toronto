class TimeTravelTransaction {

  constructor() {
    this.TransactionSignifier = {
      TRANSACTION_ID_UNSET: -1,
      TRANSACTION_ID_BEFORE_FIRST_TRANSACTION: -2
    }
    this.transactionId = this.TransactionSignifier.TRANSACTION_ID_UNSET;
  }

  isTimeTravelNecessary() {
    return (this.transactionId !== this.TransactionSignifier.TRANSACTION_ID_UNSET);
  }

  setTransactionToRewindToBeforeEarliestState() {
    this.transactionId = this.TransactionSignifier.TRANSACTION_ID_BEFORE_FIRST_TRANSACTION;
  }
}

export default new TimeTravelTransaction();