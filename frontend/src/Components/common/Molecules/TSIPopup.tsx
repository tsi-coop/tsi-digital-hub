import { Box, Button, Modal, Typography } from '@mui/material'
import React from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';

const TSIPopup = ({
    isOpen,
    setIsOpen,
    text1,
    text2,
    buttonColor,
    buttonName,
    image,
    onSubmit
}: any) => {
    const deviceType = useDeviceType();
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" :  '33%',
        padding:deviceType == "mobile" ? "15px" :  "2%",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: '0px solid #000',
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };
    return (
        <Modal
            open={isOpen}
            onClose={() => { setIsOpen(false) }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
                <div
                    style={{
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: deviceType === 'mobile' ? "100%" : '75%',

                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px'
                        }}
                    >
                        <img src={image} style={{
                            width: "80px",
                            height: "80px",
                        }} />
                        <p
                            style={{
                                color: '#1D2020',
                                fontFamily: 'OpenSans',
                                fontSize: deviceType === 'mobile' ? '20px' : '32px',
                                fontStyle: 'normal',
                                fontWeight: '600',
                                lineHeight: '43.58px',
                                textAlign: 'center',
                                margin: '0px',
                                padding: "0px"
                            }}
                        >
                            {text1}
                        </p>
                        <p
                            style={{
                                color: colors.lightgrey,
                                fontFamily: 'OpenSans',
                                fontSize: deviceType === 'mobile' ? '14px' : '16px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '22.4px',
                                textAlign: 'center',
                                margin: '0px',
                                padding: "0px",
                                marginBottom: '10px'
                            }}
                        >
                            {text2}
                        </p>
                        <TSIButton
                            name={buttonName}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${buttonColor || colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${buttonColor || colors.primary}`}
                            customBgColorOnhover={buttonColor || colors.primary}
                            customBgColor={buttonColor || colors.primary}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    onSubmit()
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        </Modal >
    )
}

export default TSIPopup
