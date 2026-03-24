import { test, expect } from '@playwright/test';

test.describe('ShareDirective', () => {
  test('should call navigator.share with correct data when share button is clicked', async ({
    page,
  }) => {
    // Mock navigator.canShare and navigator.share before navigating
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', {
        value: () => true,
        writable: true,
      });
      Object.defineProperty(navigator, 'share', {
        value: (data: unknown) => {
          (window as unknown as Record<string, unknown>)['__shareArgs'] = data;
          return Promise.resolve();
        },
        writable: true,
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="share-button"]');

    // Click the first share button
    const shareButton = page.locator('[data-testid="share-button"]').first();
    await shareButton.click();

    // Wait for the async share call to complete
    await page.waitForFunction(
      () => !!(window as unknown as Record<string, unknown>)['__shareArgs'],
    );

    // Retrieve what was passed to navigator.share
    const shareData = await page.evaluate(() => {
      const args = (window as unknown as Record<string, unknown>)[
        '__shareArgs'
      ] as Record<string, unknown>;
      // Files can't be serialized, so extract metadata
      const files = args['files'] as File[] | undefined;
      return {
        title: args['title'],
        text: args['text'],
        url: args['url'],
        hasFiles: !!files && files.length > 0,
        fileName: files?.[0]?.name,
        fileType: files?.[0]?.type,
      };
    });

    console.log('Share data received:', JSON.stringify(shareData, null, 2));

    // Verify title is present and non-empty
    expect(shareData.title).toBeTruthy();

    // Verify text is the URL (not combined with title, following MDN pattern)
    expect(shareData.text).toContain('http');
    expect(shareData.text).not.toContain('\n');

    // Verify file is attached
    expect(shareData.hasFiles).toBe(true);
    expect(shareData.fileName).toBe('picture.jpg');
    expect(shareData.fileType).toContain('image');

    // Verify url field is NOT set (to avoid double image in "Copy link")
    expect(shareData.url).toBeUndefined();
  });

  test('should not throw when user cancels the share dialog', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', {
        value: () => true,
        writable: true,
      });
      Object.defineProperty(navigator, 'share', {
        value: () =>
          Promise.reject(new DOMException('Share canceled', 'AbortError')),
        writable: true,
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="share-button"]');

    const shareButton = page.locator('[data-testid="share-button"]').first();
    await shareButton.click();

    // Give time for any error to propagate
    await page.waitForTimeout(500);

    // No errors should have been thrown
    expect(errors).toHaveLength(0);
  });

  test('should log message when canShare is not supported', async ({
    page,
  }) => {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log') consoleLogs.push(msg.text());
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', {
        value: undefined,
        writable: true,
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="share-button"]');

    const shareButton = page.locator('[data-testid="share-button"]').first();
    await shareButton.click();

    await page.waitForTimeout(500);

    expect(consoleLogs.some((log) => log.includes('not supported'))).toBe(true);
  });
});
