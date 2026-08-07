import { test, expect } from '@playwright/test';

test.describe('Society Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard (assumes mock authentication or bypassed in local dev)
    await page.goto('/society/dashboard');
  });

  test('should navigate to submission page and show form', async ({ page }) => {
    // In a real e2e test with auth, we would login first.
    // Assuming the page loads (mocked or unprotected for this scope)
    await page.goto('/society/submissions/new');
    
    // Check if the form is present
    await expect(page.locator('h1').filter({ hasText: 'Submit Opportunity' })).toBeVisible();
    
    // Check form fields
    await expect(page.getByLabel(/Opportunity Title/i)).toBeVisible();
    await expect(page.getByLabel(/Category/i)).toBeVisible();
    await expect(page.getByText(/Submit for Review/i)).toBeVisible();
  });
});
