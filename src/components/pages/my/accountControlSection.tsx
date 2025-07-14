import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { logoutThunk } from '@/store/thunks/authThunks'

export default function AccountControlSection() {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logoutThunk())
  }

  return (
    <section className="bg-white px-4 py-4 text-md">
      <div className="h-10">계정 관리</div>
      <div className="flex flex-col gap-3">
        <div className="text-left h-10 font-bold" onClick={handleLogout}>
          로그아웃
        </div>
        <div className="text-left h-10 font-bold">탈퇴하기</div>
      </div>
    </section>
  )
}
