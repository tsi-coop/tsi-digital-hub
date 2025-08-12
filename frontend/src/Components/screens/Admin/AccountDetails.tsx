import { Avatar, Button, Modal, Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import apiInstance from '../../../services/authService';
import colors from '../../../assets/styles/colors';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TSITextfield from '../../common/Atoms/TSITextfield';
import TSIButton from '../../common/Atoms/TSIButton';
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown';
import TSIConfirmationModal from '../../common/Molecules/TSIConfirmationModal';
import CloseIcon from '@mui/icons-material/Close';
import { NoData } from '../../../assets';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DonationReceiptPDF from './DonationReceiptPDF';
const AccountDetails = () => {
    const [isDonation, setIsDonation] = useState<any>(false);
    const [receiptDownload, setReceiptDownload] = useState<any>(false);
    const [load, setLoad] = React.useState(false);
    const [searchParams] = useSearchParams();
    const [kycType, setKycType] = useState<any>("");
    const [kycValue, setKycValue] = useState<any>("");
    const [accountType, setAccountType] = useState<any>(searchParams.get('account_type') || "");
    const [accountSlug, setAccountSlug] = useState<any>(searchParams.get('account_slug') || "");
    const [orgName, setOrgName] = useState<any>(searchParams.get('org_name') || "");
    const [select, setSelect] = useState<any>("donationhistory");
    const [donationType, setDonationType] = useState<any>("");
    const [numYears, setNumYears] = useState<any>("");
    const [amountPaid, setAmountPaid] = useState<any>(0);
    const [data, setData] = useState<any>({});
    const [receiptId, setReceiptId] = useState()
    const [openDonation, setOpenDonation] = useState(false)
    const [address, setAddress] = useState<any>("");
    const [emailContact, setEmailContact] = useState<any>("");
    const [paymentMode, setPaymentMode] = useState<any>("");
    const [transactionDetails, setTransactionDetails] = useState<any>("");
    const [paymentDate, setPaymentDate] = useState<any>("");
    const [pdfbody, setPdfBody] = useState<any>()
    const donationDropdown = [
        {
            key: "member_services",
            value: "Member Services"
        },
        {
            key: "research_&_development",
            value: "Research & Development"
        },
       
    ]

    const deviceType = useDeviceType()
    const navigate = useNavigate()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        getDonationHistory()
    }, [])


    const getRecordDonation = () => {
        setLoad(true)
        const body = {
            "_func": "record_donation",
            "kyc_type": kycType,
            "kyc_value": kycValue,
            "account_type": accountType,
            "account_slug": accountSlug,
            "donation_type": donationType?.key,
            "num_years": parseInt(numYears),
            "amount_paid": parseFloat(parseFloat(amountPaid)?.toFixed(2)),
            "address": address,
            "email_contact": emailContact,
            "payment_mode": paymentMode,
            "transaction_details": transactionDetails,
            "payment_date": paymentDate?.split('-').reverse().join('/')
        }

        apiInstance.getKYC(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.receipt_id) {
                        // setSelect('senddonation')
                        setReceiptId(response.data.receipt_id)
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            message: "Donation Recorded",
                        })
                        setOpenDonation(false)
                        setIsDonation(false)
                        getDonationHistory()
                    }

                }

                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: "Error. Please try again.",
                })
            });
    }


    const getReceiptDetails = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "get_receipt",
            "receipt_id": id
        }

        apiInstance.getKYC(body)
            .then((response: any) => {
                if (response.data) {
                    // setSelect("viewreceipt")
                    setData(response?.data)
                    setPdfBody({ ...response?.data, "id": id })
                    if (response?.data) {
                        setReceiptDownload(true)
                    }

                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: "Error. Please try again.",
                })
            });
    }


    const getSubscription = () => {
        setLoad(true)
        const body = {
            "_func": "get_subscription_details",
            "account_type": accountType,
            "account_slug": accountSlug

        }
        apiInstance.getSubscriptionDetails(body)
            .then((response: any) => {
                if (response.data) {
                    setSelect("viewsubscription")
                    setData(response?.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: "Error. Please try again.",
                })
            });
    }





    const [donatonHistory, setDonationHistory] = useState<any>([]);

    const fields = [
        { label: "Account Name", key: "account_name" },
        { label: "Account Slug", key: "account_slug" },
        { label: "Account Type", key: "account_type" },
        { label: "Amount", key: "amount" },
        { label: "KYC Type", key: "kyc_type" },
        { label: "Start Date", key: "start_date" },
        { label: "End Date", key: "end_date" }
    ];




    const getDonationHistory = () => {
        setLoad(true)
        const body = {
            "_func": "get_donation_history",
            "account_type": accountType,
            "account_slug": accountSlug
        }
        apiInstance.getSubscriptionDetails(body)
            .then((response: any) => {
                if (response.data) {
                    setSelect("donationhistory")
                    setDonationHistory(response?.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }


    const grpstyle: any = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: '100%',
        gap: '5px'
    }
    const titleStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }
    const valueStyle: any = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-start",
        fontFamily: "OpenSans",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "22.4px",
        letterSpacing: "0.5px",
        textAlign: "left",
        flexWrap: "wrap",
        padding: 0,
        margin: 0,
        color: colors.black
    }
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '40%',
        height: '70%',
        padding: deviceType == "mobile" ? "15px" : "15px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '12px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };


    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', height: "92%", backgroundColor: colors.lightPrimary }}>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MuiAlert
                        sx={{
                            backgroundColor: snackbar.severity == "error" ? colors.red : colors.primary
                        }}
                        elevation={6}
                        variant="filled"
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity as AlertColor}
                    >
                        {snackbar.message}
                    </MuiAlert>
                </Snackbar>


                <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", padding: '10px', gap: '10px', paddingBottom: '0px', }}>
                        <button
                            onClick={() => { navigate(-1) }}
                            style={{
                                padding: 0, margin: 0, fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "20px",
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "center",
                                textTransform: "capitalize",
                                backgroundColor: "transparent",
                                border: "0px solid transparent",
                                cursor: "pointer"
                            }}>
                            <ArrowBackIcon sx={{ width: '20px', height: "20px" }} />
                        </button>
                        <span style={{
                            margin: 0,
                            paddingBottom: "10px",
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                            textTransform: 'capitalize',
                            color: colors.primary
                        }}>Account Details </span>
                        {/* {(admin) && (<button onClick={() => { setIsFlag(true) }} style={{ padding: 0, margin: 0, backgroundColor: "transparent", border: "0px solid transparent", cursor: "pointer" }}>
                            <FlagIcon sx={{ color: colors.primary }} />
                        </button>)} */}

                    </div>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            overflowY: "scroll",
                            scrollbarWidth: "none",
                            alignItems: 'flex-start',
                            padding: '10px',
                            gap: '10px'
                        }}
                    >
                        {/* First row */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                paddingBottom: '0px',
                                paddingTop: '0px'
                            }}
                        >
                            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
                                <TSITextfield
                                    title="Account Slug"
                                    placeholder="Enter Account Slug"
                                    previewMode={searchParams.get('account_type') ? true : false}
                                    value={accountSlug}
                                    isRequired={true}
                                    type="text"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setAccountSlug(event.target.value)}
                                />
                            </div>

                            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
                                <TSITextfield
                                    title="Account Type"
                                    placeholder="Enter Account Type"
                                    previewMode={searchParams.get('account_slug') ? true : false}
                                    value={accountType}
                                    isRequired={true}
                                    type="text"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setAccountType(event.target.value)}
                                />
                            </div>
                        </div>

                        {(select == "donationhistory") && (<div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                padding: '10px',
                                gap: '10px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    flexWrap: "wrap",
                                    padding: '10px',
                                    borderTop: `1px solid ${colors.snowywhite}`,
                                    gap: '10px'
                                }}
                            >
                                <p style={{ ...titleStyle, fontSize: "16px", color: colors.primary }}>Donations - {(orgName ? orgName : "") || ""}</p>

                                <button
                                    style={{
                                        padding: "8px 10px",
                                        backgroundColor: colors.primary,
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setIsDonation(true)}
                                >
                                    New Donation
                                </button>
                            </div>
                            {(donatonHistory?.length > 0) ? (<div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    padding: '10px',
                                    gap: '10px'
                                }}
                            >
                                {donatonHistory.map((data: any, index: any) => (
                                    <div
                                        key={index}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "20px",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                            width: "100%",
                                            backgroundColor: "#fff",
                                            display: 'flex',
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: '10px',
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        {fields.map(({ label, key }) => (
                                            <div style={{ ...grpstyle, width: "auto" }} key={key}>
                                                <p style={titleStyle}>{label}</p>
                                                <p style={valueStyle}>{data[key]}</p>
                                            </div>
                                        ))}
                                        <div style={{ ...grpstyle, width: "auto" }}>
                                            <p style={titleStyle}>Receipt</p>
                                            <button
                                                style={{
                                                    padding: "8px 10px",
                                                    backgroundColor: colors.primary,
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => getReceiptDetails(data.receipt_id)}
                                            >
                                                View Receipt #{data.receipt_id}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>) : (
                                <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', scrollbarWidth: "none", }}>
                                    <img src={NoData} />
                                </div>)}

                        </div>)}
                        {(select == "viewsubscription") && (<div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                padding: '10px',
                                gap: '10px'
                            }}
                        >
                            <span style={{
                                ...titleStyle,
                                fontSize: "16px",
                                color: colors.primary
                            }}>Subscription Details: <span style={{ color: colors.primary }}>{data?.name}</span></span>

                            <div style={grpstyle}>
                                <p style={titleStyle}>About</p>
                                <p style={valueStyle}>{data?.about}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Plan Expiry</p>
                                <p style={valueStyle}>{data?.plan_expiry}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Plan Type</p>
                                <p style={valueStyle}>{data?.plan_type}</p>
                            </div>

                        </div>)}


                        {(select == "viewreceipt") && (<div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                padding: '10px',
                                gap: '10px'
                            }}
                        >

                            <span style={{
                                ...titleStyle,
                                fontSize: "16px",
                                color: colors.primary
                            }}>Receipt</span>

                            <div style={grpstyle}>
                                <p style={titleStyle}>Account Name</p>
                                <p style={valueStyle}>{data?.account_name}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Account Slug</p>
                                <p style={valueStyle}>{data?.account_slug}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Account Type</p>
                                <p style={valueStyle}>{data?.account_type}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Amount</p>
                                <p style={valueStyle}>{data?.amount}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>KYC Type</p>
                                <p style={valueStyle}>{data?.kyc_type}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>KYC Type</p>
                                <p style={valueStyle}>{data?.kyc_type}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Start Date</p>
                                <p style={valueStyle}>{data?.start_date}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>End Date</p>
                                <p style={valueStyle}>{data?.end_date}</p>
                            </div>


                        </div>)}

                    </div>

                    <TSIConfirmationModal
                        open={openDonation}
                        title={""}
                        desc={"Are you sure you want to record donation?"}
                        buttonName1={"No"}
                        buttonName2={"Yes"}
                        btn2Color={colors.primary}
                        onClose={() => {
                            setOpenDonation(false)
                        }}
                        onClick={() => {
                            getRecordDonation()
                        }}
                    />

                    <Modal
                        open={isDonation}
                        onClose={() => { setIsDonation(false); setAmountPaid(""); setNumYears(""); setDonationType("") }}
                        sx={{
                            border: "0px solid transparent"
                        }}
                    >
                        <div style={style}>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "space-between",
                                    width: '100%',
                                    height: '10%',
                                    borderBottom: `1px solid ${colors.snowywhite}`,
                                }}
                            >
                                <span style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "24px",
                                    fontWeight: 600,
                                    textAlign: "left",
                                    lineHeight: "28px"

                                }}>
                                    Record Donation
                                </span>
                                <button onClick={() => { setIsDonation(false); setAmountPaid(""); setNumYears(""); setDonationType("") }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                    <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                </button>

                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    padding: '5px',
                                    marginTop: '20px',
                                    overflowY: "scroll",
                                    scrollbarWidth: 'none',
                                    height: '80%',
                                    gap: '20px'
                                }}
                            >
                                <TSITextfield
                                    title="Address"
                                    placeholder="Enter Address"
                                    value={address}
                                    isRequired={true}
                                    type="text"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setAddress(event.target.value)}
                                />
                                <TSITextfield
                                    title="Email Contact"
                                    placeholder="Enter Email Contact"
                                    value={emailContact}
                                    isRequired={true}
                                    type="text"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setEmailContact(event.target.value)}
                                />

                                <TSITextfield
                                    title="Enter Payment Mode"
                                    placeholder="Enter Payment Mode"
                                    value={paymentMode}
                                    isRequired={true}
                                    type="text"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setPaymentMode(event.target.value)}
                                />

                                <TSITextfield
                                    title="Enter Payment Date"
                                    placeholder="Enter Payment Date"
                                    value={paymentDate}
                                    isRequired={true}
                                    // type="date"
                                    type="text"
                                    name="field"
                                    handleChange={(event: any) => setPaymentDate(event.target.value)}
                                />

                                <TSITextfield
                                    title="Enter Transaction Details"
                                    placeholder="Enter Transaction Details"
                                    value={transactionDetails}
                                    isRequired={true}
                                    type="text"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setTransactionDetails(event.target.value)}
                                />




                                <TSISingleDropdown
                                    name="Kyc Type"
                                    setFieldValue={(selectedValue: string) => {
                                        setKycType(selectedValue);
                                    }}
                                    fieldvalue={kycType || ""}
                                    isRequired={true}
                                    dropdown={["pan"]?.map((item: any) => item)}
                                />
                                <TSITextfield
                                    title="Kyc Value"
                                    placeholder="Enter Kyc Value"
                                    value={kycValue}
                                    isRequired={true}
                                    type="text"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setKycValue(event.target.value)}
                                />


                                <TSISingleDropdown
                                    name="Donation Type"
                                    setFieldValue={(selectedValue: string) => {
                                        const selectedObj = donationDropdown.find((item: any) => item.value === selectedValue);
                                        setDonationType(selectedObj);
                                    }}
                                    fieldvalue={donationType?.value || ""}
                                    isRequired={true}
                                    dropdown={donationDropdown?.map((item: any) => item.value)}
                                />


                                <TSITextfield
                                    title="Number of Years"
                                    placeholder="Enter Num Years"
                                    value={numYears}
                                    isRequired={true}
                                    type="number"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setNumYears(event.target.value)}
                                />

                                <TSITextfield
                                    title="Amount Paid"
                                    placeholder="Enter Amount Paid"
                                    value={amountPaid}
                                    isRequired={true}
                                    type="number"
                                    name="field"
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => setAmountPaid(event.target.value)}
                                />

                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "flex-end",
                                    width: '100%',
                                    borderTop: `1px solid ${colors.snowywhite}`,
                                    height: 'auto',
                                    paddingTop: '20px',
                                    gap: '20px'
                                }}
                            >
                                <TSIButton
                                    name={"Cancel"}
                                    disabled={false}
                                    variant={'contained'}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                    load={false}
                                    isCustomColors={true}
                                    customOutlineColor={`1px solid ${colors.primary}`}
                                    customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                    customBgColorOnhover="#FFF"
                                    customBgColor={colors.white}
                                    customTextColorOnHover={colors.primary}
                                    customTextColor={colors.primary}
                                    handleClick={
                                        () => {
                                            setIsDonation(false)
                                        }
                                    }

                                />
                                <TSIButton
                                    name={"Record Donation"}
                                    disabled={
                                        !(
                                            kycType?.trim() &&
                                            kycValue?.trim() &&
                                            accountType?.trim() &&
                                            accountSlug?.trim() &&
                                            donationType &&
                                            numYears > 0 &&
                                            amountPaid > 0
                                        )
                                    }
                                    variant={'contained'}
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
                                            getRecordDonation()
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </Modal >
                    <Modal
                        open={receiptDownload}
                        onClose={() => { setReceiptDownload(false); }}
                        sx={{
                            border: "0px solid transparent"
                        }}
                    >
                        <div style={{ ...style, width: '30%', height: '25%' }}>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "space-between",
                                    width: '100%',
                                    height: '30%',
                                    borderBottom: `1px solid ${colors.snowywhite}`,
                                }}
                            >
                                <span style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "24px",
                                    fontWeight: 600,
                                    textAlign: "left",
                                    lineHeight: "28px"

                                }}>
                                    Download Receipt
                                </span>
                                <button onClick={() => { setReceiptDownload(false); }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                    <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                </button>

                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: '100%',
                                    padding: '5px',
                                    marginTop: '20px',
                                    overflowY: "scroll",
                                    scrollbarWidth: 'none',
                                    height: '80%',
                                    gap: '20px'
                                }}
                            >
                                <PDFDownloadLink document={<DonationReceiptPDF data={pdfbody} />} fileName={`TSI_COOP-${pdfbody?.id}.pdf`} style={{
                                    width: '70%'
                                }}>
                                    {({ loading }) => (loading ? <TSIButton
                                        name={"loading"}
                                        variant={'contained'}
                                        padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                        load={false}
                                        disabled={true}
                                        isCustomColors={true}
                                        customOutlineColor={`1px solid ${colors.primary}`}
                                        customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                        customBgColorOnhover={colors.primary}
                                        customBgColor={colors.primary}
                                        customTextColorOnHover={colors.white}
                                        customTextColor={colors.white}
                                        handleClick={
                                            () => {

                                            }
                                        }
                                    /> : <TSIButton
                                        name={"Download"}
                                        variant={'contained'}
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

                                            }
                                        }
                                    />)}
                                </PDFDownloadLink>

                            </div>


                        </div>
                    </Modal >


                </div>
            </div >
        )
    }
    else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default AccountDetails
