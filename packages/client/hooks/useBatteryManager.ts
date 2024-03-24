import { useEffect, useState } from 'react';

export const useBatteryManager = ({
  onChargingChange,
  onLevelChange,
}: {
  onChargingChange?: (isCharging: boolean) => void;
  onLevelChange?: (batteryLevel: number) => void;
} = {}) => {
  const [isCharging, setIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1);

  const handleChargingChange = (event: Event) => {
    const { charging } = event.target as any;
    setIsCharging(charging);
    onChargingChange && onChargingChange(charging);
  };

  const handleLevelChange = (event: Event) => {
    const { level } = event.target as any;
    setBatteryLevel(level);
    onLevelChange && onLevelChange(level);
  };

  useEffect(() => {
    if (navigator && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setIsCharging(battery.charging);
        setBatteryLevel(battery.level);

        battery.addEventListener('chargingchange', handleChargingChange);
        battery.addEventListener('levelchange', handleLevelChange);

        return () => {
          battery.removeEventListener('chargingchange', handleChargingChange);
          battery.removeEventListener('levelchange', handleLevelChange);
        };
      });
    }
  }, []);

  return { isCharging, batteryLevel };
};
