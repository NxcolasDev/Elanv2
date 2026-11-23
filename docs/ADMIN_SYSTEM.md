# Admin system

A Firebase user is a student unless a verified token contains the custom claim role=admin. Express checks the signature, project, expiry, revocation state, and role on every administrative API call. No web endpoint grants access. Student practice, history, decks, notes, and AI feedback remain available under their existing access rules. Signed-in students can generate private practice and cannot publish content.

## First administrator

1. Sign into the intended Firebase project with an active Google account that has a verified email.
2. In a trusted operator environment, set FIREBASE_PROJECT_ID for that project. Use ADC with permission to manage Firebase Auth users and custom claims for that project. Keep the Cloud Run service identity read-only for user lookup.
3. From backend/, run the grant command with the verified address and project ID. Sign out and back in to refresh the token. Open /admin.

```bash
node scripts/admin-role.js grant editor@example.com your-firebase-project-id
node scripts/admin-role.js revoke editor@example.com your-firebase-project-id
```

The script requires the project argument to match FIREBASE_PROJECT_ID, preserves unrelated custom claims, and revokes refresh tokens when you remove the role. Record the grant or revocation with other operator changes.

## Content operations

Choose IELTS or DELF and one of Reading, Listening, or a Writing/Speaking model. A preview runs the harness and shows the actual result. Save a valid preview or enter valid JSON to create a draft. Review the text, questions, answers, and source evidence before marking it reviewed. Publish reviewed records or unpublish them back to reviewed. Editing a reviewed record returns it to draft. The revision number protects against stale edits.

The public catalog exposes the latest published Reading and Listening exercise and up to 12 published models per exam. The pages use that catalog with bundled practice available. The panel presents database and key configuration state, prompt version, and recent generation metadata. Administrative content changes emit structured audit events without payloads.

[Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) · [API contracts](API_REFERENCE.md)
