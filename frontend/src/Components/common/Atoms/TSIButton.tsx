import { Button, CircularProgress } from '@mui/material';
import useDeviceType from '../../../Utils/DeviceType';
import colors from '../../../assets/styles/colors';
import React from 'react';


const TSIButton = ({
    name,
    disabled=false,
    variant = 'contained',
    trailingIcon,
    leadingIcon,
    isCustomColors = false,
    customBgColor,
    customTextColor,
    customBgColorOnhover,
    customTextColorOnHover,
    customOutlineColor,
    load,
    customOutlineColorOnHover,
    padding,
    imageHeight,
    imageWidth,
    handleClick,
}: any) => {
    const deviceType = useDeviceType();

    const classes: any = {
        button: {
            padding: padding || '12px 16px',
            textTransform: 'none',
            color: variant == "outlined" ? colors.primary : colors.white,
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '140%',
            borderRadius: "100px",
            background: disabled ? colors.disablePrimary : customBgColor || colors.primary,
            border: disabled ? colors.disablePrimary : (customOutlineColor || ` 1px solid ${colors.primary}`),
        }
    };

    return (
        <div>
            <Button
                variant={variant}
                fullWidth
                color="error"
                // disabled={disabled || load}
                sx={classes?.button}
                onClick={(event) => {
                    if (disabled == false && load == false) {
                        handleClick(event)
                    }
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {load ? (
                        <CircularProgress size={24} style={{ color: colors.white }} />
                    ) : (
                        <>
                            {leadingIcon && (
                                typeof leadingIcon === 'string' ? (
                                    <img
                                        src={leadingIcon}
                                        style={{
                                            marginRight: '4px',
                                            width: imageWidth || '24px',
                                            height: imageHeight || '24px',
                                            opacity: disabled ? 0.4 : 1
                                        }}
                                        alt="leading-icon"
                                    />
                                ) : (
                                    React.cloneElement(leadingIcon, {
                                        style: {
                                            marginRight: '4px',
                                            fontSize: imageWidth || '24px',
                                            opacity: disabled ? 0.4 : 1
                                        }
                                    })
                                )
                            )}

                            <span style={{
                                color: customTextColor || colors.white,
                                fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "21px",
                            }}>{name}</span>

                            {trailingIcon && (
                                typeof trailingIcon === 'string' ? (
                                    <img
                                        src={trailingIcon}
                                        style={{
                                            marginRight: '4px',
                                            width: imageWidth || '24px',
                                            height: imageHeight || '24px',
                                            opacity: disabled ? 0.4 : 1
                                        }}
                                        alt="leading-icon"
                                    />
                                ) : (
                                    React.cloneElement(trailingIcon, {
                                        style: {
                                            marginRight: '4px',
                                            fontSize: imageWidth || '24px',
                                            opacity: disabled ? 0.4 : 1
                                        }
                                    })
                                )
                            )}
                        </>
                    )}
                </div>
            </Button>
        </div>
    );
};

export default TSIButton;

