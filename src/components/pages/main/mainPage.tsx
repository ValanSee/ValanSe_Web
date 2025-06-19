import HotIssueSection from './hotIssueSection'
import GameCreateSection from './gameCreateSection'
import CategorySection from './categorySection'
import BottomNavBar from '../_shared/bottomNavBar'

const MainPage = () => {
  return (
    <div className="w-full h-screen pt-12 bg-[#F0F0F0]">
      <HotIssueSection />
      <div className="flex flex-col px-4 pt-10">
        <GameCreateSection />
        <CategorySection />
      </div>
      <BottomNavBar />
    </div>
  )
}

export default MainPage
