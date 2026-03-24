import { useRouter, Href } from 'expo-router';
import { useRef } from 'react';

interface UseSafeRouterOptions {
  timeout?: number;
}

export const useSafeRouter = (options?: UseSafeRouterOptions) => {
  const router = useRouter();

  const isNavigating = useRef(false);
  const TIMEOUT = options?.timeout ?? 50;

  const wrapSafeAction = (action: (href: Href) => void) => {
    // Debounce logic to prevent multiple rapid navigations
    return (href: Href) => {
      if (isNavigating.current) return;

      // Lock navigation when action is triggered
      action(href);
      isNavigating.current = true;

      // Reset the navigating flag after a delay to allow the navigation action to complete
      setTimeout(() => {
        isNavigating.current = false;
      }, TIMEOUT);
    };
  };

  return {
    safePush: wrapSafeAction((href) => router.push(href)),
    safeReplace: wrapSafeAction((href) => router.replace(href)),
    safeNavigate: wrapSafeAction((href) => router.navigate(href)),
    safeBack: () => {
      if (isNavigating.current) return;
      isNavigating.current = true;
      router.back();
      setTimeout(() => {
        isNavigating.current = false;
      }, TIMEOUT);
    },
    isNavigating: isNavigating.current,
  };
};
