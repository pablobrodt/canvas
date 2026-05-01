# 📋 Product Backlog

## ~~Task 1: Transparent Background for PNG Exports~~
~~**User Story**:~~ 
~~As a user, I want my PNG exports to always have a transparent background so that I can easily drop my diagrams into other documents or websites without a white bounding box.~~

~~**Context / Background**:~~ 
~~Currently, the canvas export might capture the default background color or stage background. Users expect standalone elements to be cleanly cut out.~~

~~**Acceptance Criteria (Definition of Done)**:~~
~~- Given the user clicks "Export to PNG", When the file is generated, Then the resulting image's background must be 100% transparent.~~
~~- Given the user has drawn elements, When exporting, Then the elements themselves must retain their exact colors and opacity.~~

~~**Technical Constraints**:~~ 
~~- `react-konva` or the underlying Konva stage `toDataURL` method must be configured (or a temporary layer must be hidden/styled) to omit the background fill during the capture phase.~~

~~**Out of Scope**:~~ 
~~- Modifying the visual background of the live canvas workspace (it should still appear normally to the user while drawing).~~

---

## Task 2: Omit Grid from All Exports
**User Story**: 
As a user, I want the alignment grid to be excluded from all exported files (PNG, JSON, etc.) so that my final exported image looks clean and professional.

**Context / Background**: 
The grid is a workspace utility. If it is currently toggled "on", it shouldn't bleed into the final exported snapshot.

**Acceptance Criteria (Definition of Done)**:
- Given the grid is visible on the canvas, When the user triggers any visual export (e.g., PNG), Then the grid layer must not be visible in the resulting file.
- Given the export finishes, When the user returns to drawing, Then the grid must remain visible on their screen if it was previously toggled on.

**Technical Constraints**: 
- The export logic must temporarily hide the Grid component/layer before calling the Konva export method, and immediately restore its visibility afterward.

**Out of Scope**: 
- Removing the grid feature entirely.

---

## Task 3: JSON Progress Export (Save State)
**User Story**: 
As a user, I want to export my entire canvas as a JSON file so that I can save my progress locally since the application does not have a backend database.

**Context / Background**: 
Currently, if the user refreshes the browser, they lose their drawing. We need a way to serialize the Zustand state to disk.

**Acceptance Criteria (Definition of Done)**:
- Given the user clicks "Export to JSON", When the file downloads, Then the file must contain the fully serialized array of `CanvasElement` objects.
- Given the grid is on or off, When exporting JSON, Then the grid state or background should NOT be saved as a drawable element (only the user's shapes/lines/text).

**Technical Constraints**: 
- Must export the exact `elements` array from the `useCanvasStore`.

**Out of Scope**: 
- Auto-saving to `localStorage` (this is strictly a manual file-based save feature for this iteration).

---

## Task 4: JSON Progress Import (Load State)
**User Story**: 
As a user, I want to upload a previously saved JSON file into the canvas so that I can resume making changes to my diagrams.

**Context / Background**: 
This is the companion feature to Task 3. Users need a way to hydrate the Zustand store with their saved data.

**Acceptance Criteria (Definition of Done)**:
- Given the user selects "Import from JSON", When they upload a valid file, Then the canvas must instantly render the saved elements.
- Given the user imports a file, When it loads, Then the previous canvas state must be completely cleared and replaced by the new file's state.
- Given the user uploads an invalid file (not JSON, or missing canvas elements), When it fails, Then the app should gracefully ignore it or alert the user, without crashing the app.

**Technical Constraints**: 
- The imported data must be validated to ensure it conforms to the `CanvasElement[]` type before being injected into the Zustand store.
- Must push a history state so the user can "Undo" the import if they did it by mistake.

**Out of Scope**: 
- Collaborative real-time editing.

---

## Task 5: Eraser Tool Custom Cursor Area
**User Story**: 
As a user, I want the cursor to change into a square representing the exact erase area when I select the Eraser tool, so that I know precisely what parts of my drawing will be deleted.

**Context / Background**: 
Currently, the eraser might just show a standard mouse pointer or crosshair. Because erasing relies on a collision radius/area, a visual bounding box helps users avoid accidentally deleting adjacent strokes.

**Acceptance Criteria (Definition of Done)**:
- Given the user selects the "Eraser" tool, When they move the mouse over the canvas, Then the default cursor should be hidden and replaced by a visual square (or circle) that tracks the mouse position.
- Given the user changes the "Stroke Width" setting while using the eraser, When they move the mouse, Then the custom cursor square should dynamically scale to match the new erase area.
- Given the user switches to a different tool, When they do, Then the custom eraser cursor must disappear and revert to the standard pointer/crosshair.

**Technical Constraints**: 
- Must utilize Konva's custom cursor capabilities or render a temporary transparent `Rect` on an overlay layer that follows the pointer.
- The size of the visual cursor must perfectly mathematically match the actual erasure hit-box.

**Out of Scope**: 
- Creating custom cursors for other tools (this task is strictly for the Eraser).
