import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { InterestsPage } from './InterestsPage'
import { useOnboarding } from './store'

describe('InterestsPage', () => {
  beforeEach(() => useOnboarding.getState().reset())

  it('키워드를 3개 고르기 전에는 다음 버튼이 꺼져 있다', async () => {
    render(
      <MemoryRouter>
        <InterestsPage />
      </MemoryRouter>,
    )
    const next = screen.getByRole('button', { name: '다음' })
    await userEvent.click(screen.getByRole('button', { name: 'LLM' }))
    await userEvent.click(screen.getByRole('button', { name: 'XR' }))
    expect(next).toBeDisabled()
    expect(screen.getByText('3개 이상 골라 주세요')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '에이전트' }))
    expect(next).toBeEnabled()
  })
})
