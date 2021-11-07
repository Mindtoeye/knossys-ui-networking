
/**
 * 
 */
class KQueue {

  /**
   * 
   */
  constructor () {
    this.queue = [];
    this.tail = 0;
    this.head = 0;
    this.queueSize=0; // no size limit
  }

  /**
   * 
   */
  setQueueSize (aSize) {
    this.queueSize=aSize;
  }

  /**
   * 
   */
  getQueue () {
    return (this.queue);
  }
  
  /**
   * 
   */   
  enqueue (element) {
    this.queue.push(element);

    if (this.queueSize>0) {
      if (this.queue.length>this.queueSize) {
        this.queue.splice(0,1);
      }
    }
  }

  /**
   * 
   */
  dequeue () {
    if (this.tail === this.head) {
      return undefined
    }

    this.queue.splice(0,1);
  }
}

export default KQueue;
