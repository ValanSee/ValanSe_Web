/**
 * schema.org 구조화 데이터(JSON-LD) 출력. 서버 컴포넌트에서 사용.
 * 사용자 입력이 섞이므로 `<` 를 이스케이프해 </script> 주입을 막음.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
