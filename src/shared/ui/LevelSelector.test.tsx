import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { Level } from '@/shared/api/types'
import { LevelSelector } from './LevelSelector'

function Harness() {
  const [level, setLevel] = useState<Level>('basic')
  return <LevelSelector label="읽기 수준" value={level} onChange={setLevel} />
}

describe('LevelSelector', () => {
  it('좌우 방향키로 읽기 수준을 바꾼다', async () => {
    render(<Harness />)
    const basic = screen.getByRole('radio', { name: '기본' })
    expect(basic).toBeChecked()

    basic.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '전문' })).toBeChecked()

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('radio', { name: '쉽게' })).toBeChecked()
  })
})
