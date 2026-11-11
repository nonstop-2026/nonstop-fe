import type { FieldSlug, KeywordSlug } from '@/shared/api/types'

/** 온보딩 분야와 키워드. 슬러그는 백엔드 openapi.yaml의 고정 목록, 한국어 라벨은 프론트가 갖는다 */
export const FIELDS: {
  slug: FieldSlug
  category: string
  label: string
  keywords: KeywordSlug[]
}[] = [
  {
    slug: 'ai',
    category: 'cs.AI',
    label: '인공지능',
    keywords: ['agents', 'reasoning', 'planning'],
  },
  { slug: 'nlp', category: 'cs.CL', label: '자연어처리', keywords: ['llm', 'rag', 'translation'] },
  {
    slug: 'cv',
    category: 'cs.CV',
    label: '컴퓨터 비전',
    keywords: ['image-generation', 'multimodal', '3d-vision'],
  },
  {
    slug: 'hci',
    category: 'cs.HC',
    label: 'HCI',
    keywords: ['ux-research', 'xr', 'accessibility'],
  },
  {
    slug: 'se',
    category: 'cs.SE',
    label: '소프트웨어공학',
    keywords: ['code-generation', 'software-testing', 'developer-tools'],
  },
]

export const KEYWORD_LABEL: Record<KeywordSlug, string> = {
  agents: '에이전트',
  reasoning: '추론',
  planning: '계획',
  llm: 'LLM',
  rag: 'RAG',
  translation: '번역',
  'image-generation': '이미지 생성',
  multimodal: '멀티모달',
  '3d-vision': '3D 비전',
  'ux-research': 'UX 리서치',
  xr: 'XR',
  accessibility: '접근성',
  'code-generation': '코드 생성',
  'software-testing': '소프트웨어 테스트',
  'developer-tools': '개발 도구',
}

export const MIN_KEYWORDS = 3
