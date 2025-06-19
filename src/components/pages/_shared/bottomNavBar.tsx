import Image from 'next/image';

const navItems = ['홈', '인기','밸런스', '만들기', '내 정보'];
const icons = ['home.svg', 'hotissue.svg', 'valanse.svg', 'write.svg', 'mypage.svg'];

function BottomNavBar() {
    return (
      <nav className="fixed bottom-0 w-full h-20 bg-white border-t flex items-center justify-around">
        {navItems.map((label, i) => (
          <div key={i} className="text-center text-sm text-gray-700 flex flex-col items-center justify-center w-full h-10">
            <div className="text-lg">
              <Image src={icons[i]} alt={label} width={20} height={20} />
            </div>
            {label}
          </div>
        ))}
      </nav>
    )
}

export default BottomNavBar