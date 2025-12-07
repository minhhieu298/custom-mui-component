import { forwardRef } from "react";
import { TextFieldProps, TextField, SxProps, Theme, useTheme, useMediaQuery } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

/**
 * Mở rộng size của TextField
 */
type ExtendedInputSize =
	| NonNullable<TextFieldProps["size"]>
	| "large"
	| "xlarge";

type IconPaddingConfig = {
	padding: string;
	paddingLeft: string;
	paddingRight: string;
};

type FilledConfig = {
	pyTop: number;
	pyBottom: number;
	// Label position
	labelTransform: string;
	labelTransformShrink: string;
	labelTransformWithIcon: string;
	labelTransformShrinkWithIcon: string;
	paddingIcon: IconPaddingConfig;
};

type OutlinedConfig = {
	pyTop: number;
	pyBottom: number;
};

type SizeConfig = {
	filled: FilledConfig;
	outlined: OutlinedConfig;
	pxDefault: number;
	pxWithIcon: number;
	fontSize: string;
	labelSize?: string;
	labelScaleSize?: string;
	iconSize: number;
	borderRadius: number;
};

const sizeConfig: Record<NonNullable<ExtendedInputSize>, SizeConfig> = {
	xlarge: {
		filled: {
			pyTop: 28,
			pyBottom: 4,
			labelTransform: "translate(16px, 16px)",
			labelTransformShrink: "translate(16px, 10px)",
			labelTransformWithIcon: "translate(56px, 16px)",
			labelTransformShrinkWithIcon: "translate(56px, 10px)",
			paddingIcon: {
				padding: "16px",
				paddingLeft: "0px",
				paddingRight: "0px",
			},
		},
		outlined: { pyTop: 16, pyBottom: 16 },
		pxDefault: 16,
		pxWithIcon: 16,
		fontSize: "16px",
		labelSize: "16px",
		labelScaleSize: "12px",
		iconSize: 24,
		borderRadius: 12,
	},
	large: {
		filled: {
			pyTop: 22,
			pyBottom: 5,
			labelTransform: "translate(16px, 14px)",
			labelTransformShrink: "translate(16px, 5px)",
			labelTransformWithIcon: "translate(49px, 14px)",
			labelTransformShrinkWithIcon: "translate(49px, 5px)",
			paddingIcon: {
				padding: "12px",
				paddingLeft: "0px",
				paddingRight: "0px",
			},
		},
		outlined: { pyTop: 13.5, pyBottom: 13.5 },
		pxDefault: 16,
		pxWithIcon: 12,
		fontSize: "14px",
		labelSize: "14px",
		labelScaleSize: "12px",
		iconSize: 20,
		borderRadius: 12,
	},
	medium: {
		filled: {
			pyTop: 15,
			pyBottom: 4,
			labelTransform: "translate(16px, 10px)",
			labelTransformShrink: "translate(16px, 3px)",
			labelTransformWithIcon: "translate(45px, 10px)",
			labelTransformShrinkWithIcon: "translate(45px, 2px)",
			paddingIcon: {
				padding: "9.5px 12px",
				paddingLeft: "0px",
				paddingRight: "0px",
			},
		},
		outlined: { pyTop: 9.5, pyBottom: 9.5 },
		pxDefault: 16,
		pxWithIcon: 12,
		fontSize: "14px",
		labelSize: "14px",
		labelScaleSize: "12px",
		iconSize: 18,
		borderRadius: 12,
	},
	small: {
		filled: {
			pyTop: 10,
			pyBottom: 4,
			labelTransform: "translate(12px, 7px)",
			labelTransformShrink: "translate(12px, 3px)",
			labelTransformWithIcon: "translate(36px, 7px)",
			labelTransformShrinkWithIcon: "translate(36px, 3px)",
			paddingIcon: {
				padding: "7px",
				paddingLeft: "0px",
				paddingRight: "0px",
			},
		},
		outlined: { pyTop: 8, pyBottom: 8 },
		pxDefault: 12,
		pxWithIcon: 8,
		fontSize: "12px",
		labelSize: "12px",
		iconSize: 16,
		borderRadius: 8,
	},
};

type ResponsiveSize<T> = {
	xl?: T;
	lg?: T;
	md?: T;
	sm?: T;
	xs?: T;
};

interface DSTextInputProps extends Omit<TextFieldProps, "size"> {
	size?: ExtendedInputSize;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	/** Responsive size theo breakpoints */
	responsiveSize?: ResponsiveSize<ExtendedInputSize>;
}

/**
 * @description TextField có label bên trong thì dùng variant="filled",
 * còn không thf=ì dùng variant="outlined"
 * @description TextField có label bên trong thường dùng cấc cỡ xlarge, large, medium
 * @description dùng cho trường hợp textarea thì thêm thuộc tính multiple
 */
