import Image from 'next/image'
import Link from 'next/link'

const navOptions = [
  {
    label: '홈',
    icon: 'home.svg',
    route: '/main',
  },
  {
    label: '인기',
    icon: 'hotissue.svg',
    route: '/hotissue',
  },
  {
    label: '밸런스',
    icon: 'valanse.svg',
    route: '/balance',
  },
  {
    label: '만들기',
    icon: 'write.svg',
    route: '/create',
  },
  {
    label: '내 정보',
    icon: 'mypage.svg',
    route: '/my',
  },
]

function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 w-full h-20 bg-white border-t flex items-center shadow-2xl shadow-black z-50">
      {navOptions.map((option) => (
        <Link
          key={option.label}
          href={option.route}
          className="text-center text-sm text-gray-700 flex flex-col items-center justify-center w-full h-10"
        >
          <div className="text-lg">
            <Image
              src={option.icon}
              alt={option.label}
              width={20}
              height={20}
            />
          </div>
          {option.label}
        </Link>
      ))}
    </nav>
  )
}

export default BottomNavBar
