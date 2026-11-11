import { useNavigate } from 'react-router'
import { Button } from '@/shared/ui/controls'
import { EmptyState } from '@/shared/ui/feedback'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <main className="flex flex-1 flex-col justify-center">
      <EmptyState
        message="찾는 페이지가 없어요. 주소를 다시 확인해 주세요"
        action={<Button onClick={() => navigate('/home')}>홈으로 가기</Button>}
      />
    </main>
  )
}
