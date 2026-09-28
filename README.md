# GEOTECH
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



## Speech Recognition Notes

Uses `SpeechRecognition` or `webkitSpeechRecognition` when present. Browser, language, device and network support varies. Use HTTPS in production (localhost is suitable for development), permit the microphone if desired, stop recording and edit the transcript before submission. Recognition may send audio to the browser vendor; the app does not record or store audio. Unsupported browsers show a typing fallback. Device microphone capture still needs a check on your own phone/browser.

## Data Storage

History and the latest practice session use localStorage on the current browser/origin. Completed history stores quiz scores/topics and interview questions/scores/categories, not answer text. An unfinished interview draft does store answer text locally. Starting another practice session replaces the previous resume slot. Up to 200 completed attempts are retained. Clearing browser data removes progress; different browsers do not sync. **Clear history** asks for confirmation and also clears the saved draft/session. Storage errors do not stop practice.

## Free Tier Considerations

Only manual long-answer submissions consume Gemini requests. Submission is disabled while a request runs; follow-ups stop after two. Provider quota errors produce a readable retry message. The UI limit is a usage convenience, not an abuse-proof server quota: an unauthenticated public endpoint can still be called directly. Monitor project quotas; use provider/platform request controls if sharing widely. No paid fallback model is called automatically.

## Security

The key stays in server environment variables because browser source can be inspected by any visitor. `.env` and `.env.local` are ignored; the public build only copies an explicit set of frontend directories. The local server does not serve environment, server or test files. The endpoint checks method, content type, payload size, known question metadata, answer length and follow-up depth. It requests and validates a JSON schema, uses a timeout and hides provider internals. UI content, including AI text, is escaped before rendering. The prompt treats submitted text as data, but no language-model prompt provides a perfect defence against manipulation. Scores are practice guidance, never certification. Do not submit confidential site information; submitted answers go to Google. Review Google's current data terms before use.




