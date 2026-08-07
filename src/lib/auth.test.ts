import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requireRole } from './auth'

// Mock the dependencies
vi.mock('./supabase-server', () => ({
  createClient: vi.fn()
}))

describe('Auth Helpers', () => {
  describe('requireRole', () => {
    it('is defined', () => {
      expect(requireRole).toBeDefined()
    })
  })
})
