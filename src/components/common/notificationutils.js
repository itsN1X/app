const ERROR_ANIMATION = 'shake';
const DEFAULT_NOTIFICATION_POSTION = 'topCenter';
const DEFAULT_NOTIFICATION_TIMEOUT = 1000;
const NOTIFICATION_TYPE = {
  ERROR: "error",
  ALERT: "alert",
  SUCCESS: "SUCCESS"
}
export default class NotificiationUtils {

  constructor(notificationPlayerStream, manager) {
    this.notificationPlayerStream = notificationPlayerStream;
    this.defaultQueueConfig = {
      queue: "global"
    };
    this.manager = manager;
  }

  showError = (error, timeout, position, queueConfig) => {
    if (!position) {
      position = DEFAULT_NOTIFICATION_POSTION;
    }
    if (!queueConfig) {
      queueConfig = this.defaultQueueConfig;
    }

    if (this.notificationPlayerStream) {
      this.notificationPlayerStream.next(NOTIFICATION_TYPE.ERROR)
    }

    return this._showNotification({
      text: error,
      type: 'error',
      timeout: timeout || DEFAULT_NOTIFICATION_TIMEOUT,
      layout: position,
      id: queueConfig.id,
      queue: queueConfig.queue
    });
  }

  showConfirm = (message, timeout, position, queueConfig) => {
    if (!position) {
      position = DEFAULT_NOTIFICATION_POSTION;
    }
    if (!queueConfig) {
      queueConfig = this.defaultQueueConfig;
    }

    if (this.notificationPlayerStream) {
      this.notificationPlayerStream.next(NOTIFICATION_TYPE.ALERT)
    }

    return this._showNotification({
      text: message,
      type: 'confirm',
      timeout: timeout || DEFAULT_NOTIFICATION_TIMEOUT,
      layout: position,
      id: queueConfig.id,
      queue: queueConfig.queue
    });
  }

  showSuccess = (message, timeout, position, queueConfig) => {
    if (!position) {
      position = DEFAULT_NOTIFICATION_POSTION;
    }
    if (!queueConfig) {
      queueConfig = this.defaultQueueConfig;
    }


    if (this.notificationPlayerStream) {
      this.notificationPlayerStream.next(NOTIFICATION_TYPE.SUCCESS)
    }

    return this._showNotification({
      text: message,
      type: 'success',
      timeout: timeout || DEFAULT_NOTIFICATION_TIMEOUT,
      layout: position,
      id: queueConfig.id,
      queue: queueConfig.queue
    })
  }

  _showNotification(notificationConfig) {
    this.manager.showAlert({
      title: notificationConfig.title,
      message: notificationConfig.text,
      alertType: notificationConfig.type,
      position: 'bottom'
    });
  }

  setMaxVisible(max, queueName) {}

  cancelAll(queue) {
    this.cancelAllVisibleNotifications(queue);
    this.cancellAllPendingNotifications(queue);
  }

  cancelAllVisibleNotifications(queue) {}

  cancellAllPendingNotifications(queue) {}
}