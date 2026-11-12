# VCCI Project Architecture

## Stack and compatibility

The project uses stable Next.js App Router, React, and JavaScript. JavaScript keeps the foundation approachable for the institute owner and future AI-assisted maintenance. Node.js must meet the Next.js engine requirement specified in `package.json` dependencies (Node 20.9.0 or later); use an LTS Node release for normal development. npm is the sole package manager, and `package-lock.json` is committed and never edited by hand.

Normal CSS is used: global design tokens live in `app/globals.css` and page-local styles use CSS Modules. This avoids an unnecessary UI framework and keeps the visual system lightweight.

## Directory boundaries

- `app/` contains public App Router routes and shared application styles.
- `components/public/` is reserved for reusable public-site components.
- `components/admin/` is reserved for private admin-panel components and must not be mixed with public UI.
- `lib/` contains framework-neutral shared application helpers.
- `services/` isolates external integrations; the Firebase Web client and admin-access verification live here.
- `utils/` contains small pure utility functions.
- `public/images/` keeps optimized source assets organized by `logo`, `courses`, `gallery`, and `certifications` without duplicates.

Future public routes can be added under `app/` for `/about`, `/courses`, `/student-zone`, `/gallery`, `/contact`, and `/apply`. Private routes belong under `app/admin/` (for example `/admin/login`, `/admin/dashboard`, `/admin/students`, `/admin/courses`, and `/admin/results`). Route and component separation should remain intact as those areas are built.

## Future data rules

- **Roll numbers are strings.** A roll number has at least six digits but may be longer; never parse it as an integer, so values such as `"123456"` and `"123456789"` retain their exact value.
- **Dates of birth use one normalized internal format:** ISO 8601 calendar dates, `YYYY-MM-DD`. A future UI may display Indian formatting, but storage and comparison must use the normalized value.
- **Results are dynamic.** Do not establish a fixed subject/maximum/obtained-marks schema. Future course-specific result templates must support custom headings, rows, columns, percentage-only and marks-based outputs.

## Student Management

Private student records are stored in `students/{studentId}` and are accessed only from protected admin UI. Each record holds the required identity, course, contact, admission, and status fields. Date of birth and admission date are stored as date-only `YYYY-MM-DD` strings so they round-trip safely through HTML date inputs without timezone shifts. Creation and update audit fields use Firestore `serverTimestamp()`.

Roll numbers retain their trimmed original display value in the student document but use a trimmed uppercase value for uniqueness. A matching `studentRollNumbers/{normalizedRollNumber}` index document is created, changed, or removed in the same Firestore transaction as the student record, preventing concurrent duplicate roll-number creation.

## Result Management

Private results live in `results/{resultId}` and always reference the canonical `studentId`. The student name, roll number, and course are copied only as display snapshots. Each result contains a required title and session, a subject array of `{ subjectName, maximumMarks, obtainedMarks }`, calculated totals and percentage, optional manual grade/result-status fields, and a `published` flag. Totals and percentage are always derived from validated subject marks; no grading scheme is assumed. Result writes use `serverTimestamp()` for creation and updates, and public Student Zone code does not read this collection.

## Firebase and performance

Firebase Authentication and Cloud Firestore use the modular Firebase Web SDK through `services/firebase.js`. The client reuses an existing initialized app during development. Admin sign-in uses Email/Password Authentication, then verifies Firestore-rule access before loading protected admin UI; Firebase Authentication alone is not considered admin authorization. Keep real configuration in `.env.local`, which is ignored by Git; `.env.example` lists only public variable names. Future data services must remain in `services/` and preserve Firestore Security Rules rather than weakening them in client code.

The project follows a performance-first approach: keep dependencies minimal, use Next.js image optimization when real assets are added, avoid duplicate/oversized images, and add packages only when a real feature needs them.
