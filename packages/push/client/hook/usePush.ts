import { usePWAManager } from '@remix-pwa/client';
import { useEffect, useState } from 'react';

export type PushObject = {
  /**
   * Boolean state indicating whether the user is subscribed to push notifications or not.
   */
  isSubscribed: boolean;
  /**
   * The push subscription object
   */
  pushSubscription: PushSubscription | null;
  requestPermission: () => NotificationPermission;
  subscribeToPush: (
    publicKey: string,
    callback?: (subscription: PushSubscription) => void,
    errorCallback?: (error: any) => void
  ) => void;
  unsubscribeFromPush: (callback?: () => void, errorCallback?: (error: any) => void) => void;
  /**
   * Boolean state indicating whether the user has allowed sending of push notifications or not.
   */
  canSendPush: boolean;
};

/**
 * Push API hook - contains all your necessities for handling push notifications in the client
 */
export const usePush = (): PushObject => {
  const { swRegistration } = usePWAManager();

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);
  const [canSendPush, setCanSendPush] = useState<boolean>(false);

  const requestPermission = () => {
    if (canSendPush) return 'granted';

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setCanSendPush(true);
        return permission;
      } else {
        setCanSendPush(false);
        return permission;
      }
    });

    return 'default';
  };

  const subscribeToPush = (
    publicKey: string,
    callback?: (subscription: PushSubscription) => void,
    errorCallback?: (error: any) => void
  ) => {
    if (swRegistration === null) return;

    swRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      })
      .then(
        subscription => {
          setIsSubscribed(true);
          setPushSubscription(subscription);
          callback && callback(subscription);
        },
        error => {
          errorCallback && errorCallback(error);
        }
      );
  };

  const unsubscribeFromPush = (callback?: () => void, errorCallback?: (error: any) => void) => {
    if (swRegistration === null) return;

    swRegistration.pushManager
      .getSubscription()
      .then(subscription => {
        if (subscription) {
          subscription.unsubscribe().then(
            () => {
              setIsSubscribed(false);
              setPushSubscription(null);
              callback && callback();
            },
            error => {
              errorCallback && errorCallback(error);
            }
          );
        }
      })
      .catch(error => {
        errorCallback && errorCallback(error);
      });
  };

  useEffect(() => {
    if (swRegistration) {
      swRegistration.pushManager.getSubscription().then(subscription => {
        setIsSubscribed(!!subscription);
        setPushSubscription(subscription);
      });
    }
  }, [swRegistration]);

  return {
    isSubscribed,
    pushSubscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    canSendPush,
  };
};