const DSTextInput = forwardRef<HTMLDivElement, DSTextInputProps>(
	({ size = "medium", startIcon, endIcon, sx, slotProps, responsiveSize, ...props }, ref) => {
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

		// Tính padding dựa trên có icon hay không
		const paddingLeft = startIcon ? sizeConf.pxWithIcon : sizeConf.pxDefault;
		const paddingRight = endIcon ? sizeConf.pxWithIcon : sizeConf.pxDefault;

		const isFilled = props.variant === "filled" || !props.variant;
		const isOutlined = props.variant === "outlined";

		// Label transform dựa vào variant và có icon hay không
		const labelTransform = startIcon
			? sizeConf.filled.labelTransformWithIcon
			: sizeConf.filled.labelTransform;
		const labelTransformShrink = startIcon
			? sizeConf.filled.labelTransformShrinkWithIcon
			: sizeConf.filled.labelTransformShrink;

		const customSx: SxProps<Theme> = {
			color: "var(--input-field-label-default)",
			// Label style cho filled variant
			...(isFilled && {
				".MuiFormLabel-root": {
					fontSize: sizeConf.fontSize,
					fontFamily: "inherit",
					lineHeight: 1.5,
					fontWeight: 500,

					color: "inherit",
					transform: labelTransform,
					transition: "all 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms",
					"&.Mui-focused": {
						transform: labelTransformShrink,
						color: "var(--input-field-label-default)",
						fontSize: sizeConf.labelScaleSize,
					},
					"&.MuiFormLabel-filled": {
						transform: labelTransformShrink,
						color: "var(--input-field-label-default)",
						fontSize: sizeConf.labelScaleSize,
					},
					"&.Mui-error": {
						color: "inherit",
						"&.Mui-focused": {
							color: "var(--input-field-label-default)",
						},
					},
					"&.Mui-disabled": {
						color: "var(--input-field-label-disable)",
					}
				},
			}),
			".MuiInputBase-root": {
				color: "var(--input-field-input-filled)",
				borderRadius: `${sizeConf.borderRadius}px`,
				background: "var(--input-field-bg-default)",
				fontFamily: "inherit",
				lineHeight: 1.5,
				fontWeight: 500,
				fontSize: sizeConf.fontSize,
				px: 0,
				".MuiInputAdornment-root:not(.MuiInputAdornment-hiddenLabel)": {
					padding: sizeConf.filled.paddingIcon.padding,
					maxHeight: "unset",
					height: "100%",
					"&.MuiInputAdornment-positionStart": {
						margin: 0,
						paddingRight: sizeConf.filled.paddingIcon.paddingRight,
					},
					"&.MuiInputAdornment-positionEnd": {
						margin: 0,
						paddingLeft: sizeConf.filled.paddingIcon.paddingLeft,
					},
				},
				// Filled variant: padding top > bottom cho label floating
				...(isFilled && {
					outlineWidth: 1,
					outlineStyle: "solid",
					outlineOffset: -1,
					outlineColor: "transparent",
					"&:hover": {
						background: "var(--input-field-bg-default)",
						outlineColor: "var(--input-field-bolder-hover)",
					},
					"&.Mui-focused": {
						outlineColor: "var(--input-field-bolder-hover)",
						background: "var(--input-field-bg-default)",
					},
					"&.Mui-error:not(.Mui-disabled)": {
						outlineColor: "var(--input-field-bolder-error)",
						"&:hover": {
							outlineColor: "var(--input-field-bolder-hover)",
						},
						"&.Mui-focused": {
							outlineColor: "var(--input-field-bolder-hover)",
						},
					},
					"&.Mui-disabled": {
						outlineColor: "transparent",
						pointerEvents: "auto",
						cursor: "not-allowed",
						background: "var(--input-field-bg-disable)"
					},
					input: {
						padding: `${sizeConf.filled.pyTop}px ${paddingRight}px ${sizeConf.filled.pyBottom}px ${paddingLeft}px`,
						caretColor: "var(--input-field-cursor-default)",
						height: "inherit",
						"&::placeholder": {
							color: "var(--input-field-placeholder-shade)",
							font: "inherit",
						},
						"&.Mui-disabled": {
							pointerEvents: "auto",
							cursor: "not-allowed"
						}
					},
				}),
				// Outlined variant (không có label): padding top = bottom
				...(isOutlined && {
					input: {
						padding: `${sizeConf.outlined.pyTop}px ${paddingRight}px ${sizeConf.outlined.pyBottom}px ${paddingLeft}px`,
						caretColor: "var(--input-field-cursor-default)",
						height: "inherit",
						"&::placeholder": {
							color: "var(--input-field-placeholder-shade)",
							font: "inherit",
						},
					},
					fieldset: {
						borderColor: "transparent",
					},
					"&:hover": {
						fieldset: {
							borderColor: "var(--input-field-bolder-hover)",
						},
					},
					"&.Mui-focused": {
						fieldset: {
							borderColor: "var(--input-field-bolder-hover)",
							borderWidth: 1,
						},
					},
					"&.Mui-disabled": {
						pointerEvents: "auto",
						cursor: "not-allowed",
						background: "var(--input-field-bg-disable)",
						fieldset: {
							borderColor: "transparent",
							pointerEvents: "auto",
							cursor: "not-allowed",
						},
						input: {
							"&::placeholder": {
								color: "var(--input-field-placeholder-disable)",
								font: "inherit",
							},
						}
					},
				}),
				"&:has(textarea)": {
					padding: "12px 16px"
				}
			},
			...((sx as object) || {}),
		};

		return (
			<TextField
				ref={ref}
				sx={customSx}
				spellCheck="false"
				slotProps={{
					...slotProps,
					input: {
						...slotProps?.input,
						startAdornment: startIcon ? (
							<InputAdornment position="start">{startIcon}</InputAdornment>
						) : undefined,
						endAdornment: endIcon ? (
							<InputAdornment position="end">{endIcon}</InputAdornment>
						) : undefined,
						...(props.variant !== "outlined" && { disableUnderline: true }),
					},
				}}
				{...props}
			/>
		);
	}
);

DSTextInput.displayName = "DSTextInput";

export default DSTextInput;
