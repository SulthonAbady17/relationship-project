# Meta Pixel Audit Summary

**File:** `index.html` | **Pixel ID:** `1844334429573258`
**Status:** ⚠️ 4 issues found — awaiting info from friend before fixing

---

## Issues (priority order)

### 1. 🔴 Pixel placed in `<body>` — move to `<head>`
- **Line:** 418–432
- **Problem:** Users who bounce before full page load are not tracked.
- **Fix:** Cut the `<script>` block + `<noscript>` tag, paste inside `<head>` before `</head>`.
- **Blocker:** None — can fix immediately.

### 2. ❓ Mengantar widget `isFbPixel: true` — may cause double-counting
- **Line:** 374
- **Problem:** Widget likely fires its own Pixel events on form submission. Combined with manual events in HTML, conversions may be counted twice in Meta Events Manager.
- **Fix:** Check Mengantar dashboard to see which events it fires, then remove duplicates from HTML.
- **Blocker:** Need Mengantar account access or docs from friend.

### 3. 🟡 `Lead` fires on scroll, not on form interaction
- **Line:** 498–509
- **Problem:** `Lead` triggers when checkout section is 30% visible — passive scroll, not real buyer intent. Trains ad campaigns on wrong signal.
- **Fix:** Remove scroll trigger. Fire `Lead` only on form click/submit.
- **Blocker:** Depends on Issue 2 resolution (avoid double-firing with widget).

### 4. 🟡 `ViewContent` fires with no product data
- **Line:** 430
- **Problem:** Fires empty, same as `PageView`. Retargeting audiences get no product context.
- **Fix:** Add `content_name`, `content_ids`, `value: 149000`, `currency: 'IDR'`.
- **Blocker:** None — can fix anytime.

---

## Safe to fix now (no info needed)
- Issue 1 (move to `<head>`)
- Issue 4 (enrich `ViewContent`)

## Waiting on friend
- Issue 2 → ask: *"What Pixel events does the Mengantar widget fire automatically?"*
- Issue 3 → depends on answer to Issue 2
