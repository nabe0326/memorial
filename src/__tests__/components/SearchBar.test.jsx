import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import SearchBar from '../../components/search/SearchBar'

describe('SearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    onClear: jest.fn(),
    placeholder: 'テスト検索...',
    showHistory: false,
    searchHistory: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    render(<SearchBar {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('テスト検索...')).toBeInTheDocument()
  })

  it('入力値が変更される', () => {
    render(<SearchBar {...defaultProps} />)
    
    const input = screen.getByPlaceholderText('テスト検索...')
    fireEvent.change(input, { target: { value: 'テスト' } })
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('テスト')
  })

  it('クリアボタンが機能する', () => {
    render(<SearchBar {...defaultProps} value="テスト入力" />)
    
    const clearButton = screen.getByTitle('クリア')
    fireEvent.click(clearButton)
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('')
    expect(defaultProps.onClear).toHaveBeenCalled()
  })

  it('検索履歴が表示される', () => {
    const propsWithHistory = {
      ...defaultProps,
      showHistory: true,
      searchHistory: ['履歴1', '履歴2']
    }
    
    render(<SearchBar {...propsWithHistory} />)
    
    const input = screen.getByPlaceholderText('テスト検索...')
    fireEvent.focus(input)
    
    expect(screen.getByText('履歴1')).toBeInTheDocument()
    expect(screen.getByText('履歴2')).toBeInTheDocument()
  })
})