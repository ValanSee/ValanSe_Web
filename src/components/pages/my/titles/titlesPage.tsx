'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Header from '../_shared/header'
import Loading from '@/components/_shared/loading'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import {
  equipTitleThunk,
  fetchPointHistoryThunk,
  fetchTitlesThunk,
  purchaseTitleThunk,
} from '@/store/thunks/memberThunks'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import { Title } from '@/types/_shared/title'
import TitleCurrentSection from './titleCurrentSection'
import TitleTabs, { TitleTabKey } from './titleTabs'
import TitleCard from './titleCard'
import TitleEquipModal from './titleEquipModal'
import TitlePurchaseModal from './titlePurchaseModal'

type ModalState =
  | { mode: 'equip' | 'purchase'; title: Title }
  | null

const TitlesPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const titles = useAppSelector((state) => state.member.titles)
  const pointHistory = useAppSelector((state) => state.member.pointHistory)
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState<TitleTabKey>('owned')
  const [modal, setModal] = useState<ModalState>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        await Promise.all([
          dispatch(fetchTitlesThunk()),
          dispatch(fetchPointHistoryThunk()),
        ])
        if (!cancelled) setLoaded(true)
      } catch {
        router.replace(entryHrefWithRedirect(pathname))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [dispatch, pathname, router])

  const equipped = useMemo<Title | null>(() => {
    if (!titles) return null
    return (
      [...titles.defaultTitles, ...titles.ownedTitles].find(
        (t) => t.equipped,
      ) ?? null
    )
  }, [titles])

  const point = pointHistory?.[0]?.remainingPoint ?? 0

  if (!loaded || !titles) return <Loading />

  const ownedAll = [...titles.defaultTitles, ...titles.ownedTitles]
  const lockedAll = titles.lockedTitles
  const visible = tab === 'owned' ? ownedAll : lockedAll

  const handleAction = (title: Title) => {
    if (title.equipped) return
    if (!title.locked) {
      setModal({ mode: 'equip', title })
    } else if (title.acquisitionType === 'POINT_PURCHASE') {
      setModal({ mode: 'purchase', title })
    }
  }

  const handleClose = () => {
    if (pending) return
    setModal(null)
  }

  const handleConfirm = async () => {
    if (!modal) return
    setPending(true)
    try {
      if (modal.mode === 'equip') {
        await dispatch(equipTitleThunk(modal.title.titleId))
      } else {
        await dispatch(purchaseTitleThunk(modal.title.titleId))
        // 잔액 동기화: pointHistory 재조회
        await dispatch(fetchPointHistoryThunk())
      }
      setModal(null)
    } catch (err) {
      console.error('칭호 동작 실패', err)
      alert('처리에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-pretendard">
      <Header title="칭호" />
      <TitleCurrentSection equipped={equipped} point={point} />
      <div className="w-full h-3 bg-[#F0F0F0]" />
      <TitleTabs
        active={tab}
        onChange={setTab}
        ownedCount={ownedAll.length}
        lockedCount={lockedAll.length}
      />
      <ul className="px-4 pb-20">
        {visible.length === 0 ? (
          <li className="py-16 text-center text-sm text-[#8E8E8E]">
            {tab === 'owned'
              ? '보유한 칭호가 없어요'
              : '잠금 칭호가 없어요'}
          </li>
        ) : (
          visible.map((t) => (
            <TitleCard key={t.titleId} title={t} onAction={handleAction} />
          ))
        )}
      </ul>

      <TitleEquipModal
        open={modal?.mode === 'equip'}
        title={modal?.mode === 'equip' ? modal.title : null}
        pending={pending}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
      <TitlePurchaseModal
        open={modal?.mode === 'purchase'}
        title={modal?.mode === 'purchase' ? modal.title : null}
        point={point}
        pending={pending}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default TitlesPage
