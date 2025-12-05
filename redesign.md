Redesign FocusLoop UI Implementation Plan
Goal Description
Redesign the FocusLoop application to match the "Anti" app's aesthetic. This involves updating the visual style (colors, typography, spacing, shadows, rounded corners) to be "fresher" and "cleaner", mimicking the provided screenshots.

User Review Required
Visual Style: The redesign will change the look and feel significantly.
Theme: Dark mode and Light mode will be adjusted.
Proposed Changes
Theme & Global Styles
src/App.tsx
:
Update MUI createTheme:
Palette:
Primary: #2563EB (Tailwind blue-600).
Secondary: #9333EA (Tailwind purple-600) - for gradients.
Background:
Default: Light: #F9FAFB (gray-50), Dark: #111827 (gray-900).
Paper: Light: #FFFFFF, Dark: #1F2937 (gray-800).
Text:
Primary: Light: #111827 (gray-900), Dark: #F3F4F6 (gray-100).
Secondary: Light: #4B5563 (gray-600), Dark: #9CA3AF (gray-400).
Divider: Light: #E5E7EB (gray-200), Dark: #374151 (gray-700).
Typography:
Font Family: 'Inter', sans-serif.
Headers: fontWeight: 700.
Shape: borderRadius: 12 (matches rounded-xl).
Shadows:
Card: 0 1px 2px 0 rgb(0 0 0 / 0.05) (shadow-sm).
Hover: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) (shadow-md).
Components:
MuiCard:
backgroundImage: 'none' (fix for dark mode elevation).
border: '1px solid', borderColor: 'divider'.
boxShadow: 'shadows[1]'.
MuiButton:
borderRadius: 12.
textTransform: 'none'.
fontWeight: 600.
boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' (for contained buttons).
MuiAppBar:
backgroundColor: 'rgba(255, 255, 255, 0.8)' (light) / rgba(31, 41, 55, 0.8) (dark).
backdropFilter: 'blur(12px)'.
borderBottom: '1px solid', borderColor: 'divider'.
boxShadow: 'none'.
src/index.css
:
Import Inter font.
Set body background color explicitly to match theme.
Components
src/core/components/AppLayout (in 
App.tsx
):

Header:
Title: Gradient text from-blue-600 to-purple-600.
Logo: Rounded corners rounded-lg.
Navigation:
Bottom footer style or keep current top bar but styled like Anti's header.
src/features/timers/components/TimerCard.tsx
:

Container: borderRadius: 3 (12px), border: 1px solid divider.
Progress:
Track: Light: gray-100, Dark: gray-700.
Indicator: Primary Blue.
Buttons:
Main Action: Gradient or solid Blue-600.
Secondary: Text or Outlined with gray colors.
src/features/notes/components/NoteAccordionItem.tsx
:

Container: Match TimerCard style (bg-white dark:bg-gray-800, border, shadow-sm).
Hover: shadow-md, translate-y-[-2px].
Pages
src/features/timers/pages/TimersPage.tsx
:
Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.
"Add Timer" button: Floating Action Button (FAB) bottom right, or prominent card at start of list.
src/features/notes/NotesPage.tsx:
Grid layout similar to Timers.
Verification Plan
Automated Tests
Run npm run lint to ensure no style regressions or unused imports.
Run npm run test to ensure logic is still sound.
Run npm run build to ensure the app builds with new styles.
Manual Verification
Visual Check:
Verify Light Mode matches "Anti" light screenshots.
Verify Dark Mode matches "Anti" dark screenshots.
Check Card styling (radius, shadow).
Check Typography (font, readability).