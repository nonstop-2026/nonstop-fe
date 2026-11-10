import { useNavigate } from 'react-router'
import { FIELDS, KEYWORD_LABEL, MIN_KEYWORDS } from '@/shared/constants/keywords'
import { Button, Chip, ProgressSegments } from '@/shared/ui/controls'
import { useOnboarding } from './store'

/** 관심 분야 선택: 5개 분야의 키워드 칩, 3개 이상 */
export function InterestsPage() {
  const navigate = useNavigate()
  const keywords = useOnboarding((s) => s.keywords)
  const toggleKeyword = useOnboarding((s) => s.toggleKeyword)
  const enough = keywords.length >= MIN_KEYWORDS

  return (
    <main className="flex flex-1 flex-col px-5 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <ProgressSegments total={3} current={1} />
      <h1 className="mt-8 text-title text-fg">관심 분야를 골라 주세요</h1>
      <p className="mt-1 text-body-sm text-fg-secondary">고른 키워드로 첫 논문을 골라 드려요</p>

      <div className="mt-8 flex flex-col gap-6">
        {FIELDS.map((field) => (
          <section key={field.slug}>
            <h2 className="text-caption text-fg-tertiary">
              <span className="font-semibold text-fg-secondary">{field.label}</span>
              <span className="ml-2">{field.category}</span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {field.keywords.map((k) => (
                <Chip key={k} selected={keywords.includes(k)} onClick={() => toggleKeyword(k)}>
                  {KEYWORD_LABEL[k]}
                </Chip>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-2 pt-8">
        <p aria-live="polite" className="text-caption text-fg-tertiary tabular-nums">
          {enough ? `${keywords.length}개 골랐어요` : '3개 이상 골라 주세요'}
        </p>
        <Button fullWidth disabled={!enough} onClick={() => navigate('/onboarding/swipe')}>
          다음
        </Button>
      </div>
    </main>
  )
}
