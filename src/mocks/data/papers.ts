import type { Card, KeywordSlug, Level, PaperDetail, PaperSummary } from '@/shared/api/types'

/**
 * 목 데이터. 화면 개발용으로 지어낸 논문이다(arXiv ID도 가짜).
 * 응답 모양은 백엔드 openapi.yaml v0.1.1을 따른다.
 */
interface Seed {
  category: string
  venue: string | null
  publishedAt: string
  authors: string[]
  tags: KeywordSlug[]
  titleKo: string
  title: string
  oneLine: Record<Level, string>
  whyImportant: string
  keyPoints: string[]
  method: string | null
  dataset: string | null
  limitation: string | null
}

const SEEDS: Seed[] = [
  {
    category: 'cs.AI',
    venue: null,
    publishedAt: '2026-11-07',
    authors: ['Müller', 'Choi', 'Garcia'],
    tags: ['agents', 'planning'],
    titleKo: '계획을 짧게 나눠 세우는 에이전트',
    title: 'Short-horizon replanning for language agents',
    oneLine: {
      easy: '큰 계획을 잘게 나눠 다시 세우면 에이전트가 덜 헤맸어요.',
      basic: '짧은 단위로 다시 계획하게 하자 같은 성능에 계산이 줄었어요.',
      expert: '짧은 지평 재계획으로 과제 성공률을 유지하며 추론 호출 수를 줄였어요.',
    },
    whyImportant:
      '에이전트가 긴 계획을 한 번에 세우면 중간에 틀어졌을 때 처음부터 다시 해야 해요. 짧게 나누면 실패를 빨리 고칠 수 있어요.',
    keyPoints: [
      '계획을 몇 단계씩 끊어서 세웠어요',
      '중간 결과를 보고 다음 계획을 고쳤어요',
      '같은 과제를 더 적은 호출로 풀었어요',
    ],
    method: '언어모델 에이전트가 몇 단계 앞까지만 계획하고, 실행 결과를 보며 다시 계획하게 했어요.',
    dataset: '웹 탐색과 도구 사용 과제 모음을 썼어요.',
    limitation: '과제가 아주 길면 효과가 줄었어요.',
  },
  {
    category: 'cs.AI',
    venue: 'AAAI 2027',
    publishedAt: '2026-11-06',
    authors: ['Ito', 'Kang'],
    tags: ['reasoning'],
    titleKo: '스스로 답을 검산하는 추론 모델',
    title: 'Self-verification improves multi-step reasoning',
    oneLine: {
      easy: '답을 낸 뒤 스스로 검산하게 하자 실수가 줄었어요.',
      basic: '자기 검증 단계를 넣자 여러 단계 추론의 오답이 줄었어요.',
      expert: '생성 후 검증 루프를 추가해 다단계 추론 과제의 오류율을 낮췄어요.',
    },
    whyImportant:
      '모델이 그럴듯하지만 틀린 답을 자신 있게 내는 일이 많아요. 검산 단계는 그런 실수를 잡는 간단한 방법이에요.',
    keyPoints: [
      '답을 낸 뒤 근거를 다시 확인했어요',
      '틀린 단계를 찾으면 그 부분만 고쳤어요',
      '수학과 논리 문제에서 효과가 컸어요',
    ],
    method: '모델이 답을 낸 뒤 각 단계를 다시 확인하는 질문을 스스로 던지게 했어요.',
    dataset: '수학 서술형 문제와 논리 퍼즐을 썼어요.',
    limitation: '검산하는 만큼 응답 시간이 길어졌어요.',
  },
  {
    category: 'cs.AI',
    venue: null,
    publishedAt: '2026-11-05',
    authors: ['Silva', 'Han', 'Novak', 'Ahmed'],
    tags: ['agents', 'reasoning'],
    titleKo: '여러 에이전트가 역할을 나눠 토론하기',
    title: 'Role-split debate among cooperative agents',
    oneLine: {
      easy: '에이전트 여럿이 역할을 나눠 토론하자 답이 더 정확해졌어요.',
      basic: '비판 역할을 둔 다중 에이전트 토론이 단일 모델보다 정확했어요.',
      expert: '역할 분리 토론 구조가 단일 에이전트 대비 사실 오류를 줄였어요.',
    },
    whyImportant:
      '한 모델이 혼자 생각하면 같은 실수를 반복하기 쉬워요. 다른 역할이 반론을 내면 실수가 드러나요.',
    keyPoints: [
      '제안 · 비판 · 정리 역할을 나눴어요',
      '토론 횟수를 늘리면 효과가 커졌어요',
      '비용은 역할 수만큼 늘었어요',
    ],
    method: '같은 모델에 서로 다른 역할을 주고 정해진 횟수만큼 토론하게 했어요.',
    dataset: '사실 확인 질문 모음을 썼어요.',
    limitation: '토론이 길어지면 같은 말을 반복했어요.',
  },
  {
    category: 'cs.CL',
    venue: 'ACL 2026',
    publishedAt: '2026-11-07',
    authors: ['Sato', 'Park'],
    tags: ['rag', 'llm'],
    titleKo: '검색 증강 생성의 환각 줄이기',
    title: 'Reducing hallucination in retrieval-augmented generation',
    oneLine: {
      easy: '찾아온 문서를 한 번 더 확인하게 하자 지어낸 답이 줄었어요.',
      basic: '검색 문서 재검증 단계를 넣자 RAG의 환각이 줄었어요.',
      expert: '검색 결과 재순위화와 근거 검증으로 RAG 응답의 사실성이 높아졌어요.',
    },
    whyImportant:
      'RAG는 문서를 찾아 답하지만, 엉뚱한 문서를 가져오면 그럴듯한 거짓말을 해요. 문서를 다시 고르는 단계가 이를 막아요.',
    keyPoints: [
      '찾은 문서를 다시 골랐어요',
      '답의 근거 문장을 함께 표시했어요',
      '근거 없는 답은 거절했어요',
    ],
    method: '검색한 문서를 다른 모델로 다시 평가하고, 답의 문장마다 근거를 붙이게 했어요.',
    dataset: '질문과 정답 문서가 짝지어진 공개 데이터를 썼어요.',
    limitation: '문서가 아예 없는 질문에는 효과가 없었어요.',
  },
  {
    category: 'cs.CL',
    venue: null,
    publishedAt: '2026-11-06',
    authors: ['Nguyen', 'Kim', 'Lee'],
    tags: ['translation', 'llm'],
    titleKo: '전문 용어를 지키는 기계 번역',
    title: 'Terminology-aware machine translation with LLMs',
    oneLine: {
      easy: '용어집을 함께 주자 번역기가 전문 용어를 덜 틀렸어요.',
      basic: '용어집 제약을 넣은 LLM 번역이 용어 정확도를 높였어요.',
      expert: '용어 제약 디코딩으로 도메인 번역의 용어 일관성을 개선했어요.',
    },
    whyImportant: '논문이나 매뉴얼 번역에서 용어가 틀리면 뜻이 완전히 달라져요.',
    keyPoints: [
      '용어집을 입력에 함께 넣었어요',
      '같은 용어를 끝까지 같게 번역했어요',
      '문장 자연스러움은 거의 그대로였어요',
    ],
    method: '번역할 때 용어집을 참고하도록 지시문과 출력 제약을 함께 썼어요.',
    dataset: '의료 · 법률 분야 병렬 문장을 썼어요.',
    limitation: '용어집에 없는 새 용어는 여전히 틀렸어요.',
  },
  {
    category: 'cs.CL',
    venue: 'EMNLP 2026',
    publishedAt: '2026-11-04',
    authors: ['Rossi'],
    tags: ['llm'],
    titleKo: '긴 문서를 끝까지 기억하는 언어모델',
    title: 'Long-context memory for language models',
    oneLine: {
      easy: '긴 글 중간 내용을 더 잘 기억하게 만들었어요.',
      basic: '긴 문맥 중간의 정보를 놓치는 문제를 줄였어요.',
      expert: '위치 편향을 보정해 긴 문맥 중간 정보의 회상률을 높였어요.',
    },
    whyImportant: '긴 문서를 넣으면 모델이 앞과 뒤만 기억하고 가운데를 놓치는 일이 많아요.',
    keyPoints: [
      '중간 정보를 놓치는 현상을 측정했어요',
      '위치에 따른 차이를 줄였어요',
      '요약 과제에서 효과를 확인했어요',
    ],
    method: '문맥 위치에 따라 주의를 보정하는 학습을 추가했어요.',
    dataset: '긴 문서 질의응답 벤치마크를 썼어요.',
    limitation: null,
  },
  {
    category: 'cs.CV',
    venue: null,
    publishedAt: '2026-11-07',
    authors: ['Zhang', 'Wang', 'Oh'],
    tags: ['image-generation', 'multimodal'],
    titleKo: '확산모델 기반 영상 생성 서베이',
    title: 'A survey of diffusion-based video generation',
    oneLine: {
      easy: '글만 써도 영상을 만드는 방법들을 한눈에 정리했어요.',
      basic: '확산모델 기반 영상 생성 연구를 방식별로 정리했어요.',
      expert: '비디오 확산모델을 구조 · 조건화 · 학습 전략 축으로 분류했어요.',
    },
    whyImportant:
      '영상 생성 연구가 쏟아지는데 무엇이 어떻게 다른지 알기 어려워요. 이 글은 지도 역할을 해요.',
    keyPoints: [
      '생성 방식을 크게 나눴어요',
      '방식별 장단점을 비교했어요',
      '남은 숙제를 정리했어요',
    ],
    method: '최근 연구를 방식별로 묶고 같은 기준으로 비교했어요.',
    dataset: '공개 벤치마크 결과를 모았어요.',
    limitation: '정리 시점 이후 연구는 빠져 있어요.',
  },
  {
    category: 'cs.CV',
    venue: 'CVPR 2026',
    publishedAt: '2026-11-05',
    authors: ['Ahmed', 'Choi'],
    tags: ['3d-vision'],
    titleKo: '사진 몇 장으로 3D 장면 만들기',
    title: 'Few-shot 3D scene reconstruction',
    oneLine: {
      easy: '사진 몇 장만으로 방 전체를 3D로 다시 만들었어요.',
      basic: '적은 시점의 사진으로도 3D 장면을 복원했어요.',
      expert: '희소 시점 입력에서 장면 사전 지식으로 3D 복원 품질을 높였어요.',
    },
    whyImportant:
      '3D 복원은 보통 사진이 아주 많이 필요해요. 몇 장으로 되면 휴대폰으로도 쉽게 만들 수 있어요.',
    keyPoints: [
      '사진 3~5장으로 복원했어요',
      '비어 있는 부분을 그럴듯하게 채웠어요',
      '실내 장면에서 특히 잘 됐어요',
    ],
    method: '많은 장면에서 배운 사전 지식으로 빈 시점을 채웠어요.',
    dataset: '실내 장면 3D 데이터셋을 썼어요.',
    limitation: '야외처럼 넓은 장면은 흐릿했어요.',
  },
  {
    category: 'cs.CV',
    venue: null,
    publishedAt: '2026-11-03',
    authors: ['Petrov', 'Yoon', 'Tan'],
    tags: ['multimodal'],
    titleKo: '그림을 보고 근거를 짚어 주는 모델',
    title: 'Grounded visual question answering',
    oneLine: {
      easy: '그림의 어디를 보고 답했는지 짚어 주게 했어요.',
      basic: '답과 함께 이미지 속 근거 영역을 표시하게 했어요.',
      expert: '영역 근거를 함께 출력해 시각 질의응답의 검증 가능성을 높였어요.',
    },
    whyImportant:
      '그림을 보고 답하는 AI가 정말 그림을 본 건지 알기 어려웠어요. 근거를 짚으면 확인할 수 있어요.',
    keyPoints: [
      '답과 근거 영역을 함께 냈어요',
      '틀린 답은 근거도 엉뚱했어요',
      '사람이 검토하기 쉬워졌어요',
    ],
    method: '답을 낼 때 이미지 안의 영역 좌표를 함께 내도록 학습했어요.',
    dataset: '근거 영역이 표시된 질의응답 데이터를 썼어요.',
    limitation: '작은 물체는 영역을 잘 못 짚었어요.',
  },
  {
    category: 'cs.HC',
    venue: 'CHI 2026',
    publishedAt: '2026-11-07',
    authors: ['Kim', 'Lee'],
    tags: ['xr', 'ux-research'],
    titleKo: '제스처는 말차례를 넘기는 신호가 된다',
    title: 'Co-speech gesture and turn-taking in XR',
    oneLine: {
      easy: '손짓을 보게 하자 AI의 엉뚱한 끼어들기가 줄었어요.',
      basic: '손짓 국면을 신호로 넣자 오개입이 줄었어요.',
      expert: '제스처 국면을 말차례 예측 특징으로 추가해 오개입을 줄였어요.',
    },
    whyImportant:
      '대화 중 AI가 아무 때나 끼어들면 불편해요. 사람은 손짓으로 차례를 넘기는데, AI도 이를 알아보면 대화가 자연스러워요.',
    keyPoints: [
      '손짓을 보고 끼어들 때를 정했어요',
      '음성만 쓸 때보다 덜 끊겼어요',
      '실시간 XR 대화에 쓸 수 있어요',
    ],
    method: 'XR 대화에서 손짓 구간을 표시하고, 그 신호로 AI가 말할 때를 정하게 했어요.',
    dataset: 'XR 대화 기록과 손 움직임 데이터를 썼어요.',
    limitation: '참가자 수가 적어요.',
  },
  {
    category: 'cs.HC',
    venue: null,
    publishedAt: '2026-11-06',
    authors: ['Garcia', 'Jung'],
    tags: ['accessibility'],
    titleKo: '화면 낭독기 사용자를 위한 차트 설명',
    title: 'Accessible chart descriptions for screen reader users',
    oneLine: {
      easy: '앞을 보기 어려운 사람에게 차트를 말로 잘 설명하는 법을 찾았어요.',
      basic: '화면 낭독기 사용자를 위한 단계별 차트 설명을 설계했어요.',
      expert: '탐색 가능한 계층형 차트 설명으로 비시각 사용자의 이해도를 높였어요.',
    },
    whyImportant:
      '차트는 보이는 사람에게만 정보를 줘요. 설명이 없으면 같은 수업이나 회의에서 소외돼요.',
    keyPoints: [
      '요약에서 세부로 단계별 설명을 줬어요',
      '원하는 부분만 골라 들을 수 있었어요',
      '이해 속도가 빨라졌어요',
    ],
    method: '차트를 요약 · 추세 · 세부 값 단계로 나눠 키보드로 탐색하게 했어요.',
    dataset: '시각장애인 참가자 사용성 평가를 했어요.',
    limitation: '복잡한 지도 차트는 다루지 않았어요.',
  },
  {
    category: 'cs.HC',
    venue: 'UIST 2026',
    publishedAt: '2026-11-04',
    authors: ['Park'],
    tags: ['ux-research', 'xr'],
    titleKo: '시선으로 고르는 XR 메뉴',
    title: 'Gaze-based menu selection in XR',
    oneLine: {
      easy: '눈으로 보는 것만으로 메뉴를 고르게 했어요.',
      basic: '시선과 짧은 확인 동작으로 XR 메뉴 선택을 빠르게 했어요.',
      expert: '시선 체류와 확인 제스처를 결합해 XR 메뉴 선택 오류를 줄였어요.',
    },
    whyImportant: 'XR에서 손을 계속 들고 있으면 팔이 아파요. 시선으로 고르면 훨씬 편해요.',
    keyPoints: [
      '보는 것만으로 후보를 골랐어요',
      '짧은 동작으로 확정했어요',
      '잘못 고르는 일이 줄었어요',
    ],
    method: '시선이 머문 메뉴를 후보로 두고 손가락 동작으로 확정하게 했어요.',
    dataset: '참가자 사용성 실험을 했어요.',
    limitation: null,
  },
  {
    category: 'cs.SE',
    venue: null,
    publishedAt: '2026-11-07',
    authors: ['Han', 'Silva'],
    tags: ['code-generation', 'software-testing'],
    titleKo: '코드 생성 모델은 테스트를 얼마나 잘 쓸까',
    title: 'How well do code models write tests?',
    oneLine: {
      easy: 'AI가 쓴 테스트는 쉬운 경우만 확인하는 경향이 있었어요.',
      basic: '모델이 만든 테스트는 경계 조건을 자주 놓쳤어요.',
      expert: '생성된 테스트의 변이 점수가 낮아 경계 조건 검출이 약했어요.',
    },
    whyImportant:
      '테스트를 AI에게 맡기는 팀이 늘고 있어요. 테스트가 약하면 버그가 그대로 배포돼요.',
    keyPoints: [
      '쉬운 입력만 확인했어요',
      '경계 조건을 자주 놓쳤어요',
      '사람이 보완하면 크게 나아졌어요',
    ],
    method: '여러 모델이 만든 테스트에 일부러 버그를 넣어 얼마나 잡는지 봤어요.',
    dataset: '공개 오픈소스 프로젝트 함수를 썼어요.',
    limitation: '한 언어로만 실험했어요.',
  },
  {
    category: 'cs.SE',
    venue: 'ICSE 2027',
    publishedAt: '2026-11-05',
    authors: ['Novak', 'Lim', 'Ortiz'],
    tags: ['developer-tools'],
    titleKo: '개발자는 AI 코드 리뷰를 얼마나 믿을까',
    title: 'Developer trust in AI code review',
    oneLine: {
      easy: '개발자들은 AI 리뷰의 근거가 보일 때만 믿었어요.',
      basic: '근거를 함께 보여 준 AI 리뷰 의견이 더 많이 받아들여졌어요.',
      expert: '설명 근거가 있는 자동 리뷰 의견의 채택률이 유의하게 높았어요.',
    },
    whyImportant: 'AI 리뷰가 많아질수록 무엇을 믿을지가 중요해져요.',
    keyPoints: [
      '근거가 있으면 더 받아들였어요',
      '틀린 의견이 섞이면 전체를 덜 믿었어요',
      '짧은 의견을 선호했어요',
    ],
    method: '실제 팀의 리뷰 기록과 인터뷰를 함께 분석했어요.',
    dataset: '기업 두 곳의 리뷰 기록을 썼어요.',
    limitation: '두 회사만 조사했어요.',
  },
  {
    category: 'cs.SE',
    venue: null,
    publishedAt: '2026-11-03',
    authors: ['Yamada', 'Cho'],
    tags: ['code-generation', 'developer-tools'],
    titleKo: '저장소 전체를 보고 코드를 고치는 모델',
    title: 'Repository-level code repair',
    oneLine: {
      easy: '파일 하나가 아니라 프로젝트 전체를 보고 버그를 고쳤어요.',
      basic: '저장소 문맥을 함께 넣자 버그 수정 성공률이 올랐어요.',
      expert: '저장소 수준 검색 문맥으로 이슈 기반 수정의 성공률을 높였어요.',
    },
    whyImportant:
      '실제 버그는 여러 파일에 걸쳐 있어요. 파일 하나만 보면 고칠 수 없는 경우가 많아요.',
    keyPoints: [
      '관련 파일을 먼저 찾았어요',
      '여러 파일을 함께 고쳤어요',
      '테스트로 결과를 확인했어요',
    ],
    method: '이슈 설명으로 관련 파일을 검색한 뒤 함께 넣어 수정안을 만들게 했어요.',
    dataset: '실제 이슈와 수정 기록 모음을 썼어요.',
    limitation: '아주 큰 저장소는 검색이 느렸어요.',
  },
]

