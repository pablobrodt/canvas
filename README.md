# 🎨 Picasso

A highly-performant, React-based digital whiteboard and drawing application built for seamless creativity and diagramming. 

## 🚀 General Use
Picasso is designed to be a fast, intuitive workspace for sketching ideas, creating flowcharts, and managing visual layouts. Whether you need a quick scratchpad for freehand drawing or a structured grid for geometric shapes and text, this tool provides a lightweight, entirely browser-based environment. It features a modern, clean UI with a comprehensive toolset and full keyboard shortcut support to keep your workflow uninterrupted.

## ✨ Developed Features

### Core Canvas Tools
- **Select (V)**: Interact with, move, and edit existing elements on the board.
- **Draw (D)**: Freehand drawing for sketching and annotations.
- **Eraser (E)**: Precision erasing of freehand strokes.
- **Shapes**: Create geometric elements including **Rectangles (R)**, **Circles (C)**, and **Ellipses (O)**.
- **Lines & Arrows (A)**: Connect ideas and build flowcharts easily.
- **Text (T)**: Double-click anywhere to add customizable, scalable typography.
- **Image Integration**: Insert images via URL or simply **paste** them directly from your clipboard!

### Styling & Customization
- **Color Palettes**: Independent control over **Stroke** and **Fill** colors, including transparent fills.
- **Stroke Width**: Dynamically adjust the thickness of your lines and shape borders.
- **Toggle Grid (G)**: Overlay an alignment grid to help structure your diagrams.

### Workspace Management
- **Robust History**: Infinite Undo (⌘Z) and Redo (⌘⇧Z) powered by highly-performant state snapshots.
- **Selection & Deletion**: Select individual elements and hit `Delete`/`Backspace` to remove them.
- **Clear Board**: Instantly wipe the canvas clean to start fresh.
- **Exporting**: Export your current canvas state (features accessible via the Export Menu).

## 🛠 Technical Architecture
- **Frontend Framework**: React + Vite
- **Language**: Strict TypeScript
- **Canvas Rendering**: `react-konva` for native 60fps 2D rendering.
- **State Management**: `zustand` (with `structuredClone` for highly-performant deep-copy history management).
- **Agent-Driven**: Developed and maintained utilizing a structured AI Agent workflow (Architect, Product Owner, Developer, and Reviewer).

