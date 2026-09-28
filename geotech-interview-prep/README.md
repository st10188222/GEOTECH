# Geotechnical Interview Prep

## What It Is

A lightweight graduate interview practice app: useful local revision plus optional Gemini coaching. The initial content is based on the topic outline and concepts in the supplied build request. These authored questions are educational material, not professional engineering guidance or a verbatim extraction of missing study notes.

## Features

- Five responsive views: overview, quiz, interview, topics and history.
- 56 local MCQs across 11 categories, filters, randomisation, explanations, scoring and retry missed questions. Small filtered pools use all available questions without repetition.
- 51 interview prompts: 22 technical, 10 motivation, 15 behavioural and four scenarios. Technical prompts range from beginner to graduate; scenarios are intermediate but respect graduate authority.
- Typed answers, optional browser speech recognition, local draft/session resume.
- Structured AI feedback and at most two follow-ups per original question in the interface.
- 12 revision notes, SCOPE, STAR + Learning and role-play frameworks.
- Browser-only history, real progress totals and confirmed deletion.

## Tech Stack

HTML, CSS, browser JavaScript modules, native fetch, localStorage and Web Speech API. One Node.js serverless function. No runtime packages, database, authentication, UI framework or Gemini SDK.

## Project Structure

```text
index.html           Semantic shell and navigation
css/styles.css       Colours, typography, layouts, responsive rules
js/app.js            View routing, overview, topics and history
js/quiz.js           Quiz state, answer checking, results and retry
js/interview.js      Drafts, submission, feedback and follow-ups
js/speech.js         Speech support, partial transcripts and fallback
js/storage.js        Guarded localStorage access and metrics
js/ui.js             Escaping and small rendering helpers
data/questions.js    Editable local MCQ bank
data/interviews.js   Interview questions and coaching concepts
data/topics.js       Concise revision notes
api/gemini.js        Protected provider call and response validation
dev-server.js        Local-only server; same API handler
build.js             Copies only public frontend assets
vercel.json          Deployment settings and security headers
tests/api.test.js    Content integrity and API boundary tests
.env.example         Placeholder configuration (no real key)
```

## Local Setup

Install Node.js 22.20 or newer. Open a terminal in this project folder. No `npm install` is needed for the application.

## Getting a Gemini API Key

