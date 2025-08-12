import { Modal } from '@mui/material'
import React from 'react'
import colors from '../../../assets/styles/colors'
import CloseIcon from '@mui/icons-material/Close';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import TSIButton from '../Atoms/TSIButton';
import useDeviceType from '../../../Utils/DeviceType';
import TSITextfield from '../Atoms/TSITextfield';

const TSINewSupportRequestModal = ({ opennewModal, setOpenNewModal, setSupportType, supportType,
    details,
    setDetails,
    onClick,
}: any) => {
    const deviceType = useDeviceType()
    return (
        <Modal
            open={opennewModal}
            onClose={() => {
                setOpenNewModal(false)
                setSupportType("")
                setDetails('')
            }}
            aria-labelledby="status-modal-title"
            aria-describedby="status-modal-description"
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: colors.white,
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    width: '35%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        width: '100%',
                        borderBottom: `1px solid ${colors.snowywhite}`,
                        height: '10%',
                        padding: '10px'
                    }}
                >
                    <span style={{
                        fontFamily: "OpenSans",
                        fontSize: "20px",
                        fontWeight: 600,
                        textAlign: "left",
                    }}>
                        New Support Request
                    </span>
                    <button onClick={() => {
                        setOpenNewModal(false);
                        setSupportType("")
                        setDetails('')
                    }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                        <CloseIcon sx={{ width: '20px', height: '20px' }} />
                    </button>

                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: '100%',
                        padding: '20px',
                        gap: "15px",
                        height: '80%'
                    }}
                >
                    <TSISingleDropdown
                        name={"Support Type"}
                        setFieldValue={setSupportType}
                        fieldvalue={supportType || ""}
                        isRequired={true}
                        previewMode={supportType == "ACCELERATOR"}
                        dropdown={[{ value: "ADVISORY", key: "advisory" },
                        { value: "GRIEVANCE", key: "grievance" },
                        ].map((item: any) => item.value)}
                    />
                    <TSITextfield
                        title={"Details"}
                        placeholder={"Enter Training Link"}
                        value={details}
                        isRequired={true}
                        type={"text"}
                        name={"field"}
                        multiline={true}
                        rows={3}
                        handleChange={(event: any) => { setDetails(event.target.value) }}
                    />


                    <TSIButton
                        name={"Submit"}
                        disabled={!details?.trim() || !supportType}
                        variant={'contained'}
                        padding={deviceType == "mobile" ? "5px 15px" : "8px 50px"}
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
                                onClick()
                            }
                        }
                    />

                </div>

            </div>
        </Modal>
    )
}

export default TSINewSupportRequestModal
