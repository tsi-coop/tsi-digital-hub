import { Box, Button, Modal, Typography } from '@mui/material'
import React from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';

const TSIAlert = ({
    isOpen,
    setIsOpen,
    onSubmit,
    title,
    text,
    buttonName1,
    buttonName2,
}: any) => {
    const deviceType = useDeviceType();
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '35%',
        padding: "2%",
        transform: 'translate(-50%, -50%)',
        backgroundColor:colors.white,
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
            <Box sx={style}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "flex-start",
                        justifyContent: 'center',
                        gap: '30px',
                        width: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: 'center',
                            gap: '5px',
                            width: '100%'
                        }}
                    >
                        <Typography
                            style={{
                                color: '#1D2020',
                                fontFamily: "OpenSansMedium",
                                fontSize: deviceType === 'mobile' ? '20px' : '25px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                textAlign: 'left',
                                margin: '0px',
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            style={{
                                color: colors.lightgrey,
                                fontFamily: 'OpenSans',
                                fontSize: deviceType === 'mobile' ? '14px' : '16px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '22.4px',
                                textAlign: 'center',
                            }}
                        >
                            {text}
                        </Typography>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: '10px',
                            width: '100%'
                        }}
                    >
                        <TSIButton
                            name={buttonName1}
                            disabled={false}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                            customBgColorOnhover={colors.white}
                            customBgColor={colors.white}
                            customTextColorOnHover={colors.primary}
                            customTextColor={colors.primary}
                            handleClick={
                                () => {
                                    setIsOpen(false)
                                }
                            }
                        />
                        <TSIButton
                            name={buttonName2}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor="1px solid #006A67"
                            customOutlineColorOnHover="1px solid #006A67"
                            customBgColorOnhover="#006A67"
                            customBgColor={"#006A67"}
                            customTextColorOnHover="#FFF"
                            customTextColor="#FFF"
                            handleClick={
                                () => {
                                    onSubmit()
                                }
                            }
                        />
                    </div>
                </div>
            </Box>
        </Modal >
    )
}

export default TSIAlert
