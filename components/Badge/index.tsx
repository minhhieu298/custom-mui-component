import React from "react";

type BadgeSize = "small" | "medium" | "large" | "xlarge";
type BadgeVariant = "square" | "rounded";
type BadgeColor =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "purple"
  | "blue"
  | "yellow";

interface DSBadgeProps {
  children: React.ReactNode;
  size: BadgeSize;
  color: BadgeColor;
  variant: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

type SizeConfig = {
  py: string;
  pxDefault: string;
  pxWithIcon: string;
  fontSize: number;
  gap: string;
};

const sizeConfig: Record<BadgeSize, SizeConfig> = {
  small: {
    py: "1px",
    pxDefault: "8px",
    pxWithIcon: "4px",
    fontSize: 12,
    gap: "4px",
  },
  medium: {
    py: "3px",
    pxDefault: "8px",
    pxWithIcon: "4px",
    fontSize: 12,
    gap: "4px",
  },
  large: {
    py: "3.5px",
    pxDefault: "12px",
    pxWithIcon: "8px",
    fontSize: 12,
    gap: "8px",
  },
  xlarge: {
    py: "4px",
    pxDefault: "16px",
    pxWithIcon: "8px",
    fontSize: 12,
    gap: "8px",
  },
};

const colorConfig: Record<BadgeColor, { bg: string; text: string }> = {
  success: {
    bg: "var(--badge-bg-label-primary)",
    text: "var(--badge-label-primary)",
  },
  info: {
    bg: "var(--badge-bg-label-secondary)",
    text: "var(--badge-label-secondary)",
  },
  warning: {
    bg: "var(--badge-bg-label-orange)",
    text: "var(--badge-label-orange)",
  },
  error: {
    bg: "var(--badge-bg-label-red)",
    text: "var(--badge-label-red)",
  },
  purple: {
    bg: "var(--badge-bg-label-purple)",
    text: "var(--badge-label-purple)",
  },
  blue: {
    bg: "var(--badge-bg-label-blue)",
    text: "var(--badge-label-blue)",
  },
  yellow: {
    bg: "var(--badge-bg-label-yellow)",
    text: "var(--badge-label-yellow)",
  },
};

const DSBadge: React.FC<DSBadgeProps> = ({
  children,
  size = "medium",
  color,
  variant,
  icon,
  className,
}) => {
  const sizeConf = sizeConfig[size];
  const colorConf = colorConfig[color];
  const paddingRight = icon ? sizeConf.pxWithIcon : sizeConf.pxDefault;
  const borderRadius = variant === "rounded" ? "9999px" : "4px";

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeConf.gap,
        fontSize: sizeConf.fontSize,
        fontWeight: 500,
        lineHeight: 1.5,
        fontFamily: "inherit",
        backgroundColor: colorConf.bg,
        color: colorConf.text,
        whiteSpace: "nowrap",
        padding: `${sizeConf.py} ${paddingRight} ${sizeConf.py} ${sizeConf.pxDefault}`,
        borderRadius: borderRadius,
      }}
    >
      {children}
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
    </span>
  );
};

export default DSBadge;
