export const getBatteryStatus = async () => {
  if (navigator && 'getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (err) {
      console.error('Error getting battery status:', err);
    }
  } else {
    console.warn('Battery API is not supported');
  }
};