1. Open [Google AI Studio](https://aistudio.google.com/apikey), sign in and create/select a project.
2. Create an API key for the Gemini API. Use a project eligible for the free tier; paid billing is not required by this app.
3. Copy `.env.example` to `.env.local` and replace the placeholder on your own machine. Do not paste the key into frontend files or commit it.

## Gemini API Setup

The browser posts to `/api/gemini`. The endpoint looks up the original prompt and rubric from the local bank, adds the supplied geotechnical concepts, requests structured JSON from Gemini, validates it and returns only feedback fields. The browser never receives the key. No AI requests occur for navigation, quizzes or revision.

## Environment Variables

| Name             | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `GEMINI_API_KEY` | Required server-side key for AI feedback                     |
| `GEMINI_MODEL`   | Optional model override; defaults to `gemini-2.5-flash-lite` |

The default is listed by Google with structured-output support and free-tier pricing at the time of implementation. Availability and quotas depend on project, region and provider changes. If it becomes unavailable, choose a currently supported Flash/Flash-Lite model in AI Studio and change `GEMINI_MODEL`; do not change frontend files. See [model information](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-lite) and [current pricing](https://ai.google.dev/gemini-api/docs/pricing).

## Running Locally

```sh
cp .env.example .env.local
# Edit .env.local privately, then:
npm start
```

Open **http://127.0.0.1:3000**. The local server loads `.env.local` and serves both frontend and API. Without a key, all local features still work and submission explains that AI is not configured. Restart after server-side changes; refresh after frontend changes. Do not open `index.html` using a `file://` URL.

```sh
npm test
node build.js
```

The tests use a simulated provider response and never spend API quota. `build.js` makes a `public/` folder containing only frontend assets. That folder is generated and ignored by Git.

## Deploying to Vercel

1. Create a GitHub repository and push the contents of this folder. Keep `.gitignore` and verify no real `.env` file is tracked.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set the root directory to this folder if the repository contains a parent folder. Choose framework **Other**. The checked-in configuration uses `node build.js` and output directory `public`.
4. In project environment variables, add `GEMINI_API_KEY`; optionally add `GEMINI_MODEL=gemini-2.5-flash-lite`. Select the environments where feedback should work.
5. Deploy. After changing variables, redeploy so functions receive the new values.
6. On the HTTPS production URL, complete a quiz, refresh `/#topics`, submit a short interview answer, and answer both follow-ups. Check that a third follow-up is not offered.

The `api/` function uses Vercel's Node.js request/response handler. Hash navigation needs no rewrite rule. See [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js). Use a free plan only if your use meets its current eligibility and limits. This project requires no purchased infrastructure.

No production deployment or real-key Gemini call was performed during implementation. A Vercel project/account and your key are needed for those final checks.

## Speech Recognition Notes

Uses `SpeechRecognition` or `webkitSpeechRecognition` when present. Browser, language, device and network support varies. Use HTTPS in production (localhost is suitable for development), permit the microphone if desired, stop recording and edit the transcript before submission. Recognition may send audio to the browser vendor; the app does not record or store audio. Unsupported browsers show a typing fallback. Device microphone capture still needs a check on your own phone/browser.

## Data Storage

History and the latest practice session use localStorage on the current browser/origin. Completed history stores quiz scores/topics and interview questions/scores/categories, not answer text. An unfinished interview draft does store answer text locally. Starting another practice session replaces the previous resume slot. Up to 200 completed attempts are retained. Clearing browser data removes progress; different browsers do not sync. **Clear history** asks for confirmation and also clears the saved draft/session. Storage errors do not stop practice.

## Free Tier Considerations

Only manual long-answer submissions consume Gemini requests. Submission is disabled while a request runs; follow-ups stop after two. Provider quota errors produce a readable retry message. The UI limit is a usage convenience, not an abuse-proof server quota: an unauthenticated public endpoint can still be called directly. Monitor project quotas; use provider/platform request controls if sharing widely. No paid fallback model is called automatically.

## Security

The key stays in server environment variables because browser source can be inspected by any visitor. `.env` and `.env.local` are ignored; the public build only copies an explicit set of frontend directories. The local server does not serve environment, server or test files. The endpoint checks method, content type, payload size, known question metadata, answer length and follow-up depth. It requests and validates a JSON schema, uses a timeout and hides provider internals. UI content, including AI text, is escaped before rendering. The prompt treats submitted text as data, but no language-model prompt provides a perfect defence against manipulation. Scores are practice guidance, never certification. Do not submit confidential site information; submitted answers go to Google. Review Google's current data terms before use.

## Editing the Content

- MCQ rows in `data/questions.js` contain category, difficulty, prompt, correct option, three distractors, explanation and takeaway. The conversion assigns a stable ID and varies the correct option position. Append new rows to preserve old IDs.
- Edit `data/topics.js` for revision content and `data/interviews.js` for prompts and expected concepts.
- Edit CSS variables at the top of `css/styles.css` to change the design.
- The API imports the same interview data, so changing expected concepts updates coaching context too.

## Validation / What to Test

See `TESTING.md` for completed checks and remaining device/production checks. Before public use, have a qualified subject reviewer review the authored content against your actual study notes.

## Content References

The supplied outline is the primary source. Supplemental checks included [FHWA rock-slope failure modes](https://www.fhwa.dot.gov/clas/ctip/context_sensitive_rock_slope_design/ch_3_1.aspx) and [USGS pore-pressure and movement observations](https://www.usgs.gov/publications/landslide-stability-role-rainfall-induced-laterally-propagating-pore-pressure-waves). No site-specific design values or universal movement alarm thresholds are supplied.

## Future Improvements

1. Incorporate your full study material with question-level source references and technical review.
2. Add history export/import and targeted revision based on recent attempts.
3. Add a stronger abuse-control strategy before wider public sharing, without changing the lightweight frontend.
