'use client'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import AuthBootstrap from './authBootstrap'
import { Toaster } from '@/components/ui/toaster'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {/* 앱 시작 시 또는 새로고침 시 인증/프로필 복구 로직 */}
      <AuthBootstrap />
      {children}
      <Toaster />
    </Provider>
  )
}
export default Providers
