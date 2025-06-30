import LoadingOverlay from '@/components/LoadingOverlay';
import { useContactInfo } from '@/store/zustandStore';
import { lazy, Suspense } from 'react';

const FuturesLazy = lazy(() => import('@/futures/index'));
const LoginLazy = lazy(() => import('@/pages/login'));

export function UseAuthToken() {
  const { currentUser, isUserLoaded } = useContactInfo();

  if (!isUserLoaded) return <LoadingOverlay />;

  return (
    <Suspense fallback={<LoadingOverlay />}>
      {currentUser ? <FuturesLazy /> : <LoginLazy />}
    </Suspense>
  );
}
