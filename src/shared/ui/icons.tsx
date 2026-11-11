import type { SVGProps } from 'react'

/** 선 아이콘 (디자인 시스템 8절): 선 굵기 1.75 고정, 크기 20(목록 · 버튼 안) 또는 24(탭 · 헤더) */
type IconProps = SVGProps<SVGSVGElement> & { size?: 20 | 24; filled?: boolean }

function Svg({ size = 20, filled = false, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
  </Svg>
)

export const FeedIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5.5" y="3" width="13" height="18" rx="2.5" />
  </Svg>
)

export const BookmarkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 4h11v16l-5.5-3.8L6.5 20z" />
  </Svg>
)

export const MenuIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)

export const ShareIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
  </Svg>
)

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="m5 9 7 7 7-7" />
  </Svg>
)

export const CheckIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const CloseIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
)

export const UndoIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="M9 7 5 11l4 4" />
    <path d="M5 11h9a5 5 0 0 1 0 10h-3" />
  </Svg>
)

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p} filled={false}>
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </Svg>
)
