import { Modal, Typography } from '@mui/material'
import React from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';

const TSIConfirmationModal = ({ open, title, desc, buttonName1, buttonName2, btn2Color, onClose, onClick }: any) => {
    const deviceType = useDeviceType()
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '35%',
        padding: "2%",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
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
            open={open}
            onClose={() => { onClose() }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
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
                                textAlign: 'left',
                            }}
                        >
                            {desc}
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
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.grey80}`}
                            customOutlineColorOnHover={`1px solid ${colors.grey80}`}
                            customBgColorOnhover="#FFF"
                            customBgColor={"#FFF"}
                            customTextColorOnHover={colors.grey}
                            customTextColor={colors.grey}
                            handleClick={
                                () => {
                                    onClose()
                                }
                            }
                        />
                        <TSIButton
                            name={buttonName2}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${btn2Color}`}
                            customOutlineColorOnHover={`1px solid ${btn2Color}`}
                            customBgColorOnhover={btn2Color}
                            customBgColor={btn2Color}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    onClick()
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default TSIConfirmationModal
