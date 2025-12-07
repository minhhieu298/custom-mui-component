import {
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  SxProps,
  Theme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { forwardRef, useState } from "react";
import DSBadge from "../Badge";

/**
 * Mở rộng size của TextField
 */
type ExtendedInputSize = SelectProps["size"] | "large";

type SizeConfig = {
  py: string;
  px: string;
  fontSize: number;
  borderRadius: string;
};

type OptionData = {
  label: string;
  id: string;
  bagde?: { label: string; active: boolean };
};

const sizeConfig: Record<NonNullable<ExtendedInputSize>, SizeConfig> = {
  large: { py: "13.5px", px: "16px", fontSize: 14, borderRadius: "12px" },
  medium: { py: "9.5px", px: "16px", fontSize: 14, borderRadius: "12px" },
  small: { py: "5.5px", px: "12px", fontSize: 14, borderRadius: "8px" },
};

type ResponsiveSize<T> = {
  xl?: T;
  lg?: T;
  md?: T;
  sm?: T;
  xs?: T;
};

interface DSSelectProps extends Omit<SelectProps, "size"> {
  size?: ExtendedInputSize;
  placeholder?: string;
  options: OptionData[];
  /** Responsive size theo breakpoints */
  responsiveSize?: ResponsiveSize<ExtendedInputSize>;
}

const DSSelect = forwardRef<HTMLDivElement, DSSelectProps>(
  (
    {
      size = "medium",
      sx,
      placeholder,
      MenuProps,
      options,
      value,
      onChange,
      responsiveSize,
      ...props
    },
    ref
  ) => {
    // Internal state chỉ dùng khi không có value từ bên ngoài (uncontrolled)
    const [internalValue, setInternalValue] = useState("");

    // Ưu tiên value từ props (controlled), fallback về internal state
    const selectedValue = value !== undefined ? value : internalValue;
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.up("xs"));
    const isSm = useMediaQuery(theme.breakpoints.up("sm"));
    const isMd = useMediaQuery(theme.breakpoints.up("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));
    const isXl = useMediaQuery(theme.breakpoints.up("xl"));

    // Tính size dựa trên breakpoints
    const computedSize: ExtendedInputSize = responsiveSize
      ? (isXl && responsiveSize.xl) ||
      (isLg && responsiveSize.lg) ||
      (isMd && responsiveSize.md) ||
      (isSm && responsiveSize.sm) ||
      (isXs && responsiveSize.xs) ||
      size
      : size;
    const sizeConf = sizeConfig[computedSize];

    const customSx: SxProps<Theme> = {
      borderRadius: sizeConf.borderRadius,
      background: "var(--input-field-bg-default)",
      ".MuiSelect-select": {
        padding: `${sizeConf.py} ${sizeConf.px}`,
        fontSize: sizeConf.fontSize,
        lineHeight: 1.5,
        color: "var(--input-field-label-default)",
        "&.Mui-disabled": {
          pointerEvents: "auto",
          cursor: "not-allowed",
          ".label-placeholder": {
            color: "var(--input-field-label-disable)",
          },
        },
        ".label-placeholder": {
          color: "var(--input-field-placeholder-shade)",
        },
        ".label-selected": {
          display: "flex",
          alignItems: "center",
          gap: "8px",
        },
      },
      fieldset: {
        borderColor: "transparent",
      },
      "&:hover": {
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--input-field-bolder-hover)",
        },
      },
      "&.Mui-focused": {
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--input-field-bolder-hover)",
          borderWidth: 1,
        },
      },
      "&.Mui-disabled": {
        pointerEvents: "auto",
        cursor: "not-allowed",
        background: "var(--input-field-bg-disable)",
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
      },
      ".MuiSvgIcon-root": {
        fontSize: 16,
        color: "var(--button-icon-button-inactive-default)",
        "&.Mui-disabled": {
          color: "var(--button-icon-button-inactive-disable)",
        },
      },
      ...((sx as object) || {}),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mergeProps: any = {
      ...MenuProps,
      PaperProps: {
        ...MenuProps?.PaperProps,
        sx: (theme: Theme) => {
          const oldSx = MenuProps?.PaperProps?.sx;
          const resolvedOld =
            typeof oldSx === "function" ? oldSx(theme) : oldSx || {};

          return {
            boxShadow: "0 4px 16px 0 var(--shadow)",
            backgroundImage: "none",
            backgroundColor: "var(--dropdown-bg-default)",
            color: "var(--dropdown-text-title)",
            border: "1px solid var(--devider-solid)",
            ...resolvedOld,
          };
        },
      },
    };

    const handleChange = (
      event: SelectChangeEvent<unknown>,
      child: React.ReactNode
    ) => {
      // Nếu có onChange từ props (controlled mode), gọi nó
      if (onChange) {
        onChange(event, child);
      }
      // Cập nhật internal state cho uncontrolled mode
      setInternalValue(event.target.value as string);
    };
    return (
      <Select
        ref={ref}
        size={size as SelectProps["size"]}
        sx={customSx}
        displayEmpty
        MenuProps={{
          disableScrollLock: true,
          disableAutoFocus: true,
          disableAutoFocusItem: true,
          MenuListProps: {
            sx: {
              py: 0,
              ".MuiMenuItem-root": {
                padding: "12px",
                fontSize: sizeConf.fontSize,
                lineHeight: 1.5,
                fontWeight: 500,
                fontFamily: "inherit",
                ":hover": {
                  background: "var(--dropdown-bg-hover)",
                },
                "&.Mui-selected": {
                  background: "var(--dropdown-bg-filter)",
                  "&:hover": {
                    background: "var(--dropdown-bg-hover)",
                  },
                },
                ".item-dropdown": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  ".item-label": {
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  },
                },
              },
            },
          },
          ...mergeProps,
        }}
        renderValue={(selected) => {
          if (selected === undefined || selected === null || selected === "") {
            return <div className="label-placeholder">{placeholder}</div>;
          }
          const item = options.find((e) => e.id === selected);
          if (!item) return null;
          return (
            <div className="label-selected">
              <div>{item.label}</div>
              {item?.bagde && (
                <DSBadge
                  color={item?.bagde?.active ? "success" : "info"}
                  variant="square"
                  size="small"
                >
                  {item.bagde.label}
                </DSBadge>
              )}
            </div>
          );
        }}
        value={selectedValue}
        onChange={handleChange}
        {...props}
      >
        {options.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
            disableRipple
            disableTouchRipple
          >
            <div className="item-dropdown">
              <div className="item-label">
                <div>{item.label}</div>
                {item?.bagde && (
                  <DSBadge
                    color={item?.bagde?.active ? "success" : "info"}
                    variant="square"
                    size="small"
                  >
                    {item.bagde.label}
                  </DSBadge>
                )}
              </div>
              {selectedValue === item.id && (
                <Image
                  src="/assets/image/tick_success.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              )}
            </div>
          </MenuItem>
        ))}
      </Select>
    );
  }
);

DSSelect.displayName = "DSSelect";

export default DSSelect;
