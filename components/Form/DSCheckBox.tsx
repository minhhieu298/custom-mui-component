import { Checkbox, CheckboxProps, FormControlLabel, SxProps, Theme } from "@mui/material";
import { forwardRef, ReactNode } from "react";

// Custom icon cho checkbox - ô vuông trống
const UncheckedIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

// Custom icon cho checkbox - ô vuông có dấu tích trắng
const CheckedIcon = ({ size, bgColor, checkColor = "white" }: { size: number; bgColor: string; checkColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="4" fill={bgColor} />
    <path
      d="M7 12L10.5 15.5L17 9"
      stroke={checkColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type CheckboxSize = "small" | "medium" | "large";

interface DSCheckBoxProps extends Omit<CheckboxProps, "size"> {
  size?: CheckboxSize;
  label?: string | ReactNode;
  labelSx?: SxProps<Theme>;
}

const sizeConfig: Record<CheckboxSize, { iconSize: number; fontSize: number, padding: string }> = {
  small: { iconSize: 16, fontSize: 12, padding: "2px" },
  medium: { iconSize: 20, fontSize: 14, padding: "2px" },
  large: { iconSize: 24, fontSize: 16, padding: "4px" },
};

const DSCheckBox = forwardRef<HTMLButtonElement, DSCheckBoxProps>(
  ({ size = "medium", label, sx, disabled, labelSx, ...props }, ref) => {
    const sizeConf = sizeConfig[size];

    // Chọn màu checked icon dựa trên disabled state
    const checkedBgColor = disabled
      ? "var(--checkbox-bg-checked-disable)"
      : "var(--checkbox-bg-checked-default)";
    const checkedCheckColor = disabled
      ? "var(--checkbox-icon-checked-disable)"
      : "white";

    const customSx: SxProps<Theme> = {
      padding: sizeConf.padding,
      color: "var(--checkbox-border-default)",
      "&.Mui-checked": {
        color: "var(--checkbox-bg-checked-default)",
      },
      "&.Mui-disabled": {
        color: "var(--checkbox-border-disable)",
        pointerEvents: "auto",
        cursor: "not-allowed"
      },
      "&.Mui-checked.Mui-disabled": {
        color: "var(--checkbox-icon-checked-disable)",
      },
      "& .MuiSvgIcon-root": {
        fontSize: sizeConf.iconSize,
      },
      ...((sx as object) || {}),
    };

    const checkbox = (
      <Checkbox
        ref={ref}
        sx={customSx}
        disabled={disabled}
        disableRipple
        disableFocusRipple
        disableTouchRipple
        icon={<UncheckedIcon size={sizeConf.iconSize} />}
        checkedIcon={<CheckedIcon size={sizeConf.iconSize} bgColor={checkedBgColor} checkColor={checkedCheckColor} />}
        {...props}
      />
    );

    if (label) {
      return (
        <FormControlLabel
          control={checkbox}
          label={label}
          sx={{
            margin: 0,
            gap: "8px",
            ".MuiFormControlLabel-label": {
              fontWeight: 500,
              fontFamily: "inherit",
              color: "var(--input-field-input-filled)",
              "&.Mui-disabled": {
                color: "var(--input-field-input-disable)",
              },
            },
            ...((labelSx as object) || {}),
          }}
        />
      );
    }

    return checkbox;
  }
);

DSCheckBox.displayName = "DSCheckBox";

export default DSCheckBox;