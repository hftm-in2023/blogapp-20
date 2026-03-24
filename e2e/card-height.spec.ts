import { test, expect } from '@playwright/test';

test.describe('Blog card equal heights', () => {
  test('all cards in a row should have the same height', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="blog-card"]');

    // Take a screenshot before the fix
    await page.screenshot({
      path: 'e2e/screenshots/cards-overview.png',
      fullPage: true,
    });

    // Get the bounding boxes of all visible cards
    const cards = page.locator('[data-testid="blog-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);

    const boxes = [];
    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) boxes.push(box);
    }

    // Group cards by row (same y position within a small tolerance)
    const rows = new Map<number, typeof boxes>();
    for (const box of boxes) {
      const rowKey = Math.round(box.y / 10) * 10;
      if (!rows.has(rowKey)) rows.set(rowKey, []);
      rows.get(rowKey)!.push(box);
    }

    // Each row with multiple cards should have equal heights
    for (const [, rowCards] of rows) {
      if (rowCards.length < 2) continue;
      const heights = rowCards.map((c) => Math.round(c.height));
      const maxHeight = Math.max(...heights);
      const minHeight = Math.min(...heights);
      console.log(`Row heights: [${heights.join(', ')}]`);
      expect(maxHeight - minHeight).toBeLessThanOrEqual(2);
    }
  });
});
