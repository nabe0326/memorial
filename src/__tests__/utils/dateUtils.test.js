import { describe, it, expect } from '@jest/globals'
import { 
  formatDateForDisplay,
  calculateAge,
  isEventToday,
  daysBetween
} from '../../lib/dateUtils'

describe('dateUtils', () => {
  describe('formatDateForDisplay', () => {
    it('日付を正しい形式でフォーマットする', () => {
      const date = new Date('2024-01-15')
      const result = formatDateForDisplay(date)
      expect(result).toBe('2024年1月15日')
    })
  })

  describe('calculateAge', () => {
    it('年齢を正しく計算する', () => {
      const birthDate = new Date('1990-01-15')
      const referenceDate = new Date('2024-01-15')
      const age = calculateAge(birthDate, referenceDate)
      expect(age).toBe(34)
    })

    it('誕生日前の年齢を正しく計算する', () => {
      const birthDate = new Date('1990-01-15')
      const referenceDate = new Date('2024-01-14')
      const age = calculateAge(birthDate, referenceDate)
      expect(age).toBe(33)
    })
  })

  describe('isEventToday', () => {
    it('今日のイベントを正しく判定する', () => {
      const today = new Date()
      const result = isEventToday(today)
      expect(result).toBe(true)
    })

    it('今日でないイベントを正しく判定する', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const result = isEventToday(tomorrow)
      expect(result).toBe(false)
    })
  })

  describe('daysBetween', () => {
    it('日付間の日数を正しく計算する', () => {
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-01-05')
      const days = daysBetween(date1, date2)
      expect(days).toBe(4)
    })
  })
})