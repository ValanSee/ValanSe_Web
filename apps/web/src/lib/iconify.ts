import { addCollection, type IconifyJSON } from '@iconify/react'
import iconBundle from '@/constants/iconBundle.json'

/**
 * 앱에서 쓰는 Iconify 아이콘을 미리 등록한다.
 * 등록된 아이콘은 서버 렌더 HTML 에도 바로 그려지고, 런타임에 api.iconify.design 을 호출하지 않는다.
 * 목록에 없는 아이콘만 기존처럼 API 로 받아오므로, 새 아이콘을 쓰면 `pnpm icons:bundle` 로 다시 생성한다.
 */
// JSON import 는 아이콘 이름별 리터럴 타입으로 추론돼 IconifyJSON 과 직접 호환되지 않음
for (const collection of iconBundle as unknown as IconifyJSON[]) {
  addCollection(collection)
}
