import React, { forwardRef, ChangeEvent, ReactNode } from "react";
import DSTextInput from "./DSTextField";
import { Box, SxProps, Theme } from "@mui/material";

const ArrowIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="var(--button-icon-button-inactive-default)"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.75596 4.21528C5.89639 4.09491 6.10362 4.09491 6.24405 4.21528L9.74405 7.21528C9.9013 7.35006 9.91951 7.5868 9.78473 7.74405C9.64994 7.90129 9.41321 7.9195 9.25596 7.78472L6.00001 4.9939L2.74405 7.78472C2.58681 7.9195 2.35007 7.90129 2.21529 7.74405C2.0805 7.5868 2.09871 7.35006 2.25596 7.21528L5.75596 4.21528Z"
            fill="currentColor"
        />
    </svg>
);

type DSInputNumberProps = {
    placeholder?: string;
    value?: number | string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    onIncrement?: () => void;
    onDecrement?: () => void;
    name?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string | ReactNode;
    sx?: SxProps<Theme>;
};

/**
 * @description dùng cho form đặt lệnh
 */
const DSInputNumber = forwardRef<HTMLInputElement, DSInputNumberProps>(
    ({ placeholder, value, onChange, onBlur, onIncrement, onDecrement, name, disabled, error, helperText, sx }, ref) => {
        return (
            <DSTextInput
                ref={ref}
                name={name}
                placeholder={placeholder}
                value={value?.toString() ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                error={error}
                helperText={helperText}
                size="medium"
                type="text"
                inputMode="numeric"
                variant="outlined"
                sx={{
                    input: {
                        textAlign: "right",
                    },
                    ".MuiInputAdornment-root": {
                        p: "0 !important",
                        display: "flex",
                        flexDirection: "column",
                        borderLeft: "0.25px solid var(--devider-solid)",
                        position: "relative",
                        borderTopRightRadius: "12px",
                        borderBottomRightRadius: "12px",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            right: 0,
                            height: "0.25px",
                            width: "100%",
                            top: "50%",
                            backgroundColor: "var(--devider-solid)",
                        },
                    },
                    ...((sx as object) || {}),
                }}
                endIcon={
                    <>
                        <Box
                            className="btn-increment"
                            onClick={onIncrement}
                            sx={{
                                p: "4px",
                                display: "flex",
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            <ArrowIcon />
                        </Box>
                        <Box
                            className="btn-decrement"
                            onClick={onDecrement}
                            sx={{
                                p: "4px",
                                display: "flex",
                                cursor: disabled ? "not-allowed" : "pointer",
                                transform: "rotate(180deg)",
                            }}
                        >
                            <ArrowIcon />
                        </Box>
                    </>
                }
            />
        );
    }
);

DSInputNumber.displayName = "DSInputNumber";

export default DSInputNumber;
