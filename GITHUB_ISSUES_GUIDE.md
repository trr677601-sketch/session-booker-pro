# GitHub Issues Guide — session-booker-pro

This file defines the discipline for tracking all work via GitHub Issues and Milestones in the `trr677601-sketch/session-booker-pro` repository.

**Every dev session must begin by reading this file and end with issues/milestones updated.**

---

## 1. Core Rule

**Before** you write any code (or modify any file), create or update the corresponding GitHub Issue. If the work is a sub-step of a larger feature, link the issue to the appropriate milestone.

**After** you finish a task, update the issue status (close it, add a comment summarizing what was done, update the milestone progress).

---

## 2. Milestones

Milestones track high-level delivery phases. The implementation plan is at `IMPLEMENTATION_IMPROVEMENTS.md` (10 features).  
Map them to milestones:

| Milestone | Scope | Due |
|-----------|-------|-----|
| `v1-booking-modal` | Booking Modal / Sheet (#1) | TBD |
| `v1-animations` | Scroll-Triggered Animations (#2) | TBD |
| `v1-schedule-ux` | Sticky Day Tabs (#3) + Mobile Schedule (#4) | TBD |
| `v1-media` | Image Lazy Loading & Lightbox (#5) | TBD |
| `v1-polish` | Micro-Interactions (#6) + Sticky Bottom Bar (#10) | TBD |
| `v1-testimonials` | Testimonial Carousel (#7) | TBD |
| `v1-nav` | Active Section Highlight (#8) | TBD |
| `v1-cleanup` | Prune Unused shadcn (#9) | TBD |

Create a milestone when starting work on a feature. Set a realistic `due_on` date.  
When an issue is completed, check if the milestone is fully done — if yes, close the milestone.

**API references:**
- `POST /repos/:owner/:repo/milestones` — create
- `PATCH /repos/:owner/:repo/milestones/:number` — update
- Issues accept `milestone` (milestone number) in create/update payloads

---

## 3. Labels

Use these project-specific labels (create them on first use):

| Label | Color | When to use |
|-------|-------|-------------|
| `feature` | `#a2eeef` | New functionality |
| `enhancement` | `#a2eeef` | Improvement to existing feature |
| `bug` | `#d73a4a` | Defect or unexpected behaviour |
| `ux` | `#fbca04` | User experience / UI work |
| `accessibility` | `#5319e7` | a11y concerns |
| `performance` | `#1d76db` | Optimisation work |
| `cleanup` | `#bfdadc` | Refactoring, removing dead code |
| `blocked` | `#d93f0b` | Waiting on something external |
| `good first issue` | `#7057ff` | Low-risk entry point |
| `question` | `#d876e3` | Needs discussion |

Always assign at least one label. Prefer `feature`/`enhancement`/`bug` as primary, then add a secondary label like `ux` or `performance` if relevant.

---

## 4. Issue Template

Every issue must include these sections:

```markdown
### Goal
What does this issue aim to achieve? (1–2 sentences)

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Implementation Notes
(optional) Technical details, files involved, approach.

### Related
- Parent issue/PR: #
- Milestone: name
- IMPLEMENTATION_IMPROVEMENTS.md item: #N
```

---

## 5. Issue Naming Convention

Use the imperative mood, present tense, and be specific:

- `Add BookingModal dialog for schedule Book buttons`
- `Fix day tabs not sticking below TopBar on mobile`
- `Remove unused shadcn Accordion component`

Bad: `Fix bugs`, `Update stuff`, `Work on schedule`.

---

## 6. Linking Code to Issues

- **Commits**: Include `#issue-number` in the commit message body or footer.  
  Example: `git commit -m "Add BookingModal with session details" -m "Closes #12"`
- **Branches**: Name branches `feature/short-name-#NN` where `NN` is the issue number.  
  Example: `feature/booking-modal-#12`

---

## 7. Closing an Issue

Close an issue only when ALL acceptance criteria are met AND the code is pushed to the remote `main` branch. Before closing:

1. Confirm the feature works (manual check or lint/test pass).
2. Add a comment summarising what was done and any follow-up thoughts.
3. Close the issue via commit message (`Closes #N`) or manually.

---

## 8. Session Workflow

1. **Read** this file and `IMPLEMENTATION_IMPROVEMENTS.md`.
2. **Check** open issues for any existing work on the topic.
3. **Pick** the next unstarted item from the implementation plan.
4. **Create** a GitHub Issue + ensure the milestone exists.
5. **Implement** the code.
6. **Update** the issue (comment on progress, mark ACs).
7. **Commit & push** with `Closes #N` in message if fully done.
8. **Update** the progress tracker in `IMPLEMENTATION_IMPROVEMENTS.md`.

---

## 9. Tools

The dev agent has native GitHub MCP tools available:

- `github_create_issue` — create issues
- `github_update_issue` — update title/body/state/labels
- `github_list_issues` — list/filter issues
- `github_get_issue` — read a single issue
- `github_create_pull_request` — create PRs (not used in this workflow yet)
- GitHub API over `curl` for milestones (no dedicated MCP tool)

Use these to keep issues in sync without leaving the terminal.
