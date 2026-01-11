import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  SxProps,
  TextField,
  Theme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React from "react";

/**
 * Mở rộng size của AutoComplete
 */
type ExtendedInputSize = "small" | "medium" | "large";

type SizeConfig = {
  py: string;
  px: string;
  fontSize: number;
  borderRadius: string;
};

type OptionData = {
  label: string;
  id: string;
};

const sizeConfig: Record<ExtendedInputSize, SizeConfig> = {
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

interface DSAutoCompleteProps<
  T extends OptionData,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
> extends Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  "size" | "renderInput"
> {
  size?: ExtendedInputSize;
  placeholder?: string;
  /** Responsive size theo breakpoints */
  responsiveSize?: ResponsiveSize<ExtendedInputSize>;
  /** Custom renderInput, nếu không truyền sẽ dùng default TextField */
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  /** Error state */
  error?: boolean;
  /** Helper text */
  helperText?: string;
}

function DSAutoComplete<
  T extends OptionData,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
>({
  size = "medium",
  sx,
  placeholder,
  responsiveSize,
  renderInput,
  error,
  helperText,
  ...props
}: DSAutoCompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
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
    ".MuiInputBase-root": {
      borderRadius: sizeConf.borderRadius,
      background: "var(--input-field-bg-default)",
      padding: `${sizeConf.py} ${sizeConf.px} !important`,
      fontSize: sizeConf.fontSize,
      lineHeight: 1.5,
      color: "var(--input-field-label-default)",
      fontFamily: "inherit",
      fontWeight: 500,
      ".MuiInputBase-input": {
        padding: "0 !important",
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
    },
    ".MuiAutocomplete-endAdornment": {
      ".MuiSvgIcon-root": {
        fontSize: 16,
        color: "var(--button-icon-button-inactive-default)",
      },
    },
    ...((sx as object) || {}),
  };

  const paperSx: SxProps<Theme> = {
    boxShadow: "0 4px 16px 0 var(--shadow)",
    backgroundImage: "none",
    backgroundColor: "var(--dropdown-bg-default)",
    color: "var(--dropdown-text-title)",
    border: "1px solid var(--devider-solid)",
    ".MuiAutocomplete-listbox": {
      padding: 0,
      ".MuiAutocomplete-option": {
        padding: "12px",
        fontSize: sizeConf.fontSize,
        lineHeight: 1.5,
        fontWeight: 500,
        fontFamily: "inherit",
        "&:hover": {
          background: "var(--dropdown-bg-hover)",
        },
        "&[aria-selected='true']": {
          background: "var(--dropdown-bg-filter)",
          "&:hover": {
            background: "var(--dropdown-bg-hover)",
          },
        },
        ".option-item": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        },
      },
    },
  };

  const defaultRenderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      sx={{
        ".MuiFormHelperText-root": {
          marginLeft: 0,
          marginTop: "4px",
          fontSize: "12px",
        },
      }}
    />
  );

  return (
    <Autocomplete
      sx={customSx}
      disablePortal
      slotProps={{
        paper: {
          sx: paperSx,
        },
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      renderOption={(optionProps, option, state) => {
        const { key, ...rest } = optionProps;
        return (
          <li key={key} {...rest}>
            <div className="option-item">
              <span>{option.label}</span>
              {state.selected && (
                <Image
                  src="/assets/image/tick_success.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              )}
            </div>
          </li>
        );
      }}
      renderInput={renderInput || defaultRenderInput}
      {...props}
    />
  );
}

export default DSAutoComplete;
// export type { DSAutoCompleteProps, OptionData };
