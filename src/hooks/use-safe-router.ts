import { useState, useCallback } from 'react';
import { Href, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export const useSafeRouter = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset navigating state when screen is focused again
  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false);
    }, [])
  );

  const safePush = (href: Href) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(href);
  };

  const safeReplace = (href: Href) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.replace(href);
  };

  return { safePush, safeReplace, isNavigating };
};
