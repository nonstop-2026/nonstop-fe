/** 환경 변수는 여기서만 읽는다. 키 이름은 .env.example 참고 */
const env = import.meta.env

export const config = {
  /** 백엔드 주소. 비우면 같은 출처 */
  apiBaseUrl: env.VITE_API_BASE_URL ?? '',
  /** 'false'일 때만 실제 API, 그 외에는 MSW 목 */
  useMock: env.VITE_API_MOCK !== 'false',
  /** 'true'일 때만 시연 도구(/demo) 등록 */
  demoTools: env.VITE_DEMO_TOOLS === 'true',
} as const

export const CONTACT_EMAIL = 'm2nwo079@seoultech.ac.kr'
export const TERMS_VERSION = '2026-11-08'
