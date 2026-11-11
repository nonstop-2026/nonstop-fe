/** 조건부 className 합치기. 예: cn('a', isOn && 'b') → 'a b' */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
