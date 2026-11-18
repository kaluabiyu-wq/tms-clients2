# TMS Client Color System

The application uses a light, low-glare workspace with a trustworthy blue brand and a restrained amber accent. Shared tokens are defined in `src/styles.scss`; feature styles should use these tokens instead of introducing new one-off colors.

| Token / role | Hex | Intended use |
|---|---:|---|
| `--color-primary` | `#1E40AF` | Brand header, navigation, strong brand elements |
| `--color-primary-interactive` | `#2563EB` | Primary buttons, links, selected tabs, focus |
| `--color-primary-tint` | `#DBEAFE` | Selected rows, hover surfaces, soft highlights |
| `--color-accent` | `#F59E0B` | Progress emphasis and selected calls to action; pair with dark text |
| `--color-success` | `#16A34A` | Completed, passed, attended |
| `--color-warning` | `#D97706` | Pending and upcoming deadlines |
| `--color-danger` | `#DC2626` | Failed, overdue, destructive actions |
| `--color-info` | `#0284C7` | Informational states and notices |
| `--color-text` | `#0F172A` | Main text and headings |
| `--color-text-muted` | `#64748B` | Supporting labels and descriptions |
| `--color-panel-border` | `#E2E8F0` | Card, table, and input borders |
| `--color-canvas` | `#F8FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels, menus, and dialogs |

## Usage rules

- Prefer `var(--color-...)` tokens in component SCSS and inline component styles.
- Use blue for navigation and standard actions; reserve amber for progress and high-visibility emphasis.
- Use dark text (`--color-on-accent-bright`) on amber surfaces. Do not use white text on `#F59E0B`.
- Pair status colors with visible status text or an icon; never communicate status through color alone.
- Keep cards white on the cool-gray page canvas, with subtle borders and restrained shadows.
- Angular Material uses the blue primary palette and orange tertiary palette to stay aligned with the application theme.
