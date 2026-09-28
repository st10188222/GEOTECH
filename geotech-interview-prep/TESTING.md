# V1 validation

## Passed
- Node syntax checks for browser, content and server JavaScript.
- Public asset build succeeds; only index.html, CSS, JS and content are copied.
- Four automated test groups: 56-question bank integrity; API input/output and provider errors; storage/metrics/clearing; speech support fallback and progressive/final transcripts.
- API tests cover POST-only, content type, malformed JSON, empty/oversized answers, unknown questions, incorrect metadata, follow-up bounds, missing key, 401/403/404/429/500, network failure and invalid provider JSON. No real credentials were used.
- Browser: overview, quiz, interview, topics and history navigation using keyboard activation.
- Quiz: correct and wrong selections, score stays unchanged on wrong answer, next questions, final 2/5 = 40%, missed-question review, retry set of three, same retry restored after refresh.
- Interview: empty submission disabled, typing, preserved draft, readable missing-key error, loading state with disabled submission.
- Isolated test-only provider fixture: all feedback sections render; both follow-ups work; no third follow-up button; three attempts persist in history after refresh. The fixture lives outside the delivered project and is never included in production.
- Revision: a topic expands to show definition, concepts, significance, explanation and example.
- Desktop visual review and 390px mobile interview layout: no document-width overflow; responsive controls and text remain readable. Keyboard focus and real labels present.
- No real key was created or included; .env patterns ignored; local server explicitly restricts public paths.

## Still requires your environment
- Real Gemini response using your own server-side API key. Provider response tests were simulated, not live.
- Microphone permission and actual speech capture on intended phones/browsers. Speech event/fallback logic is unit-tested, but no microphone was activated.
- Vercel production deployment, API execution, security headers and direct hash-route refresh on the production URL.
- Clear-history deletion logic is unit-tested; confirm/cancel dialog wiring was reviewed, not accepted through browser automation.
- Broader device/browser checks, 200% text zoom, and screen-reader review before wide release.
- Technical content review against any additional study documents you supply.

## Quick release check
1. Deploy with GEMINI_API_KEY and open the production URL.
2. Finish a filtered quiz with one deliberate wrong answer; retry it.
3. Type an answer, request feedback and complete two follow-ups.
4. Try speech, stop, edit and submit on your target phone/browser.
5. Refresh history; cancel clearing once, then confirm if you want to remove test attempts.
6. Open /#topics directly and verify navigation and readable mobile layout.
