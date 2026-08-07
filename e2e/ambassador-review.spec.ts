import { test, expect } from '@playwright/test';

test.describe('Ambassador Review Flow', () => {
  test('should load ambassador dashboard and see review queue', async ({ page }) => {
    await page.goto('/ambassador/dashboard');
    
    // The ambassador dashboard should have "Needs Review" section
    await expect(page.locator('text=Needs Review')).toBeVisible();
    
    // Assuming there is a review button
    const reviewLinks = page.locator('a[href^="/ambassador/review/"]');
    if (await reviewLinks.count() > 0) {
      await expect(reviewLinks.first()).toBeVisible();
    }
  });

  test('should be able to open review page', async ({ page }) => {
    // Navigate to a mock ID
    await page.goto('/ambassador/review/mock-id-123');
    
    await expect(page.locator('h1').filter({ hasText: 'Review Opportunity' })).toBeVisible();
    await expect(page.getByText(/Approve & Mark Ready/i)).toBeVisible();
    await expect(page.getByText(/Request Correction/i)).toBeVisible();
  });
});
