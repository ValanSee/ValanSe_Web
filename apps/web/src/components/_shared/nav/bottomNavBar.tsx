import { Suspense } from 'react'
import NavBarContent from './navBarContent'
import Loading from '@/components/_shared/loading'

function BottomNavBar() {
  return (
    <Suspense fallback={<Loading />}>
      <NavBarContent />
    </Suspense>
  )
}

export default BottomNavBar
