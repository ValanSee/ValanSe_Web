import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { logoutThunk } from '@/store/thunks/authThunks'
import { useRouter } from 'next/navigation'

export default function AccountControlSection() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logoutThunk())
  }

  const handleSignout = () => {
    router.push('/account-deletion')
  }

  return (
    <section className="bg-white px-4 py-4 text-md">
      <div className="h-10 text-[#555555]">계정 관리</div>
      <div className="flex flex-col gap-3">
        <button className="text-left h-10 font-bold" onClick={handleLogout}>
          로그아웃
        </button>
        <button className="text-left h-10 font-bold" onClick={handleSignout}>
          탈퇴하기
        </button>
      </div>
    </section>
  )
}
