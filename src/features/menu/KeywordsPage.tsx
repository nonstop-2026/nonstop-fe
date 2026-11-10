import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useComputeWeights } from '@/shared/api/queries'
import type { KeywordSlug } from '@/shared/api/types'
import { FIELDS, KEYWORD_LABEL, MIN_KEYWORDS } from '@/shared/constants/keywords'
import { useProfile } from '@/shared/store/device'
import { useToast } from '@/shared/store/toast'
import { Button, Chip } from '@/shared/ui/controls'
import { TopBar } from '@/shared/ui/TopBar'

/**
 * 관심 키워드 관리. 저장하면 고른 키워드로 가중치를 다시 계산해 기기에 저장한다
 * (POST /v1/onboarding/weights, 스와이프 없이)
 */
export function KeywordsPage() {
  const navigate = useNavigate()
  const interests = useProfile((s) => s.interests)
  const setInterests = useProfile((s) => s.setInterests)
  const toast = useToast((s) => s.show)
  const weights = useComputeWeights()
  const [selected, setSelected] = useState<KeywordSlug[]>(() => interests.map((i) => i.keyword))
  const enough = selected.length >= MIN_KEYWORDS

  const toggle = (k: KeywordSlug) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))

  const save = () =>
    weights.mutate(
      { keywords: selected, swipes: [] },
      {
        onSuccess: (data) => {
          setInterests(data.interests)
          toast('저장했어요')
          navigate(-1)
        },
        onError: () => toast('저장하지 못했어요. 다시 시도해 주세요'),
      },
    )

  return (
    <>
      <TopBar title="관심 키워드" />
      <main className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {FIELDS.map((field) => (
          <section key={field.slug}>
            <h2 className="text-caption text-fg-tertiary">
              <span className="font-semibold text-fg-secondary">{field.label}</span>
              <span className="ml-2">{field.category}</span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {field.keywords.map((k) => (
                <Chip key={k} selected={selected.includes(k)} onClick={() => toggle(k)}>
                  {KEYWORD_LABEL[k]}
                </Chip>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-auto flex flex-col items-center gap-2 pt-4">
          <p aria-live="polite" className="text-caption text-fg-tertiary tabular-nums">
            {enough ? `${selected.length}개 골랐어요` : '3개 이상 골라 주세요'}
          </p>
          <Button fullWidth disabled={!enough || weights.isPending} onClick={save}>
            저장
          </Button>
        </div>
      </main>
    </>
  )
}
