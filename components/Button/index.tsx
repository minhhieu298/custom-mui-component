import { forwardRef } from "react";
import { ButtonProps, Button, SxProps, Theme, useTheme, useMediaQuery } from "@mui/material";

/**
 * Thêm kích cỡ của button
 */
type ExtendedButtonSize = ButtonProps["size"] | "xsmall" | "xlarge";

/**
 * Thêm variant của button
 */
type ButtonVariant = "contained" | "text";
type ButtonColor = "primary" | "secondary" | "error";

type ColorConfig = {
  default: { bg?: string; color: string; border?: string };
  hover: { bg?: string; color: string; border?: string };
  disabled: { bg?: string; color: string; border?: string };
};

/**
 * Màu theo design system
 */
const colorConfig: Record<ButtonVariant, Record<ButtonColor, ColorConfig>> = {
  contained: {
    primary: {
      default: {
        bg: "var(--button-bg-default-solid-button)",
        color: "var(--button-text-icon-default-solid-button)",
      },
      hover: {
        bg: "var(--button-bg-hover-solid-button)",
        color: "var(--button-text-icon-hover-solid-button)",
      },
      disabled: {
        bg: "var(--button-bg-disable-solid-button)",
        color: "var(--button-text-icon-disable-solid-button)",
      },
    },
    secondary: {
      default: {
        bg: "var(--button-bg-default-secondary-button)",
        color: "var(--button-text-icon-default-solid-button)",
      },
      hover: {
        bg: "var(--button-bg-hover-secondary-button)",
        color: "var(--button-text-icon-hover-solid-button)",
      },
      disabled: {
        bg: "var(--button-bg-disable-secondary-button)",
        color: "var(--button-text-icon-disable-solid-button)",
      },
    },
    error: {
      default: {
        bg: "var(--button-bg-default-sell-button)",
        color: "var(--button-text-icon-default-solid-button)",
      },
      hover: {
        bg: "var(--button-bg-hover-sell-button)",
        color: "var(--button-text-icon-hover-solid-button)",
      },
      disabled: {
        bg: "var(--button-bg-disable-sell-button)",
        color: "var(--button-text-icon-disable-solid-button)",
      },
    },
  },
  text: {
    primary: {
      default: { color: "var(--button-text-icon-default-text-button)" },
      hover: { color: "var(--button-text-icon-hover-text-button)" },
      disabled: { color: "var(--button-text-icon-disable-text-button)" },
    },
    secondary: {
      default: {
        color: "var(--button-text-icon-default-text-button-secondary)",
      },
      hover: { color: "var(--button-text-icon-hover-text-button-secondary)" },
      disabled: {
        color: "var(--button-text-icon-disable-text-button-secondary)",
      },
    },
    error: {
      default: { color: "var(--button-text-icon-default-text-button-error)" },
      hover: { color: "var(--button-text-icon-hover-text-button-error)" },
      disabled: { color: "var(--button-text-icon-disable-text-button-error)" },
    },
  },
};

/**
 * Padding theo size
 */
type SizeConfig = {
  py: number;
  pxDefault: number;
  pxWithIcon: number;
  iconSize: number;
};

type ResponsiveSize<T> = {
  xl?: T;
  lg?: T;
  md?: T;
  sm?: T;
  xs?: T;
};

const sizeConfig: Record<NonNullable<ExtendedButtonSize>, SizeConfig> = {
  xlarge: { py: 12, pxDefault: 24, pxWithIcon: 16, iconSize: 24 },
  large: { py: 9.5, pxDefault: 24, pxWithIcon: 16, iconSize: 20 },
  medium: { py: 7.5, pxDefault: 16, pxWithIcon: 12, iconSize: 16 },
  small: { py: 7, pxDefault: 16, pxWithIcon: 12, iconSize: 16 },
  xsmall: { py: 5, pxDefault: 12, pxWithIcon: 8, iconSize: 12 },
};

interface DSButtonProps
  extends Omit<ButtonProps, "size" | "variant" | "color"> {
  size?: ExtendedButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  /** Responsive size theo breakpoints */
  responsiveSize?: ResponsiveSize<ExtendedButtonSize>;
}

const DSButton = forwardRef<HTMLButtonElement, DSButtonProps>(
  (
    {
      size = "medium",
      variant = "contained",
      color = "primary",
      disabled,
      sx,
      startIcon,
      endIcon,
      children,
      responsiveSize,
      ...rest
    },
    ref
  ) => {
    // Ưu tiên value từ props (controlled), fallback về internal state
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.up("xs"));
    const isSm = useMediaQuery(theme.breakpoints.up("sm"));
    const isMd = useMediaQuery(theme.breakpoints.up("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));
    const isXl = useMediaQuery(theme.breakpoints.up("xl"));

    // Tính size dựa trên breakpoints
    const computedSize: ExtendedButtonSize = responsiveSize
      ? (isXl && responsiveSize.xl) ||
      (isLg && responsiveSize.lg) ||
      (isMd && responsiveSize.md) ||
      (isSm && responsiveSize.sm) ||
      (isXs && responsiveSize.xs) ||
      size
      : size;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { color: _color, ...props } = rest as ButtonProps & {
      color?: ButtonColor;
    };
    const sizeConf = sizeConfig[computedSize];
    const colors = colorConfig[variant][color];

    /**
     * Tính padding dựa trên có icon hay không
     * Variant text không có padding
     */
    const isTextVariant = variant === "text";
    const paddingLeft = isTextVariant
      ? 0
      : startIcon
        ? sizeConf.pxWithIcon
        : sizeConf.pxDefault;
    const paddingRight = isTextVariant
      ? 0
      : endIcon
        ? sizeConf.pxWithIcon
        : sizeConf.pxDefault;
    const paddingY = isTextVariant ? 0 : sizeConf.py;

    const customSx: SxProps<Theme> = {
      textTransform: "none",
      boxShadow: "none",
      paddingTop: `${paddingY}px`,
      paddingBottom: `${paddingY}px`,
      paddingLeft: `${paddingLeft}px`,
      paddingRight: `${paddingRight}px`,
      minWidth: isTextVariant ? "auto" : undefined,
      lineHeight: 1.5,
      font: "inherit",
      // Colors
      backgroundColor: colors.default.bg,
      color: colors.default.color,
      border: colors.default.border || "none",
      "&:hover": {
        backgroundColor: colors.hover.bg,
        color: colors.hover.color,
        border: colors.hover.border || "none",
        boxShadow: "none",
      },
      "&.Mui-disabled": {
        backgroundColor: colors.disabled.bg,
        color: colors.disabled.color,
        border: colors.disabled.border || "none",
        cursor: "not-allowed",
        pointerEvents: "auto",
      },
      // Loading state - giữ background như default, chỉ ẩn text
      "&.MuiButton-loading": {
        color: "transparent",
        backgroundColor: colors.default.bg,
        "&.Mui-disabled": {
          backgroundColor: colors.default.bg,
          color: "transparent",
        },
      },
      ".MuiButton-loadingIndicator": {
        color: "#FFFFFF",
        ".MuiCircularProgress-root": {
          width: `${sizeConf.iconSize}px !important`,
          height: `${sizeConf.iconSize}px !important`,
        },
      },
      ...((sx as object) || {}),
    };

    return (
      <Button
        ref={ref}
        disabled={disabled}
        startIcon={startIcon}
        endIcon={endIcon}
        sx={customSx}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

DSButton.displayName = "DSButton";

export default DSButton;
