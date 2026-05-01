# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-05-01
### Added
- **Core Canvas Tools**:
  - `Select` (V) tool for interacting, moving, and editing existing elements.
  - `Draw` (D) tool for freehand sketching and annotations.
  - `Eraser` (E) tool for precision erasing of freehand strokes.
  - `Rectangle` (R), `Circle` (C), and `Ellipse` (O) tools for creating geometric elements.
  - `Arrow` (A) tool to connect ideas and build flowcharts easily.
  - `Text` (T) tool allowing double-click interactions to add customizable, scalable typography.
  - Image Integration: capability to insert images via URL or simply by pasting directly from the clipboard.
- **Styling & Customization**:
  - Color Palettes with independent control over Stroke and Fill colors (including transparent fills).
  - Dynamic Stroke Width adjustment for lines and shape borders.
  - Toggleable Grid (G) overlay to help structure diagrams.
- **Workspace Management**:
  - Infinite Undo (⌘Z) and Redo (⌘⇧Z) powered by highly-performant `structuredClone` state snapshots.
  - Selection & Deletion capabilities for removing individual elements.
  - Clear Board action to instantly wipe the canvas clean.
  - Export functionality to download the canvas state.
- **Technical Architecture**:
  - Built with React, Vite, and strict TypeScript.
  - High-performance 2D rendering powered by `react-konva`.
  - Scalable state management handled by `zustand`.
