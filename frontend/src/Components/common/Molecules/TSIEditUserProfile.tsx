import { Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
const TSIEditUserProfile = ({ open, setIsOpen, title, buttonName1, buttonName2, btn2Color, onClick }: any) => {
    const deviceType = useDeviceType()
    const [name, setName] = useState("")
    const [organisationName, setOrganisationName] = useState("")
    const [businessEmail, setBusinessEmail] = useState("")
    const role = localStorage.getItem("role")
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '28%',
        height: '60%',
        padding: "10px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
        border: '0px solid #000',
        borderRadius: '25px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };
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
                        alignItems: "flex-start",
                        justifyContent: 'space-between',
                        gap: '50px',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: 'center',
                            padding: '10px',
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
                                {title}
                            </Typography>
                            <button onClick={() => { }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                <CloseIcon sx={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>

                        {(role == "PROFESSIONAL") && (<TSITextfield
                            title={`Organisation Name`}
                            placeholder={`Enter Organisation Name`}
                            value={organisationName}
                            type={"text"}
                            name={"field"}
                            multiline={true}
                            rows={1}
                            handleChange={(event: any) => { setOrganisationName(event.target.value) }}
                        />)}

                        <TSITextfield
                            title={`Name`}
                            placeholder={`Enter Name`}
                            value={name}
                            type={"text"}
                            name={"field"}
                            multiline={true}
                            rows={1}
                            handleChange={(event: any) => { setName(event.target.value) }}
                        />
                        <TSITextfield
                            title={`Business Email`}
                            placeholder={`Enter Business Email`}
                            value={businessEmail}
                            type={"text"}
                            name={"field"}
                            multiline={true}
                            rows={1}
                            handleChange={(event: any) => { setBusinessEmail(event.target.value) }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: '100%',
                            padding: '10px',
                            gap: '5px',
                            borderTop: `1px solid ${colors.grey80}`
                        }}
                    >
                        <TSIButton
                            name={buttonName1}
                            disabled={false}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor="1px solid #006A67"
                            customOutlineColorOnHover="1px solid #006A67"
                            customBgColorOnhover="#FFF"
                            customBgColor={"#FFF"}
                            customTextColorOnHover="#006A67"
                            customTextColor="#006A67"
                            handleClick={
                                () => {
                                    onClick()
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
        </Modal >
    )
}

export default TSIEditUserProfile
