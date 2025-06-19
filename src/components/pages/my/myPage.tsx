import MyProfileSection from './myProfileSection'
import MyActivitySection from './myActivitySection'
import AccountControlSection from './accountControlSection'

function MyPage() {
  return (
    <div className="pt-12">
      {/* 상단 여백 */}
      <MyProfileSection />
      <div className="w-full h-3 bg-gray-200"></div>
      <MyActivitySection />
      <div className="mx-4 border-t-[0.5px] border-gray-200"></div>
      <AccountControlSection />
    </div>
  )
}

export default MyPage
