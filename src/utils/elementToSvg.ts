import type {
  CanvasElement,
  RectangleElement,
  CircleElement,
  EllipseElement,
  ArrowElement,
  DrawElement,
  TextElement,
  ImageElement,
} from '../types/canvas';

// ─── Attribute Helpers ────────────────────────────────────────────

/** Escapes special XML characters in attribute values. */
const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Maps `transparent` to `none` for SVG fill/stroke attributes. */
const svgColor = (color: string): string =>
  color === 'transparent' ? 'none' : color;

/**
 * Builds a `transform="rotate(deg, cx, cy)"` attribute string.
 * Returns empty string when rotation is 0.
 */
const rotationAttr = (rotation: number, cx: number, cy: number): string =>
  rotation !== 0 ? ` transform="rotate(${rotation}, ${cx}, ${cy})"` : '';

/** Builds common presentation attributes shared by all shape elements. */
const presentationAttrs = (el: CanvasElement): string => {
  const parts: string[] = [];
  if (el.opacity !== 1) parts.push(`opacity="${el.opacity}"`);
  if (svgColor(el.stroke) !== 'none') {
    parts.push(`stroke="${svgColor(el.stroke)}"`);
    parts.push(`stroke-width="${el.strokeWidth}"`);
  } else {
    parts.push('stroke="none"');
  }
  parts.push(`fill="${svgColor(el.fill)}"`);
  return parts.join(' ');
};

// ─── Per-type Mappers ─────────────────────────────────────────────

const rectangleToSvg = (el: RectangleElement): string => {
  const rot = rotationAttr(el.rotation, el.x + el.width / 2, el.y + el.height / 2);
  const rx = el.cornerRadius > 0 ? ` rx="${el.cornerRadius}" ry="${el.cornerRadius}"` : '';
  return `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}"${rx} ${presentationAttrs(el)}${rot}/>`;
};

const circleToSvg = (el: CircleElement): string => {
  const rot = rotationAttr(el.rotation, el.x, el.y);
  return `  <circle cx="${el.x}" cy="${el.y}" r="${el.radius}" ${presentationAttrs(el)}${rot}/>`;
};

const ellipseToSvg = (el: EllipseElement): string => {
  const rot = rotationAttr(el.rotation, el.x, el.y);
  return `  <ellipse cx="${el.x}" cy="${el.y}" rx="${el.radiusX}" ry="${el.radiusY}" ${presentationAttrs(el)}${rot}/>`;
};

/**
 * Converts a flat points array [x0,y0, x1,y1, …] into a smooth SVG path `d` attribute.
 * Uses quadratic bezier curves to approximate Konva's tension-based catmull-rom smoothing.
 */
const pointsToSmoothPath = (points: number[]): string => {
  if (points.length < 2) return '';
  if (points.length === 2) return `M${points[0]},${points[1]}`;
  if (points.length === 4) return `M${points[0]},${points[1]} L${points[2]},${points[3]}`;

  const parts: string[] = [`M${points[0]},${points[1]}`];

  // For just two points (4 values) draw a line
  if (points.length <= 4) {
    parts.push(`L${points[2]},${points[3]}`);
    return parts.join(' ');
  }

  // Use quadratic bezier through midpoints for smooth curves
  for (let i = 0; i < points.length - 2; i += 2) {
    const x0 = points[i];
    const y0 = points[i + 1];
    const x1 = points[i + 2];
    const y1 = points[i + 3];

    if (i === 0) {
      // First segment: line to midpoint
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      parts.push(`L${mx},${my}`);
    }

    if (i + 4 < points.length) {
      // Middle segments: quadratic bezier with control point at current vertex
      const x2 = points[i + 4];
      const y2 = points[i + 5];
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      parts.push(`Q${x1},${y1} ${mx},${my}`);
    } else {
      // Last segment: line to final point
      parts.push(`L${x1},${y1}`);
    }
  }

  return parts.join(' ');
};

const drawToSvg = (el: DrawElement): string => {
  const d = pointsToSmoothPath(el.points);
  const rot = rotationAttr(el.rotation, el.x, el.y);
  return `  <path d="${d}" fill="none" stroke="${svgColor(el.stroke)}" stroke-width="${el.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${el.opacity !== 1 ? ` opacity="${el.opacity}"` : ''}${rot}/>`;
};

/**
 * Converts an arrow element into SVG.
 * Draws the line as a <path> and appends an arrowhead polygon,
 * matching Konva's pointerLength/pointerWidth calculation.
 */
