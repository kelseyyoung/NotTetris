/**
 * Screen size utilities and responsive layout configuration
 *
 * This module defines three target screen sizes:
 * - Desktop: Landscape mode
 * - Tablet: Both landscape and portrait modes
 * - Mobile: Portrait mode
 */

import { GRID_PADDING, TILE_SIZE } from "../objects/Grid";

// ============================================================================
// SCREEN SIZE BREAKPOINTS
// ============================================================================

/**
 * Viewport width breakpoints for different device types
 */
export const SCREEN_BREAKPOINTS = {
  MOBILE_MAX: 480, // Mobile: 0 - 480px
  TABLET_MAX: 1024, // Tablet: 481 - 1024px
  // Desktop: 1025px+
} as const;

/**
 * Device type based on viewport width
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Orientation of the device
 */
export type Orientation = "portrait" | "landscape";

// ============================================================================
// DEVICE DETECTION
// ============================================================================

/**
 * Determine device type based on viewport width
 */
export function getDeviceType(viewportWidth: number): DeviceType {
  if (viewportWidth <= SCREEN_BREAKPOINTS.MOBILE_MAX) {
    return "mobile";
  } else if (viewportWidth <= SCREEN_BREAKPOINTS.TABLET_MAX) {
    return "tablet";
  } else {
    return "desktop";
  }
}

/**
 * Determine orientation based on viewport dimensions
 */
export function getOrientation(
  viewportWidth: number,
  viewportHeight: number
): Orientation {
  return viewportWidth > viewportHeight ? "landscape" : "portrait";
}

// ============================================================================
// DEVICE-SPECIFIC CONFIGURATION
// ============================================================================

/**
 * Configuration for UI sizing based on device type
 */
type DeviceConfig = {
  buttonSize: "small" | "medium" | "large";
  controlSpacing: {
    inner: number;
    outer: number;
  };
  headerHeight: number;
  controlsHeight: number;
};

/**
 * Get device-specific configuration
 *
 * Mobile:
 * - Large buttons for better touch targets
 * - More spacing between controls
 * - Portrait mode optimized
 *
 * Tablet:
 * - Large buttons for touch-friendly interface
 * - Moderate spacing
 * - Optimized for both portrait and landscape
 *
 * Desktop:
 * - Medium buttons
 * - Standard spacing
 * - Landscape mode optimized
 */
export function getDeviceConfig(
  deviceType: DeviceType,
  orientation: Orientation
): DeviceConfig {
  switch (deviceType) {
    case "mobile":
      return {
        buttonSize: "large",
        controlSpacing: {
          inner: 1.5,
          outer: 4,
        },
        headerHeight: 48,
        controlsHeight: 320,
      };

    case "tablet":
      return {
        buttonSize: "large",
        controlSpacing: {
          inner: 1,
          outer: 3,
        },
        headerHeight: orientation === "portrait" ? 50 : 58,
        controlsHeight: orientation === "portrait" ? 300 : 260,
      };

    case "desktop":
      return {
        buttonSize: "medium",
        controlSpacing: {
          inner: 1,
          outer: 3,
        },
        headerHeight: 58,
        controlsHeight: 260,
      };
  }
}

// ============================================================================
// LAYOUT CALCULATIONS
// ============================================================================

/**
 * Configuration for responsive layout calculation
 */
type LayoutConfig = {
  dynamicTileSize: number;
  dynamicPadding: number;
  gridSize: number;
  buttonSize: "small" | "medium" | "large";
  controlSpacing: {
    inner: number;
    outer: number;
  };
  useVerticalControlLayout: boolean;
};

/**
 * Determine if controls should be stacked vertically
 *
 * Mobile (portrait): Vertical if viewport is tall enough (>= 800px)
 * Tablet: Always horizontal (both portrait and landscape)
 * Desktop (landscape): Horizontal
 */
function shouldUseVerticalControls(
  deviceType: DeviceType,
  orientation: Orientation,
  viewportHeight: number
): boolean {
  // Tablets always use horizontal layout
  if (deviceType === "tablet") {
    return false;
  }

  // Desktop always uses horizontal layout (always landscape)
  if (deviceType === "desktop") {
    return false;
  }

  // Mobile: Only stack vertically in portrait mode with tall enough viewport
  if (deviceType === "mobile" && orientation === "portrait") {
    return viewportHeight >= 800;
  }

  return false;
}

/**
 * Calculate responsive layout configuration
 *
 * This function:
 * 1. Determines device type and orientation
 * 2. Gets device-specific configuration
 * 3. Calculates available space for the grid
 * 4. Determines optimal tile size while maintaining aspect ratio
 * 5. Returns all layout parameters needed for rendering
 */
export function calculateResponsiveLayout(
  viewportWidth: number,
  viewportHeight: number
): LayoutConfig {
  const MIN_SIDE_PADDING = 16; // Minimum padding on left/right sides
  const VERTICAL_SPACING = 16; // Gap between grid and controls

  // Determine device type and orientation
  const deviceType = getDeviceType(viewportWidth);
  const orientation = getOrientation(viewportWidth, viewportHeight);

  // Get device-specific configuration
  const config = getDeviceConfig(deviceType, orientation);

  // Calculate available space
  const availableWidth = viewportWidth - MIN_SIDE_PADDING * 2;
  const availableHeight =
    viewportHeight -
    config.headerHeight -
    config.controlsHeight -
    VERTICAL_SPACING;

  // Determine target grid size based on orientation
  let targetGridSize: number;

  if (orientation === "landscape") {
    // Desktop (landscape) or Tablet (landscape):
    // Size based on available height (smaller dimension)
    // Cap at 50% of width to ensure it fits
    targetGridSize = Math.min(availableHeight, viewportWidth * 0.5);
  } else {
    // Mobile (portrait) or Tablet (portrait):
    // Size based on available width (smaller dimension)
    // Cap at 50% of height to ensure it fits
    targetGridSize = Math.min(availableWidth, viewportHeight * 0.5);
  }

  // Calculate tile size (8 tiles + 2 * padding)
  const calculatedTileSize = (targetGridSize - GRID_PADDING * 2) / 8;

  // Calculate proportional padding
  const scale = calculatedTileSize / TILE_SIZE;
  const finalPadding = GRID_PADDING * scale;

  // Calculate actual grid size
  const actualGridSize = calculatedTileSize * 8 + finalPadding * 2;

  // Determine control layout
  const useVerticalControlLayout = shouldUseVerticalControls(
    deviceType,
    orientation,
    viewportHeight
  );

  return {
    dynamicTileSize: calculatedTileSize,
    dynamicPadding: finalPadding,
    gridSize: actualGridSize,
    buttonSize: config.buttonSize,
    controlSpacing: config.controlSpacing,
    useVerticalControlLayout,
  };
}
