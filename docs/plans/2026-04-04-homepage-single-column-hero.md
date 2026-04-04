# Homepage Single-Column Hero Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the split homepage hero with a single-column layout that uses a full-width presentation image followed by text and calls to action below it.

**Architecture:** Keep the existing homepage data source in `src/utils/site.ts`, but change the hero markup in `src/pages/index.astro` so the image becomes a top-level full-width visual and the copy becomes a stacked text block below it. Update `src/styles/global.css` to remove the two-column hero grid, add a large-image treatment, and restyle the copy/stats/support blocks for the new flow.

**Tech Stack:** Astro, CSS, static image assets in `public/images`

---

### Task 1: Update hero content source

**Files:**
- Modify: `src/utils/site.ts`

**Step 1: Change the hero title**

Set the hero title to `Weijie Sun`.

**Step 2: Add a short research headline**

Add a new `headline` field describing the research focus in one line.

**Step 3: Keep the existing bio as the long description**

Retain the fuller paragraph for the text block below the title.

### Task 2: Rebuild homepage hero markup

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Keep the presentation image as the hero visual**

Continue using the dedicated cropped asset `/images/Vascular_2023_hero.jpg`.

**Step 2: Replace the split layout with stacked sections**

Render the image first, then a text container below it with eyebrow, title, headline, description, highlights, CTA buttons, stats, and current-position note.

**Step 3: Keep the rest of the homepage unchanged**

Do not reorder lower homepage sections.

### Task 3: Restyle the hero for a single-column editorial layout

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Remove the desktop two-column hero grid**

Make `.hero` a single-column container with a full-width image.

**Step 2: Style the image as the main visual**

Use a taller media frame with a stable crop and clear caption treatment.

**Step 3: Style the text block below**

Create a stacked editorial text area with strong title hierarchy, CTA spacing, stats row, and a full-width current-position card.

**Step 4: Preserve responsive behavior**

Ensure mobile keeps the same image-first flow with readable spacing and no hidden person crop issue.

### Task 4: Verify build and preview

**Files:**
- Modify: none

**Step 1: Run the production build**

Run: `npm run build`
Expected: Astro build succeeds.

**Step 2: Review the local preview**

Capture a fresh local screenshot or inspect the running preview at `http://127.0.0.1:4321`.