const arrowToSvg = (el: ArrowElement): string => {
  const pts = el.points;
  if (pts.length < 4) return '';

  // Line from first to last point
  const x1 = pts[0];
  const y1 = pts[1];
  const x2 = pts[pts.length - 2];
  const y2 = pts[pts.length - 1];

  const pointerLength = 10 + el.strokeWidth * 2;
  const pointerWidth = 10 + el.strokeWidth * 2;

  // Calculate arrowhead direction
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const halfWidth = pointerWidth / 2;

  // Three points of the arrowhead triangle
  const tipX = x2;
  const tipY = y2;
  const leftX = x2 - pointerLength * Math.cos(angle) + halfWidth * Math.sin(angle);
  const leftY = y2 - pointerLength * Math.sin(angle) - halfWidth * Math.cos(angle);
  const rightX = x2 - pointerLength * Math.cos(angle) - halfWidth * Math.sin(angle);
  const rightY = y2 - pointerLength * Math.sin(angle) + halfWidth * Math.cos(angle);

  const rot = rotationAttr(el.rotation, el.x, el.y);
  const opacityAttr = el.opacity !== 1 ? ` opacity="${el.opacity}"` : '';

  // Build a group with line + arrowhead
  return [
    `  <g${rot}${opacityAttr}>`,
    `    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${svgColor(el.stroke)}" stroke-width="${el.strokeWidth}" stroke-linecap="round"/>`,
    `    <polygon points="${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}" fill="${svgColor(el.fill)}" stroke="${svgColor(el.stroke)}" stroke-width="1"/>`,
    `  </g>`,
  ].join('\n');
};

/**
 * Converts a text element into SVG.
 * Uses `dominant-baseline="hanging"` to match Konva's top-left origin for text.
 */
const textToSvg = (el: TextElement): string => {
  const rot = rotationAttr(el.rotation, el.x, el.y);
  const opacityAttr = el.opacity !== 1 ? ` opacity="${el.opacity}"` : '';
  const escapedText = escapeXml(el.text);

  // Handle multi-line text by splitting into <tspan> elements
  const lines = escapedText.split('\n');
  if (lines.length <= 1) {
    return `  <text x="${el.x}" y="${el.y}" font-family="${el.fontFamily}" font-size="${el.fontSize}" fill="${svgColor(el.fill)}" dominant-baseline="hanging"${opacityAttr}${rot}>${escapedText}</text>`;
  }

  const tspans = lines
    .map(
      (line, i) =>
        `    <tspan x="${el.x}" dy="${i === 0 ? 0 : el.fontSize * 1.2}">${line}</tspan>`
    )
    .join('\n');

  return [
    `  <text font-family="${el.fontFamily}" font-size="${el.fontSize}" fill="${svgColor(el.fill)}" dominant-baseline="hanging"${opacityAttr}${rot}>`,
    tspans,
    `  </text>`,
  ].join('\n');
};

const imageToSvg = (el: ImageElement): string => {
  const rot = rotationAttr(el.rotation, el.x + el.width / 2, el.y + el.height / 2);
  const opacityAttr = el.opacity !== 1 ? ` opacity="${el.opacity}"` : '';
  return `  <image x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" href="${el.src}"${opacityAttr}${rot}/>`;
};

// ─── Dispatcher ───────────────────────────────────────────────────

/**
 * Converts a single CanvasElement to its SVG XML string representation.
 * Returns empty string for unsupported element types (e.g. eraser).
 */
export const elementToSvgString = (element: CanvasElement): string => {
  switch (element.type) {
    case 'rectangle':
      return rectangleToSvg(element as RectangleElement);
    case 'circle':
      return circleToSvg(element as CircleElement);
    case 'ellipse':
      return ellipseToSvg(element as EllipseElement);
    case 'draw':
      return drawToSvg(element as DrawElement);
    case 'arrow':
      return arrowToSvg(element as ArrowElement);
    case 'text':
      return textToSvg(element as TextElement);
    case 'image':
      return imageToSvg(element as ImageElement);
    case 'eraser':
      // Eraser uses canvas compositing (destination-out) — no SVG equivalent
      return '';
    default:
      return '';
  }
};

// ─── Document Builder ─────────────────────────────────────────────

/**
 * Builds a complete SVG XML document from an array of CanvasElements.
 * Filters out eraser elements and any elements that produce empty SVG strings.
 */
export const buildSvgDocument = (
  elements: CanvasElement[],
  width: number,
  height: number
): string => {
  const svgElements = elements
    .filter((el) => el.type !== 'eraser')
    .map(elementToSvgString)
    .filter(Boolean);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
    `     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    ...svgElements,
    '</svg>',
  ].join('\n');
};