/** 목 카탈로그: 시드 15편을 3번 돌려 45편. ID가 달라 표지 그림도 다르다 */
const CATALOG = Array.from({ length: SEEDS.length * 3 }, (_, i) => {
  const seed = SEEDS[i % SEEDS.length]
  const round = Math.floor(i / SEEDS.length)
  const arxivId = `2611.${String(round * 1000 + 101 + (i % SEEDS.length)).padStart(5, '0')}`
  return { ...seed, paperId: arxivId, arxivId }
})

type Entry = (typeof CATALOG)[number]

export function toSummary(entry: Entry, level: Level): PaperSummary {
  return {
    paperId: entry.paperId,
    arxivId: entry.arxivId,
    version: 1,
    title: entry.title,
    titleKo: entry.titleKo,
    primaryCategory: entry.category,
    venue: entry.venue,
    publishedAt: entry.publishedAt,
    authors: entry.authors,
    tags: entry.tags,
    level,
    oneLine: entry.oneLine[level],
  }
}

export function toDetail(entry: Entry, level: Level): PaperDetail {
  const card: Card = {
    oneLine: entry.oneLine[level],
    whyImportant: entry.whyImportant,
    keyPoints: entry.keyPoints,
    method: entry.method,
    dataset: entry.dataset,
    limitation: entry.limitation,
  }
  return {
    ...toSummary(entry, level),
    abstractUrl: `https://arxiv.org/abs/${entry.arxivId}`,
    pdfUrl: `https://arxiv.org/pdf/${entry.arxivId}`,
    license: 'http://creativecommons.org/licenses/by/4.0/',
    card,
  }
}

export function findEntry(paperId: string): Entry | undefined {
  return CATALOG.find((e) => e.paperId === paperId)
}

export { CATALOG }
