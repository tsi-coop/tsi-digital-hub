import { Modal, Typography } from '@mui/material'
import React from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';

const TSIStrictModal = ({ open, title, desc, buttonName2, btn2Color, onClose, onClick, titleColor }: any) => {
    const deviceType = useDeviceType()
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '35%',
        height:"auto",
        padding: "20px",
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
            onClose={() => { }}
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
                        gap: '20px',
                        width: '100%'
                    }}
                >
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography
                            style={{
                                color: titleColor,
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
                        <button onClick={() => {
                            onClose()
                        }} style={{ top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.5em", cursor: "pointer", color: "#555" }} >&times;</button>
                    </div>
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

export default TSIStrictModal
