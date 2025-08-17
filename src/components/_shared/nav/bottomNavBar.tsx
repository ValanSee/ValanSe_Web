import { Suspense } from 'react'
import NavBarContent from './navBarContent'

function BottomNavBar() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBarContent />
    </Suspense>
  )
}

export default BottomNavBar
