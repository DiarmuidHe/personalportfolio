# CV

The CV is generated, not hand-edited, so it cannot drift from the site.

```bash
npm run cv
```

That reads [`src/data/profile.js`](../src/data/profile.js) and
[`cv-data.mjs`](cv-data.mjs), writes `cv/out/cv.html` for previewing, and prints
`public/Diarmuid-Hession-CV.pdf` — the file the `/cv` page serves.

## Where each part comes from

| On the CV | Source |
| --- | --- |
| Name, address, email, links | `PROFILE` in `profile.js` (address in `cv-data.mjs`) |
| Technical skills | `PROFILE.skills` (duplicates across groups are dropped) |
| Job titles, companies, dates | `EXPERIENCE` in `profile.js` |
| Job bullets | `cv-data.mjs` (falls back to the site's `highlights`) |
| Project case-study links | `portfolio.json`, via `PROJECTS` |
| Project titles, tech, blurbs | `cv-data.mjs` (`projects`, and `otherProjects` for the one-line links) |
| Degree, classification, grades | `PROFILE.education` |
| Soft skills, references | `cv-data.mjs` |

## Updating it

1. New job, new date, new skill, new grade, new project link → edit
   `src/data/profile.js` (the site and the chat assistant pick it up too).
2. CV-only wording → edit `cv/cv-data.mjs`.
3. Run `npm run cv` and commit the regenerated PDF.

The build prints a warning whenever `cv-data.mjs` overrides a job title or
company with something different from `profile.js`, or points at a project that
is no longer in `portfolio.json`. Those warnings are the drift check — read them
each time. The current ones are deliberate: the CV keeps the older
"I.T. Administrator Intern | QTP", "Volunteer Coding Mentor | CoderDojo
Mullingar" and "McDonald's Mullingar" wording.

## Requirements

Headless Edge or Chrome does the printing, so there is nothing to install. If
neither is in the usual place, set `EDGE_PATH` to the browser executable.

`icons.json` holds the contact icons (Font Awesome paths from `react-icons`) and
`logo-icon.png` is `public/Logo.png` scaled to icon size, so the build does not
need `node_modules`.

## Layout

The page copies the original Word CV. The banner, the contact box, the margins
and the type sizes are the measurements taken out of
`archive/2025-DiarmuidHession-LinkedIn-CV.pdf` — the comment at the top of
`build-cv.mjs` lists them with the PDF operators they came from. Change them
only against that reference.

## archive/

Superseded CVs, kept out of `public/` so they are not published. The old
LinkedIn-styled CV is `archive/2025-DiarmuidHession-LinkedIn-CV.pdf`; its old
URL 301s to the new file in [`public/_redirects`](../public/_redirects).
