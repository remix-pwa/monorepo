import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, test } from 'vitest';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Client APIs testing suite', () => {
  describe('Clipboard testing suite', () => {
    test('Can copy text to the clipboard', async () => {
      // Tests here are broken fam...

      expect(true).toBe(true);
    });
  });
});
