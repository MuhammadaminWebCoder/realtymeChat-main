import LoadingOverlay from '@/components/LoadingOverlay';
import { lazy, Suspense } from 'react'

export function UseAuthToken() {
    const FutureLazy = lazy(()=> import('@/futures/index'))
    const LogInLazy = lazy(()=> import('@/pages/login/index'))
    const token = localStorage.getItem("accessToken");
    
    if (token) {
        return <Suspense fallback={<LoadingOverlay/>}><FutureLazy/></Suspense>
    }
    else{
        return <Suspense fallback={<LoadingOverlay/>}><LogInLazy/></Suspense>
    }
}
