import { FormControlLabel, Radio, RadioProps, styled, SxProps, Theme } from "@mui/material";
import { forwardRef, ReactNode } from "react";

type RadioSize = "small" | "medium" | "large";

interface DSRadioProps extends Omit<RadioProps, "size"> {
    size?: RadioSize;
    label?: string | ReactNode;
    labelSx?: SxProps<Theme>;
}

const sizeConfig: Record<RadioSize, { iconSize: number; fontSize: number; padding: string }> = {
    small: { iconSize: 16, fontSize: 12, padding: "2px" },
    medium: { iconSize: 20, fontSize: 14, padding: "2px" },
    large: { iconSize: 24, fontSize: 16, padding: "4px" },
};

export const CircleIcon = styled("span")(() => ({
    width: 16,
    height: 16,
    borderRadius: "50%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--radio-border-default)",
    display: "inline-block",
    backgroundColor: "var(--radio-bg-uncheck-default)",
    ".Mui-disabled &": {
        backgroundColor: "var(--radio-bg-uncheck-disable)",
        borderColor: "var(--radio-border-disable)",
    },
}));

export const CircleCheckedIcon = styled(CircleIcon)(() => ({
    backgroundColor: "var(--radio-border-active)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&::after": {
        content: '""',
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--radio-bg-checked-default)",
    },
    ".Mui-disabled &": {
        backgroundColor: "var(--radio-border-disable)",
        borderColor: "var(--radio-bg-checked-disable)",
        "&::after": {
            backgroundColor: "var(--radio-bg-checked-disable)",
        },
    },
}));

const DSRadio = forwardRef<HTMLButtonElement, DSRadioProps>(
    ({ size = "medium", label, sx, labelSx, disabled, ...props }, ref) => {
        const sizeConf = sizeConfig[size];

        const customSx: SxProps<Theme> = {
            padding: sizeConf.padding,
            "&.Mui-disabled": {
                pointerEvents: "auto",
                cursor: "not-allowed"
            },
            ...((sx as object) || {}),
        };

        const radio = (
            <Radio
                ref={ref}
                sx={customSx}
                disabled={disabled}
                disableRipple
                disableFocusRipple
                disableTouchRipple
                icon={<CircleIcon />}
                checkedIcon={<CircleCheckedIcon />}
                {...props}
            />
        );

        if (label) {
            return (
                <FormControlLabel
                    control={radio}
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

        return radio;
    }
);

DSRadio.displayName = "DSRadio";

export default DSRadio;