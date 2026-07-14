# AI Session Handover Context

## Project Overview
**Project Name:** Riders Gear Nairobi
**Path:** `c:\Users\Stanley\Desktop\PROJECTS\Riders Gear Nairobi`
**Stack:** React, Vite, Firebase (Firestore, Auth), Cloudinary

## Current State
The codebase currently has a functional frontend but significant issues in terms of security and code hygiene. 
A comprehensive review was just completed, and we are about to begin making code changes. **Before doing so, a git branch `backup-before-fixes` (or similar commit) was created as a restore point.**

## Mandate / Constraints
The user (Stanley) has given a strict mandate for code modifications:
- **SCOPE — DO NOT:**
  - Change any feature behavior, business logic, or user-facing functionality.
  - Change API contracts (request/response shapes, status codes, auth flows).
  - Change data flow, processing order, or side effects of any function.
  - Add new dependencies unless a critical security fix requires it (and must ask first).

- **SCOPE — DO:**
  1. **Code Hygiene (low-risk only):** Fix formatting/linting (based on existing config), remove dead code/unused imports (summarizing removals for review), flag duplicated logic/God functions (but do not refactor without a judgment call from the user).
  2. **Security Review:** Fix hardcoded secrets, injection risks, broken auth, or excessive privileges.

## Review Findings & Next Steps

If resuming this chat, the immediate next steps are to address the following findings (pending user go-ahead):

1. **[Critical] Broken Checkout Workflow:** `Checkout.jsx` tries to submit an order without Firebase authentication. However, `firestore.rules` enforces `request.auth != null`. **Fix:** Implement Firebase Anonymous Authentication in `Checkout.jsx` (or a global provider) so users get a temporary auth token before writing to Firestore.
2. **[High] Client-Side Pricing/Stock Risk:** The transaction in `src/services/sales.js` runs purely on the client and relies on the client payload for the order `total`. **Fix/Mitigation:** Since backend changes (e.g. Cloud Functions) violate the "no data flow change" rule unless approved, we may need to implement stricter Firestore Rules to validate totals or just warn the user.
3. **[High] Unsigned Cloudinary Uploads:** Fix the usage of an unsigned preset in `src/firebase/storage.js` if possible, or at least flag it for a backend migration.
4. **[Medium] Hardcoded Admin Email:** In `firestore.rules`, the admin email `ridersgeartest@gmail.com` is hardcoded. It needs to align with `VITE_ADMIN_EMAIL`.
5. **[Medium] God Component & Linting:** `src/pages/AdminDashboard.jsx` is huge and triggers React Hooks warnings by defining components (`NavButton`) during render. Clean up unused variables found in `eslint.log`.

## How to Resume
1. Review this document.
2. Check `git status` to ensure you are on the correct branch and review recent commits.
3. Ask the user which of the above Next Steps they would like to tackle first.
