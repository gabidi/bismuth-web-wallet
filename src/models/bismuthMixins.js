import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

const bismuthHelpers = {
  methods: {
    /**
     * @Todo move this to model
     * @param operation
     * @param openField
     */
    getTxnType ({operation, openField}) {
      if (openField && openField.indexOf('msg=') === 0) {
        return 'message'
      }
      const type = operation.match(
        /^([token|hypernode|tx]+){1}:*([a-zA-Z]+)*.*$/
      )
      if (type) {
        const [, txnNameSpace, txnNameSpaceType] = type
        return txnNameSpace
      }

      if (!operation || parseInt(operation) === 0) {
        return 'normal'
      }
      console.warn('Got unknown TXN type', {operation, openField, type})
      return 'unknown'
    },
    getTxnTypeIcon (txnType) {
      switch (txnType) {
        case 'normal':
          return 'format_bold'
        case 'token':
          return 'star_border'
        case 'message':
          return 'sms'
        default:
          return 'unknown'
      }
    },
    getTxnIdFromSignature (sig) {
      // Base 64 decode first 56 chars of sig
      return sig.slice(0, 56)
    },
    getTxnBeneficiaryAddress ({direction, address, recipient}) {
      return (direction === 'incoming') ? address : recipient
    },
    getTxnAmountDirection ({direction, amount}) {
      return (direction === 'incoming' ? 1 : -1) * parseFloat(amount)
    },
    parseTxn ([
      blockHeight,
      timestamp,
      address,
      recipient,
      amount,
      signature,
      publicKey,
      blockHash,
      fee,
      reward,
      operation,
      openField
    ]) {
      const txnType = this.getTxnType({operation, openField})
      const direction = recipient === this.address ? 'incoming' : 'outgoing'
      return {
        blockHeight,
        timestamp,
        address,
        recipient,
        amount,
        amountDirection: this.getTxnAmountDirection({direction, amount}),
        signature,
        publicKey,
        blockHash,
        fee,
        reward,
        operation,
        openField,
        relativeTime: timeAgo.format(
          parseFloat(timestamp) * 1000,
          'twitter'
        ),
        direction,
        txnId: this.getTxnIdFromSignature(signature),
        txnType,
        txnTypeIcon: this.getTxnTypeIcon(txnType)

      }
    }

  }
}

export default bismuthHelpers
