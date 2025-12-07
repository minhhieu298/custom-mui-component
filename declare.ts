import { ChangeEvent, ReactNode } from "react";
import { ButtonProps, TextFieldProps, SelectProps, CheckboxProps, SwitchProps, RadioProps, SxProps, Theme, SnackbarCloseReason, SnackbarOrigin, AlertColor } from "@mui/material";

// ============== DSButton ==============
type ExtendedButtonSize = ButtonProps["size"] | "xsmall" | "xlarge";
type ButtonVariant = "contained" | "text";
type ButtonColor = "primary" | "secondary" | "error";

type ResponsiveSize<T> = {
    xl?: T;
    lg?: T;
    md?: T;
    sm?: T;
    xs?: T;
};

interface DSButtonProps extends Omit<ButtonProps, "size" | "variant" | "color"> {
    size?: ExtendedButtonSize;
    variant?: ButtonVariant;
    color?: ButtonColor;
    responsiveSize?: ResponsiveSize<ExtendedButtonSize>;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

export declare const DSButton: React.ForwardRefExoticComponent<DSButtonProps & React.RefAttributes<HTMLButtonElement>>;

// ============== DSBadge ==============
type BadgeSize = "small" | "medium" | "large" | "xlarge";
type BadgeVariant = "square" | "rounded";
type BadgeColor = "success" | "info" | "warning" | "error" | "purple" | "blue" | "yellow";

interface DSBadgeProps {
    children: ReactNode;
    size: BadgeSize;
    color: BadgeColor;
    variant: BadgeVariant;
    icon?: ReactNode;
    className?: string;
}

export declare const DSBadge: React.FC<DSBadgeProps>;

// ============== DSToast ==============
interface DSToastProps {
    message: string;
    open: boolean;
    onClose?: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
    content: ReactNode | string;
    severity?: AlertColor;
    autoHideDuration?: number;
    anchorOrigin?: SnackbarOrigin;
    variant?: "standard" | "outlined" | "filled";
}

export declare const DSToast: React.FC<DSToastProps>;

// ============== DSTextInput ==============
type ExtendedInputSize = NonNullable<TextFieldProps["size"]> | "large" | "xlarge";

interface DSTextInputProps extends Omit<TextFieldProps, "size"> {
    size?: ExtendedInputSize;
    responsiveSize?: ResponsiveSize<ExtendedInputSize>;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

export declare const DSTextInput: React.ForwardRefExoticComponent<DSTextInputProps & React.RefAttributes<HTMLInputElement>>;

// ============== DSSelect ==============
type ExtendedSelectSize = SelectProps["size"] | "large";

type OptionData = {
    label: string;
    id: string;
    bagde?: { label: string; active: boolean };
};

interface DSSelectProps extends Omit<SelectProps, "size"> {
    size?: ExtendedSelectSize;
    placeholder?: string;
    options: OptionData[];
    responsiveSize?: ResponsiveSize<ExtendedSelectSize>;
}

export declare const DSSelect: React.ForwardRefExoticComponent<DSSelectProps & React.RefAttributes<HTMLSelectElement>>;

// ============== DSCheckBox ==============
type CheckboxSize = "small" | "medium" | "large";

interface DSCheckBoxProps extends Omit<CheckboxProps, "size"> {
    size?: CheckboxSize;
    label?: string | ReactNode;
    labelSx?: SxProps<Theme>;
}

export declare const DSCheckBox: React.ForwardRefExoticComponent<DSCheckBoxProps & React.RefAttributes<HTMLButtonElement>>;

// ============== DSSwitch ==============
type SwitchSize = "small" | "medium" | "large";

interface DSSwitchProps extends Omit<SwitchProps, "size"> {
    size?: SwitchSize;
    label?: string;
}

export declare const DSSwitch: React.ForwardRefExoticComponent<DSSwitchProps & React.RefAttributes<HTMLButtonElement>>;

// ============== DSRadio ==============
type RadioSize = "small" | "medium" | "large";

interface DSRadioProps extends Omit<RadioProps, "size"> {
    size?: RadioSize;
    label?: string | ReactNode;
    labelSx?: SxProps<Theme>;
}

export declare const DSRadio: React.ForwardRefExoticComponent<DSRadioProps & React.RefAttributes<HTMLButtonElement>>;

// ============== DSInputNumber ==============
interface DSInputNumberProps {
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
}

export declare const DSInputNumber: React.ForwardRefExoticComponent<DSInputNumberProps & React.RefAttributes<HTMLInputElement>>;
