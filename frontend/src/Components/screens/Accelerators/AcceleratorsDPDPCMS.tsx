import React, { useEffect, useState } from 'react';
import useDeviceType from '../../../Utils/DeviceType';
import colors from '../../../assets/styles/colors';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIButton from '../../common/Atoms/TSIButton';
import TSINewSupportRequestModal from '../../common/Molecules/TSINewSupportRequestModal';
import apiInstance from '../../../services/authService';

const AcceleratorsDPDPCMS = () => {
    const deviceType = useDeviceType();
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet");
    const [load, setLoad] = useState(false);
    const [supportType, setSupportType] = useState<any>("ACCELERATOR");
    const [details, setDetails] = useState<any>("");
    const [opennewModal, setOpenNewModal] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const requestSupportData = () => {
        setLoad(true);
        const body = {
            "_func": "request_support",
            "request_type": supportType,
            "query": details
        }
        apiInstance
            .getSupports(body)
            .then((response: any) => {
                if (response.data) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: 'Support Request Created!',
                    });

                    setOpenNewModal(false)
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
    };


    if (load) {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: deviceWidth ? 'column' : 'row',
                justifyContent: deviceWidth ? 'flex-start' : 'space-between',
                alignItems: 'flex-start',
                padding: '10px',
                gap: '20px',
                backgroundColor: colors.lightPrimary,
                height: '92%',
                boxSizing: 'border-box',
            }}
        >
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert
                    sx={{
                        backgroundColor: snackbar.severity === 'error' ? colors.red : colors.primary,
                    }}
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity as AlertColor}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>

            <div
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: colors.white,
                    borderRadius: '24px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        padding: '10px',
                        borderBottom: `1px solid ${colors.snowywhite}`,
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontFamily: 'OpenSans',
                            fontSize: '24px',
                            fontWeight: 700,
                            lineHeight: '32.68px',
                            textAlign: 'left',
                            color: colors.primary,
                        }}
                    >
                        DPDP Consent Management System
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        overflowY: 'auto',
                        padding: '15px',
                        gap: '20px',
                        flex: 1,
                    }}
                >

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                            height: '80vh',
                            gap: '20px',
                            flex: 1,
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontFamily: 'OpenSans',
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '21px',
                                textAlign: 'left',
                                color: colors.black,
                            }}
                        >
                            The TSI DPDP Consent Management System is designed to be a foundational solution for organizations navigating the Digital Personal Data Protection Act 2023. Our primary goal is to provide accessible tools for Data Fiduciaries (DFs) and Data Processors (DPs) to meet their consent, data principal rights, retention, and reporting obligations under the Act.
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontFamily: 'OpenSans',
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '21px',
                                textAlign: 'left',
                                color: colors.black,
                            }}
                        >
                            This solution functions as a simpler, open-source reference implementation, offering a blueprint for the industry and local service providers. It prioritizes installation simplicity and system stability, ensuring that even small IT solution providers in Tier 2/3 towns in India can easily implement DPDP solutions for local businesses like hospitals and manufacturing units.
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontFamily: 'OpenSans',
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '21px',
                                textAlign: 'left',
                                color: colors.black,
                            }}
                        >
                            Key business requirements supported include collecting explicit consent, managing its lifecycle, enabling data principals' rights (Access, Correction, Erasure), and providing dashboards for various stakeholders.
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontFamily: 'OpenSans',
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '21px',
                                textAlign: 'left',
                                color: colors.black,
                            }}
                        >
                            Architecturally, the system emphasizes simplicity, robust security with encryption and granular access control, high performance for rapid consent validation, and reliable single-node installations. It is built for usability with intuitive, multilingual interfaces and can easily be customized by System Integrators for diverse enterprise needs
                        </p>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            height: '8vh',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <TSIButton
                            name={"View More Details"}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.yellow}`}
                            customOutlineColorOnHover={`1px solid ${colors.yellow}`}
                            customBgColorOnhover={colors.yellowprimary}
                            customBgColor={colors.yellowprimary}
                            customTextColorOnHover={colors.primary}
                            customTextColor={colors.primary}
                            handleClick={
                                () => {
                                    window.open("https://github.com/tsi-cooperative/tsi-dpdp-cms", "_blank")
                                }
                            }
                        />
                        <TSIButton
                            name={"Request Support"}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                            customBgColorOnhover={colors.primary}
                            customBgColor={colors.primary}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    setOpenNewModal(true)
                                }
                            }
                        />
                    </div>
                </div>
            </div>
            <TSINewSupportRequestModal
                opennewModal={opennewModal}
                setOpenNewModal={setOpenNewModal}
                setSupportType={setSupportType}
                supportType={supportType}
                details={details}
                setDetails={setDetails}
                onClick={() => { requestSupportData() }}
            />
        </div>
    );
};

export default AcceleratorsDPDPCMS;
