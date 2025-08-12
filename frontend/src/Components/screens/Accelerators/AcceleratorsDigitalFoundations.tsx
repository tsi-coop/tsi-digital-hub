import React, { useEffect, useState } from 'react';
import useDeviceType from '../../../Utils/DeviceType';
import colors from '../../../assets/styles/colors';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIButton from '../../common/Atoms/TSIButton';
import TSINewSupportRequestModal from '../../common/Molecules/TSINewSupportRequestModal';
import apiInstance from '../../../services/authService';

const AcceleratorsDigitalFoundations = () => {
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
                        Digital Foundations
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
                            The "TSI Digital Foundations Program" offers a gentle pathway to digital confidence for MSME owners and aspiring professionals in India. Delivered conveniently as a webinar, it's designed for those looking to enhance their digital understanding without overwhelming complexity. We recognize the unique journey of MSMEs in today's digital world, and this program aims to be a supportive guide.
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
                            This webinar provides a thoughtful overview of today's digital essentials. We'll gently explore foundational elements like how networks operate, the quiet mechanics behind web and mobile apps, and key programming concepts. The program also touches upon practical areas crucial for modern business, including ensuring quality, streamlining operations, and understanding cloud services. Digital marketing strategies, data management, and information security are also woven in. Importantly, we introduce various digital roles, offering a clearer picture of potential talent within your own team.
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
                            A distinctive part of this webinar is the inclusion of both digital maturity assessment for businesses and capability maturity assessment for service providers. This means you'll gain a quiet understanding of your own digital standing and learn how to evaluate the digital strengths of potential partners. It's about empowering you, the MSME owner, with gentle insights and foundational knowledge to guide your business's digital journey.
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
                                    window.open("https://github.com/tsi-cooperative/tsi-digital-foundations","_blank")
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

export default AcceleratorsDigitalFoundations;
