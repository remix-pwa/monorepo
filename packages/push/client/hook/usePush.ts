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
  /**
   * Request permission for push notifications
   * @returns The permission status of the push notifications
   */
  requestPermission: () => NotificationPermission;
  /**
   * Utility to subscribe to push notifications
   * @param publicKey the public vapid key
   * @param callback a callback function to be called when the subscription is successful
   * @param errorCallback a callback function to be called if the subscription fails
   */
  subscribeToPush: (
    publicKey: string,
    callback?: (subscription: PushSubscription) => void,
    errorCallback?: (error: any) => void
  ) => void;
  /**
   * Utility to unsubscribe from push notifications
   * @param callback a callback function to be called when the unsubscription is successful
   * @param errorCallback a callback function to be called if the unsubscription fails
   */
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
  const [swRegistration, setSWRegistration] = useState<ServiceWorkerRegistration | null>(null);
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
    if (typeof window === 'undefined') return;

    const getRegistration = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const _registration = await navigator.serviceWorker.getRegistration();
          setSWRegistration(_registration ?? null);
        } catch (err) {
          console.error('Error getting service worker registration:', err);
        }
      } else {
        console.warn('Service Workers are not supported in this browser.');
      }
    };

    const handleControllerChange = () => {
      getRegistration();
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    getRegistration();

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, []);

  useEffect(() => {
    if (swRegistration) {
      swRegistration.pushManager.getSubscription().then(subscription => {
        setIsSubscribed(!!subscription);
        setPushSubscription(subscription);
      });

      Notification.permission === 'granted' ? setCanSendPush(true) : setCanSendPush(false);
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
