import { ReactNode } from 'react';

export interface WindowComponentProps {
  /** Initial width in pixels, or 'auto', or 'full' (100%) */
  w?: number | 'auto' | 'full';
  /** Initial height in pixels, or 'auto', or 'full' (100%) */
  h?: number | 'auto' | 'full';
  /** Initial X position */
  x?: number;
  /** Initial Y position */
  y?: number;
  /** If true, restricts dragging and position to within the viewport */
  boundary?: boolean;
  /** Minimum width in pixels */
  minW?: number;
  /** Minimum height in pixels */
  minH?: number;
  /** Maximum width in pixels, or 'viewport' to constrain to the browser window size */
  maxW?: number | 'viewport';
  /** Maximum height in pixels, or 'viewport' to constrain to the browser window size */
  maxH?: number | 'viewport';
  /** CSS overflow property */
  overflow?: string;
  /** CSS overflow-x property */
  overflowX?: string;
  /** CSS overflow-y property */
  overflowY?: string;
  /** Additional CSS classes */
  className?: string;
  /** Background color (format: 'colorname-intensity/opacity') */
  windowColor?: string;
  /** Border color */
  windowBorderColor?: string;
  /** Border radius */
  windowBorderRadius?: string;
  /** Border width in pixels */
  windowBorder?: number;
  /** Box shadow */
  windowShadow?: string;
  /** Backdrop blur filter */
  windowBackgroundBlur?: string;
  /** Backdrop saturation */
  windowBackgroundSaturation?: string;
  /** Z-index value */
  zIndex?: number;
  /** Child components */
  children?: ReactNode;
}

declare const WindowComponent: React.FC<WindowComponentProps>;

export default WindowComponent;
