# 🔭 Product Discovery & Ideation

*As the Product Owner, this document serves as a brainstorming space for high-impact features that will significantly elevate the Canvas application. These ideas are currently in the "Discovery" phase and have not yet been formalized into the Backlog.*

---

## 1. Infinite Canvas (Pan & Zoom)
**The Concept**: 
Currently, the canvas is bound to the window size. To support large-scale mind mapping and complex system architecture diagrams, users need an infinite workspace.
**Core Mechanics**:
- **Zoom**: Use the scroll wheel (or trackpad pinch) to zoom in and out, keeping the cursor as the focal point.
- **Pan**: Hold the `Spacebar` (or use Middle-Click) and drag to pan around the canvas seamlessly.
- **Minimap**: A small UI widget in the bottom corner showing a zoomed-out view of where elements are located on the infinite plane.

## 2. Z-Index Layer Management (Bring Forward / Send Back)
**The Concept**: 
As diagrams become more complex, shapes and text inevitably overlap. Users need control over the stacking order to ensure backgrounds stay behind foreground text.
**Core Mechanics**:
- **Shortcuts**: `⌘ + ]` to bring an element forward, `⌘ + [` to send it backward.
- **Context Menu**: A right-click menu offering "Bring to Front", "Bring Forward", "Send Backward", and "Send to Back".
- **Implementation Note**: This requires manipulating the order of items within the Zustand `elements` array.

## 3. Smart Alignment Guides & Snap-to-Grid
**The Concept**: 
Drawing clean, professional flowcharts requires precise alignment. Relying purely on the user's hand is error-prone.
**Core Mechanics**:
- **Snap-to-Grid**: If the grid is enabled, dragging an element should snap its edges or center to the nearest grid intersection.
- **Smart Guides**: When dragging a shape near another shape, display faint red dashed lines indicating that their centers or edges are perfectly aligned.

## 4. Element Grouping
**The Concept**: 
Users often build complex UI components or diagrams out of multiple basic shapes (e.g., a rectangle with text inside). They need a way to treat these multi-part diagrams as a single entity.
**Core Mechanics**:
- **Group (⌘G)**: Merges selected elements into a single `Group` node so they can be dragged, copied, and deleted together.
- **Ungroup (⌘⇧G)**: Breaks the group back down into individual, selectable elements.

## 5. Real-Time Collaboration (Multiplayer)
**The Concept**: 
The ultimate goal for a digital whiteboard is collaborative brainstorming.
**Core Mechanics**:
- **Live Cursors**: See other users' cursors moving around the screen in real-time with their names attached.
- **CRDTs / WebSockets**: Integrate a backend (like Yjs or Liveblocks) to sync the Zustand state across multiple clients instantly without merge conflicts.

## 6. Configurable Export Padding & Formats (SVG/PDF)
**The Concept**: 
While the backlog contains a fix for transparent PNGs, professionals often need vector graphics.
**Core Mechanics**:
- **SVG Export**: Generate pure SVG strings from the Konva stage so users can scale their diagrams infinitely in Adobe Illustrator or Figma.
- **Bounding Box Padding**: When exporting, automatically crop the canvas to the bounding box of the drawn elements, adding a configurable padding (e.g., 20px) rather than exporting the entire empty window.
