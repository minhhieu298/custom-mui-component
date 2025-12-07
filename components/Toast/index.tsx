import {
  Alert,
  AlertColor,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarCloseReason,
  SnackbarOrigin,
  SxProps,
  Theme,
} from "@mui/material";
import Image from "next/image";
import React, { SyntheticEvent } from "react";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

interface DSToastProps {
  message: string;
  open: boolean;
  onClose?: (_: SyntheticEvent | Event, _reason?: SnackbarCloseReason) => void;
  content: React.ReactNode | string;
  severity?: AlertColor;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
  variant?: "standard" | "outlined" | "filled";
}

const iconConfig: Record<AlertColor, React.ReactNode> = {
  success: (
    <Image
      alt="success"
      src="/transfer/assets/icon/toast_success.svg"
      width={16}
      height={16}
    />
  ),
  error: (
    <Image
      alt="error"
      src="/transfer/assets/icon/toast_error.svg"
      width={16}
      height={16}
    />
  ),
  warning: (
    <Image
      alt="warning"
      src="/transfer/assets/icon/toast_warning.svg"
      width={16}
      height={16}
    />
  ),
  info: (
    <Image
      alt="info"
      src="/transfer/assets/icon/toast_info.svg"
      width={16}
      height={16}
    />
  ),
};

const colorConfig: Record<AlertColor, { bg: string; text: string }> = {
  success: {
    bg: "var(--toast-bg-success)",
    text: "var(--toast-label)",
  },
  error: {
    bg: "var(--toast-bg-error)",
    text: "var(--toast-label)",
  },
  warning: {
    bg: "var(--toast-bg-alert)",
    text: "var(--toast-label)",
  },
  info: {
    bg: "var(--toast-bg-info)",
    text: "var(--toast-label)",
  },
};

const DSToast: React.FC<DSToastProps> = ({
  open,
  onClose,
  content,
  severity = "info",
  autoHideDuration = 3000,
  anchorOrigin = { vertical: "top", horizontal: "center" },
}) => {
  const colorConf = colorConfig[severity];

  const customSX: SxProps<Theme> = {
    background: colorConf.bg,
    color: colorConf.text,
    padding: "19.5px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "8px",
    lineHeight: 1.5,
    boxShadow: "none",
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: "inherit",
    ".MuiAlert-message": {
      padding: 0,
      lineHeight: 1.5,
      fontWeight: 500,
      fontFamily: "inherit",
    },
    ".MuiAlert-icon": {
      color: colorConf.text,
      fontSize: 16,
      m: 0,
      opacity: 1,
    },
    ".MuiAlert-action": {
      padding: 0,
    },
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      slots={{
        transition: SlideTransition,
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={customSX}
        icon={iconConfig[severity]}
        slotProps={{
          closeButton: {
            disableRipple: true,
            disableFocusRipple: true,
            disableTouchRipple: true,
          },
        }}
      >
        {content}
      </Alert>
    </Snackbar>
  );
};

export default DSToast;
