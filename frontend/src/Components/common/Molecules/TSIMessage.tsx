import { Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSIChat from '../Atoms/TSIChat';
const TSIMessage = ({ open, title, buttonName2, btn2Color, onClick, setIsOpen }: any) => {
    const [writeSomething, setWriteSomething] = useState("")
    const deviceType = useDeviceType()
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '40%',
        height: "80%",
        padding: "0px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
        border: '0px solid #000',
        borderRadius: '5px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };
    const samplePosts = [
        {
            id: 1,
            author: 'Arlene McCoy',
            role: 'UI Designer',
            timeAgo: '2 min ago',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            year: 1997,
            number: "200+ customers",
            status: "Rejected"
        },
        {
            id: 2,
            author: 'Devon Lane',
            role: 'Frontend Developer',
            timeAgo: '5 min ago',
            content: 'Ut enim ad minim veniam, quis nostrud exercitation...',
            year: 1997,
            number: "200+ customers",
            status: "Accepted"
        },
        {
            id: 2,
            author: 'Devon Lane',
            role: 'Frontend Developer',
            timeAgo: '5 min ago',
            content: 'Ut enim ad minim veniam, quis nostrud exercitation...',
            year: 1997,
            number: "200+ customers",
            status: ""
        }
    ];
    return (
        <Modal
            open={open}
            onClose={() => { setIsOpen(false) }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: '10px',
                        height: '100%',
                        width: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: 'center',
                            padding: '20px',
                            height: "85%",
                            width: '100%',
                            gap: '20px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: '100%'
                            }}
                        >
                            <Typography
                                style={{
                                    color: '#1D2020',
                                    fontFamily: "OpenSansMedium",
                                    fontSize: deviceType === 'mobile' ? '20px' : '24px',
                                    fontStyle: 'normal',
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    margin: '0px',
                                }}
                            >
                                Message
                            </Typography>
                            <button onClick={() => { }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                <CloseIcon sx={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>

                        <div style={{
                            display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '20px', width: '100%', height: '90%', padding: '0px', overflowY: 'scroll',scrollbarWidth:"none"
                        }}>
                            {samplePosts.map((post, index) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center",  }}>
                                    <TSIChat item={post} sideDisplay={true} />
                                </div>
                            ))}
                        </div>

                        <TSITextfield
                            title={`Write Something`}
                            placeholder={`Write Something`}
                            value={writeSomething}
                            isRequired={true}
                            type={"text"}
                            name={"field"}
                            multiline={true}
                            rows={3}
                            handleChange={(event: any) => { setWriteSomething(event.target.value) }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "center",
                            width: '100%',
                            height: "15%",
                            padding: '20px',
                            gap: '5px',
                            borderTop: `1px solid ${colors.grey80}`
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
        </Modal >
    )
}

export default TSIMessage
