import { paperPath } from './format'

/**
 * 논문 공유. Web Share API를 쓰고, 지원하지 않으면 링크를 복사한다.
 * 토스트로 보여 줄 문구를 돌려준다. 공유 창을 닫았으면 null.
 */
export async function sharePaper(paper: {
  paperId: string
  titleKo: string
}): Promise<string | null> {
  const url = `${window.location.origin}${paperPath(paper.paperId)}`
  if (navigator.share) {
    try {
      await navigator.share({ title: paper.titleKo, url })
    } catch {
      // 사용자가 공유 창을 닫음
    }
    return null
  }
  try {
    await navigator.clipboard.writeText(url)
    return '링크를 복사했어요'
  } catch {
    return '링크를 복사하지 못했어요'
  }
}
