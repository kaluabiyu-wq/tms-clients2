import { test, expect } from './fixtures';

test('admin approves a pending enrollment', async ({ page }) => {
  await page.goto('/enrollments');

  await expect(page.getByRole('heading', { name: 'Enrollment Records' })).toBeVisible();

  // The mock data has two Pending rows and one Rejected row, and nothing Approved yet.
  const approveButtons = page.getByRole('button', { name: 'Approve' });
  await expect(approveButtons).toHaveCount(2);
  await expect(page.getByText('Approved', { exact: true })).toHaveCount(0);

  const [approveRequest] = await Promise.all([
    page.waitForRequest((r) => r.method() === 'POST' && r.url().endsWith('/enrollments/1/approve')),
    approveButtons.first().click(),
  ]);
  expect(approveRequest.url()).toContain('/api/v1/enrollments/1/approve');

  await expect(page.getByText('Approved', { exact: true })).toHaveCount(1);
  await expect(approveButtons).toHaveCount(1);
});

test('instructor command center shows enrollment totals', async ({ page }) => {
  await page.goto('/command-center');

  await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();

  const total = page.locator('.kpi-card', { hasText: 'Total Enrollments' }).locator('.kpi-value');
  const pending = page.locator('.kpi-card', { hasText: 'Pending Approval' }).locator('.kpi-value');
  await expect(total).toHaveText('3');
  await expect(pending).toHaveText('2');
});
