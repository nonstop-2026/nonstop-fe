import { useLocation, useNavigate } from 'react-router'

/**
 * 들어온 곳으로 돌아간다. 주소를 직접 열어 앱 안 이전 기록이 없으면 홈으로 간다.
 * React Router는 첫 화면의 location.key를 'default'로 둔다.
 */
export function useGoBack(fallback = '/home') {
  const navigate = useNavigate()
  const { key } = useLocation()
  return () => (key === 'default' ? navigate(fallback, { replace: true }) : navigate(-1))
}
