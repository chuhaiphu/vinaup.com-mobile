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

  // create new screen instance with fresh state and push it to the screen stack
  const safePush = (href: Href) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(href);
  };

  // create new screen instance with fresh state and replace it with the current screen
  const safeReplace = (href: Href) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.replace(href);
  };

  // pop the current screen from the screen stack and go back to the previous screen
  const safeBack = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.back();
  };

  // navigating to a new route pushes a screen onto a stack, and backing out of that route pops it off the stack
  const safeNavigate = (href: Href) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.navigate(href);
  };

  return { safePush, safeReplace, safeBack, safeNavigate, isNavigating };
};
