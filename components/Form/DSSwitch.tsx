import { FormControlLabel, Switch, SwitchProps, SxProps, Theme } from "@mui/material";
import { forwardRef } from "react";

// Icon tích cho thumb khi checked
const CheckIcon = ({ size, color = "var(--switch-bg-checked-default)" }: { size: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
            d="M5 12L10 17L19 8"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

type SwitchSize = "small" | "medium" | "large";

interface DSSwitchProps extends Omit<SwitchProps, "size"> {
    size?: SwitchSize;
    label?: string;
}

const sizeConfig: Record<SwitchSize, {
    width: number;
    height: number;
    thumbSize: number;
    fontSize: number;
}> = {
    small: { width: 28, height: 16, thumbSize: 12, fontSize: 12 },
    medium: { width: 40, height: 22, thumbSize: 18, fontSize: 14 },
    large: { width: 32, height: 20, thumbSize: 16, fontSize: 16 },
};

const DSSwitch = forwardRef<HTMLButtonElement, DSSwitchProps>(
    ({ size = "medium", label, sx, disabled, ...props }, ref) => {
        const sizeConf = sizeConfig[size];

        const customSx: SxProps<Theme> = {
            width: sizeConf.width,
            height: sizeConf.height,
            padding: 0,
            "& .MuiSwitch-switchBase": {
                padding: 0,
                transform: "translate(3px, 2px)",
                "&.Mui-checked": {
                    transform: `translate(${sizeConf.width - sizeConf.height + 1}px, 2px)`,
                    "& + .MuiSwitch-track": {
                        backgroundColor: "var(--switch-bg-checked-default)",
                        opacity: 1,
                    },
                    "& .MuiSwitch-thumb": {
                        backgroundColor: "var(--switch-thumb-default)",
                    },
                },
                "&.Mui-disabled": {
                    pointerEvents: "auto",
                    cursor: "not-allowed",
                    "& .MuiSwitch-thumb": {
                        backgroundColor: "var(--switch-thumb-disable)",
                    },
                    "& + .MuiSwitch-track": {
                        opacity: 1,
                        backgroundColor: "var(--switch-bg-uncheck-disable)",
                    },
                },
                "&.Mui-checked.Mui-disabled": {
                    "& + .MuiSwitch-track": {
                        backgroundColor: "var(--switch-bg-checked-disable)",
                    },
                },
                "&:hover": {
                    background: "unset"
                }
            },
            "& .MuiSwitch-thumb": {
                width: sizeConf.thumbSize,
                height: sizeConf.thumbSize,
                backgroundColor: "var(--switch-thumb-default)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            },
            "& .MuiSwitch-track": {
                borderRadius: sizeConf.height / 2,
                backgroundColor: "var(--switch-bg-uncheck-default)",
                opacity: 1,
            },
            ...((sx as object) || {}),
        };

        // Màu icon và thumb khi checked
        const checkIconColor = disabled
            ? "var(--switch-bg-checked-disable)"
            : "var(--switch-bg-checked-default)";
        const thumbBgColor = disabled
            ? "var(--switch-thumb-disable)"
            : "var(--switch-thumb-default)";

        // Thumb với icon tích
        const thumbWithCheck = (
            <span style={{
                width: sizeConf.thumbSize,
                height: sizeConf.thumbSize,
                borderRadius: "50%",
                backgroundColor: thumbBgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <CheckIcon size={sizeConf.thumbSize - 4} color={checkIconColor} />
            </span>
        );

        // Thumb không có icon
        const thumbWithoutCheck = (
            <span style={{
                width: sizeConf.thumbSize,
                height: sizeConf.thumbSize,
                borderRadius: "50%",
                backgroundColor: thumbBgColor,
            }} />
        );

        const switchElement = (
            <Switch
                ref={ref}
                sx={customSx}
                disabled={disabled}
                disableRipple
                icon={thumbWithoutCheck}
                checkedIcon={thumbWithCheck}
                {...props}
            />
        );

        if (label) {
            return (
                <FormControlLabel
                    control={switchElement}
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
                    }}
                />
            );
        }

        return switchElement;
    }
);

DSSwitch.displayName = "DSSwitch";

export default DSSwitch;