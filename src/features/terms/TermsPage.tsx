import { TERMS_VERSION } from '@/shared/config/env'
import { TopBar } from '@/shared/ui/TopBar'
import { TERMS, TERMS_ADDENDUM } from './terms'

const SUB_MARKS = ['가', '나', '다', '라']

/** 이용약관 (작업 지시서 부록 A 그대로) */
export function TermsPage() {
  return (
    <>
      <TopBar title="이용약관" />
      <main className="flex flex-col gap-6 px-5 pt-6 pb-12">
        <header>
          <h1 className="text-title text-fg">논스톱 이용약관</h1>
          <p className="mt-1 text-caption text-fg-tertiary slashed-zero tabular-nums">
            시행일 {TERMS_VERSION}
          </p>
        </header>

        {TERMS.map((article) => (
          <section key={article.title} className="flex flex-col gap-2">
            <h2 className="text-headline text-fg">{article.title}</h2>
            {article.paragraphs.map((p) => (
              <p key={p} className="text-body-sm text-fg-secondary">
                {p}
              </p>
            ))}
            {article.items.length > 0 && (
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-body-sm text-fg-secondary marker:text-fg-tertiary">
                {article.items.map((item) => (
                  <li key={item.text}>
                    {item.text}
                    {item.sub && (
                      <ul className="mt-1 flex flex-col gap-1">
                        {item.sub.map((s, i) => (
                          <li key={s}>
                            {SUB_MARKS[i]}. {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}

        <section className="flex flex-col gap-1 border-t border-line-divider pt-6">
          <h2 className="text-headline text-fg">부칙</h2>
          {TERMS_ADDENDUM.map((line) => (
            <p key={line} className="text-body-sm text-fg-secondary">
              {line}
            </p>
          ))}
        </section>
      </main>
    </>
  )
}
