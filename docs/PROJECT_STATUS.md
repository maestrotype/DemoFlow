# DemoFlow Project Status & Roadmap

## 1. Current Active Task
- **Active Task File**: `docs/tasks/task_001_theme_wiring.md`
- **Current Milestone**: Phase 1: UI Foundation
- **Goal**: Wire the ThemeService into the root AppComponent so that theme attributes are correctly applied to the HTML document element.

---

## 2. Project Implementation Roadmap

### Phase 1: UI Foundation
- [ ] **Task 1: Wire ThemeService** (Target: `docs/tasks/task_001_theme_wiring.md`)
- [ ] **Task 2: Adopt Shared UI Buttons** (Target: `docs/tasks/task_002_shared_ui_buttons.md`)
- [ ] **Task 3: Migrate Inputs to Signals in AuthForm** (Target: `docs/tasks/task_003_auth_form_signals.md`)
- [ ] **Task 4: Consolidate Modal and Dialog components** (Target: `docs/tasks/task_004_consolidate_overlays.md`)

### Phase 2: Auth Flow & Guard Routing
- [ ] **Task 5: Wire Functional AuthGuard** (Target: `docs/tasks/task_005_auth_guard_routing.md`)
- [ ] **Task 6: Implement Login form submission logic** (Target: `docs/tasks/task_006_login_submissions.md`)

### Phase 3: Dashboard & Projects List
- [ ] **Task 7: Build Project Creation Wizard** (Target: `docs/tasks/task_007_create_project_wizard.md`)
- [ ] **Task 8: Wire ProjectCard into Projects Grid** (Target: `docs/tasks/task_008_project_grid_mapping.md`)

### Phase 4: Editor & Workspace
- [ ] **Task 9: Create Editor Workspace Layout** (Target: `docs/tasks/task_009_editor_workspace_layout.md`)
- [ ] **Task 10: Create Timeline Component** (Target: `docs/tasks/task_010_timeline_markers.md`)

---

## 3. Completed Tasks Record
- [x] Refactored Recent Projects feature to improve mock data quality and align with design system.
- [x] Normalized all component barrel exports with the `.component` suffix.
- [x] Fixed href issues in authentication layout by replacing `<a href>` with `[routerLink]`.
- [x] Registered `provideHttpClient` in app configuration.
- [x] Corrected SSR dynamic route configuration modes.
- [x] Implemented Statistics Cards component for dashboard