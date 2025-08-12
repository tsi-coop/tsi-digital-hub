import React, { useEffect, useState } from 'react';
import useDeviceType from '../../../Utils/DeviceType';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { Snackbar, Modal, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TSIButton from '../../common/Atoms/TSIButton';
import { NoData } from '../../../assets';
import TSINewSupportRequestModal from '../../common/Molecules/TSINewSupportRequestModal';
const Support = ({ setQuery, query }: any) => {
    const deviceType = useDeviceType();
    const deviceWidth = deviceType === 'mobile' || deviceType === 'small-tablet';
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [supportType, setSupportType] = useState<any>("");
    const [details, setDetails] = useState<any>("");
    const [opennewModal, setOpenNewModal] = useState(false);
    const [isHover, setIsHover] = useState(false)
    const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

    const handleStatusClick = (row: any) => {
        setSelectedRow(row);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRow(null);
    };
    const [load, setLoad] = useState(true);
    const [support, setSupport] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [supportDetails, setSupportDetails] = useState<any[]>([]);
    const navigation = useNavigate();

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getSupportData = () => {
        setLoad(true);
        const body = {
            _func: 'get_my_support_requests',
        };

        apiInstance
            .getSupports(body)
            .then((response: any) => {
                if (response.data) {
                    setSupport(response.data);
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
    };

    const getSupportDetails = (row: any) => {
        setLoad(true);
        handleStatusClick(row)
        const body = {
            "_func": "view_support_request",
            "id": row?.id
        };

        apiInstance
            .getSupports(body)
            .then((response: any) => {
                if (response.data) {
                    setSupportDetails(response.data);
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
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
                    getSupportData()
                    setOpenNewModal(false)
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
    };

    useEffect(() => {
        getSupportData();
    }, []);

    const columns: any[] = [
        { id: 'type', label: 'Request Type', minWidth: 150 },
        { id: 'query', label: 'Query', minWidth: 300 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                height: '100vh',
                width: '100%',
                backgroundColor: colors.lightPrimary,
                padding: '20px',
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
                    backgroundColor: colors.white,
                    borderRadius: '16px',
                    padding: '20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '16px',
                        borderBottom: `1px solid ${colors.snowywhite}`
                    }}
                >
                    <h2 style={{ margin: 0 }}>Support</h2>

                    <TSIButton
                        name={"New Support Request"}
                        disabled={false}
                        variant={'contained'}
                        padding={"5px 10px"}
                        load={false}
                        leadingIcon={<AddIcon sx={{ width: "20px" }} />}
                        isCustomColors={true}
                        customOutlineColor={`0px solid ${colors.snowywhite}`}
                        customOutlineColorOnHover={`0px solid ${colors.snowywhite}`}
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


                {(support?.length > 0) ? (<div style={{
                    width: '100%',
                    height: "100%",
                    overflowY: "scroll",
                }}>
                    {support?.map((row, rowIndex) => (
                        <div
                            onClick={() => {
                                navigation(`/support/details?id=${row?.id}&status=${row?.status}`)
                                // getSupportDetails(row)
                            }}
                            onMouseEnter={() => { setIsHover(true); setHoveredRowIndex(rowIndex) }}
                            onMouseLeave={() => { setIsHover(false); setHoveredRowIndex(null) }}
                            style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", borderBottom: `0.5px solid ${colors.snowywhite}`, boxShadow: `20px 20px 50px ${colors.lightmediumSnowyWhite}`, gap: '10px', padding: '20px', borderRadius: '0px', backgroundColor: (isHover && hoveredRowIndex === rowIndex) ? colors.lightPrimarybackground : colors.white, cursor: "pointer", }}>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                gap: '5px'
                            }}>
                                <p style={{
                                    fontFamily: "OpenSans",
                                    fontSize: '14px',
                                    fontWeight: "bold",
                                    color: colors.primary,
                                    margin: 0
                                }}>
                                    Request Type : <span style={{
                                        fontFamily: "OpenSans",
                                        fontSize: '12px',
                                        fontWeight: "bold",
                                        color: colors.black
                                    }}>
                                        {row?.type}
                                    </span>
                                </p>
                                <p style={{
                                    fontFamily: "OpenSans",
                                    fontSize: '14px',
                                    fontWeight: "bold",
                                    color: colors.primary,
                                    margin: 0
                                }}>
                                    Query : <span style={{
                                        fontFamily: "OpenSans",
                                        fontSize: '12px',
                                        fontWeight: "bold",
                                        color: colors.black
                                    }}>
                                        {row?.query}
                                    </span>
                                </p>
                               
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: '5px'
                            }}>
                                <button
                                    style={{
                                        border: `1px solid transparent`,
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: 'transparent',
                                        color: colors.primary,
                                        cursor: 'default',
                                    }}
                                >
                                    {row.status}
                                </button>
                                 <span style={{
                                    color: colors.lightgrey,
                                    fontSize: "14px",
                                    fontWeight: 400,
                                }}>{row?.time_ago}</span>

                            </div>


                        </div>
                    ))}
                </div>) : (
                    <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', height: '100%', scrollbarWidth: "none" }}>
                        <img src={NoData} />
                    </div>)}
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
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
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            width: '90%',
                            maxWidth: '400px',
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
                                View Support Detail
                            </span>
                            <button onClick={() => { setOpenNewModal(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                <CloseIcon sx={{ width: '20px', height: '20px' }} />
                            </button>

                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: "flex-start",
                                width: '100%',
                                padding: "10px",
                                gap: '10px'
                            }}
                        >
                            <p style={{ margin: 0 }}>Support Type: <b>{selectedRow?.type}</b></p>
                            <p style={{ margin: 0 }}>Query: <b>{selectedRow?.query}</b></p>
                        </div>



                    </div>
                </Modal>

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
        </div>
    );
};

export default Support;
