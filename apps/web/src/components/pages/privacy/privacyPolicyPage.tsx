import type { Metadata } from 'next'

const APP_NAME = 'Valanse'
const CONTACT_EMAIL = 'valansekr@gmail.com'
const SERVICE_URL = 'https://valanse.kr'
const EFFECTIVE_DATE = '2026-01-23' // 시행일자(필요 시 변경)

export const metadata: Metadata = {
  title: `개인정보 처리방침 | ${APP_NAME}`,
  description: `${APP_NAME} 개인정보 처리방침`,
  robots: { index: true, follow: true },
}

export const PrivacyPolicyPage = () => {
  return (
    <main
      style={{
        padding: '32px 16px',
        maxWidth: 920,
        margin: '0 auto',
        lineHeight: 1.75,
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>개인정보 처리방침</h1>
        <p style={{ marginTop: 8, color: '#555' }}>
          {APP_NAME}(이하 “서비스”)는 이용자의 개인정보를 중요하게 생각하며,
          관련 법령을 준수합니다.
        </p>
        <p style={{ marginTop: 8, color: '#555' }}>
          시행일자: <strong>{EFFECTIVE_DATE}</strong>
        </p>
      </header>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          1. 수집하는 개인정보 항목
        </h2>
        <p style={{ marginTop: 0 }}>
          서비스는 카카오 로그인을 통해 회원가입/로그인을 제공하며, 다음 정보를
          수집할 수 있습니다.
        </p>
        <ul>
          <li>
            <strong>카카오 계정 식별자</strong> (예: 카카오에서 제공하는 고유
            ID)
          </li>
          <li>
            <strong>프로필 정보</strong> (예: 닉네임, 프로필 이미지) —
            카카오에서 제공되는 범위 내
          </li>
          <li>
            <strong>서비스 이용 기록</strong> (예: 접속 로그, 이용 내역, 오류
            로그)
          </li>
          <li>
            <strong>기기/환경 정보</strong> (예: OS, 브라우저 종류, 앱 버전 등
            서비스 제공을 위한 최소 정보)
          </li>
        </ul>
        <p style={{ color: '#555' }}>
          ※ 서비스는 원칙적으로 주민등록번호, 금융정보 등 민감정보를 수집하지
          않습니다.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          2. 개인정보 수집 및 이용 목적
        </h2>
        <ul>
          <li>카카오 로그인 기반 회원 식별 및 계정 관리</li>
          <li>서비스 제공 및 기능 운영, 고객 문의 대응</li>
          <li>서비스 안정성 확보(오류 확인/분석) 및 보안/부정 이용 방지</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          3. 개인정보 보관 및 이용 기간
        </h2>
        <p style={{ marginTop: 0 }}>
          서비스는 개인정보의 수집·이용 목적이 달성되면 지체 없이 파기합니다.
          다만, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 법령에서 정한
          기간 동안 보관할 수 있습니다.
        </p>
        <ul>
          <li>
            <strong>회원 정보</strong>: 회원 탈퇴 시까지 (탈퇴 후 지체 없이
            파기)
          </li>
          <li>
            <strong>이용 기록/로그</strong>: 서비스 안정성 및 보안 목적 범위
            내에서 필요한 기간 보관 후 파기
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          4. 개인정보의 제3자 제공
        </h2>
        <p style={{ marginTop: 0 }}>
          서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          다만, 법령에 근거가 있거나 이용자의 사전 동의를 받은 경우에 한하여
          제공할 수 있습니다.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>5. 개인정보 처리 위탁</h2>
        <p style={{ marginTop: 0 }}>
          서비스 운영을 위해 아래와 같은 외부 서비스를 이용할 수 있으며, 필요한
          경우 개인정보 처리를 위탁할 수 있습니다.
        </p>
        <ul>
          <li>
            <strong>카카오(Kakao Corp.)</strong>: 카카오 로그인(OAuth) 제공
          </li>
          <li>
            <strong>AWS(아마존웹서비스)</strong>: 서버 인프라 운영(예: EC2
            환경에서 백엔드(Spring) 운영)
          </li>
        </ul>
        <p style={{ color: '#555' }}>
          ※ 위탁이 발생하는 경우, 관련 법령에 따라 위탁 계약을 통해 개인정보
          보호 의무를 준수하도록 관리합니다.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          6. 개인정보의 파기 절차 및 방법
        </h2>
        <p style={{ marginTop: 0 }}>
          서비스는 개인정보 보관 기간 경과 또는 처리 목적 달성 시 지체 없이
          파기합니다.
        </p>
        <ul>
          <li>전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제</li>
          <li>출력물 형태: 분쇄 또는 소각</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>7. 이용자의 권리</h2>
        <p style={{ marginTop: 0 }}>
          이용자는 개인정보에 대해 열람, 정정, 삭제, 처리 정지 등을 요청할 수
          있습니다. 요청은 아래 문의처로 접수해 주세요.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          8. 개인정보 보호 문의처
        </h2>
        <ul>
          <li>
            이메일: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            서비스 URL: <a href={SERVICE_URL}>{SERVICE_URL}</a>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>9. 변경 사항 공지</h2>
        <p style={{ marginTop: 0 }}>
          본 개인정보 처리방침은 법령, 정책 또는 서비스 변경에 따라 수정될 수
          있으며, 변경 시 서비스 내 공지 또는 본 페이지를 통해 안내합니다.
        </p>
      </section>

      <footer style={{ marginTop: 36, color: '#666', fontSize: 14 }}>
        © {new Date().getFullYear()} {APP_NAME}
      </footer>
    </main>
  )
}
