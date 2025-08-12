import { useState, useEffect } from 'react';
/**
 * Return the Screen Size
 * @returns {"mobile" | "small-tablet" | "tablet" | "desktop" | "large-desktop" | "extra-large-desktop"}
 */
const useDeviceType = ():
  | 'mobile'
  | 'small-tablet'
  | 'tablet'
  | 'desktop'
  | 'large-desktop'
  | 'extra-large-desktop' => {
  const [deviceType, setDeviceType] = useState<
    | 'mobile'
    | 'small-tablet'
    | 'tablet'
    | 'desktop'
    | 'large-desktop'
    | 'extra-large-desktop'
  >(
    window.innerWidth < 768
      ? 'mobile'
      : window.innerWidth < 1000
      ? 'small-tablet'
      : window.innerWidth < 1400
      ? 'tablet'
      : // : window.innerWidth < 1400
      // ? 'large-tablet'
      window.innerWidth < 1520
      ? 'desktop'
      : window.innerWidth < 1600
      ? 'large-desktop'
      : 'extra-large-desktop'
  );

  const updateDeviceType = () => {
    const newDeviceType =
      window.innerWidth < 768
        ? 'mobile'
        : window.innerWidth < 1000
        ? 'small-tablet'
        : window.innerWidth < 1400
        ? 'tablet'
        : // : window.innerWidth < 1400
        // ? 'large-tablet'
        window.innerWidth < 1540
        ? 'desktop'
        : window.innerWidth < 1600
        ? 'large-desktop'
        : 'extra-large-desktop';

    setDeviceType(newDeviceType);
  };

  useEffect(() => {
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => {
      window.removeEventListener('resize', updateDeviceType);
    };
  }, []); 

  return deviceType;
};

export default useDeviceType;
