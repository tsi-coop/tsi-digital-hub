import * as React from 'react';
import Popover from '@mui/material/Popover';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar } from '@mui/material';
import colors from '../../../assets/styles/colors';
import { calender, category, enquires, industry, man, rfps, services, solutions } from '../../../assets';
import TSIAccordion from '../Atoms/TSIAccordion';
import apiInstance from '../../../services/authService';
const TSIOrgPopup = ({ postedBy }: any) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({})
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        getOrgData()
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const getOrgData = () => {
        setLoad(true)
        const email: any = localStorage.getItem("email")
        const getDomainFromEmail = () => email.split("@")[1] || null;
        const body = {
            "_func": "get_org_profile",
            "account_slug": getDomainFromEmail()
        }
        apiInstance.viewORG(body)
            .then((response: any) => {
                if (response.data) {

                    setData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)

            });
    }

    return (
        <div>
            <Avatar
                onClick={handleClick}
                sx={{
                    bgcolor: colors.lightywhite,
                    width: '44px',
                    height: '44px',
                    cursor: 'pointer',
                }}>

                <span style={{
                    fontFamily: "OpenSans",
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "28px",
                    textTransform: "capitalize",
                    color: colors.black
                }}>{postedBy?.charAt(0)}</span>
            </Avatar>
            {(open) && (<Popover
                id={'simple-popover'}
                open={open}
                sx={{
                    boxShadow: "none",
                    borderRadius: '15px',
                    scrollbarWidth: 'none',
                    "& .MuiPopover-paper": {
                        borderRadius: "15px",
                        border: `0.5px solid ${colors.grey80}`,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        width: 500,
                        height: 400,
                        scrollbarWidth: 'none',
                    },
                }}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '10px', paddingBottom: '0px', height: '50px' }}>
                    <button
                        onClick={() => { handleClose() }}
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

                </div>
                {(!load) ? (<div style={{ width: '100%', height: '350px', overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '10px', paddingTop: '2px' }}>
                    <p style={{
                        margin: 0,
                        paddingBottom: "10px",
                        fontFamily: "OpenSans",
                        fontSize: "40px",
                        fontWeight: 600,
                        lineHeight: "32.68px",
                        textAlign: "left",
                        textUnderlinePosition: "from-font",
                        textDecorationSkipInk: "none",
                    }}>{data?.basic_details?.org_name}</p>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '10px', gap: '10px' }}>
                        {
                            [
                                data?.basic_details?.start_year ? { icon: calender, name: data?.basic_details?.start_year } : null,
                                data?.basic_details?.num_employees ? { icon: man, name: data?.basic_details?.num_employees } : null
                            ]?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "4px 10px",
                                        borderRadius: "8px",
                                        backgroundColor: colors.mintWhisper,
                                        color: colors.darkblack,
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        lineHeight: "20px",
                                        letterSpacing: "0.16px",
                                        textAlign: "center",
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <img src={item?.icon} style={{ width: '19px', height: '17px' }} /> {item?.name}
                                </div>
                            ))
                        }
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '10px', gap: '10px' }}>
                        {
                            [
                                data?.basic_details?.category ? { icon: category, name: data?.basic_details?.category } : null,
                                data?.basic_details?.industry ? { icon: industry, name: data?.basic_details?.industry } : null
                            ]?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "4px 10px",
                                        color: colors.darkblack,
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        lineHeight: "20px",
                                        letterSpacing: "0.16px",
                                        textAlign: "center",
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <img src={item?.icon} style={{ width: '19px', height: '17px' }} /> {item?.name}
                                </div>
                            ))
                        }
                    </div>

                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", gap: '10px', width: '100%' }}>
                        <TSIAccordion icon={solutions} title={"Solutions"} desc={
                            <>
                                {(data?.interests?.solutions_interested) && (
                                    data?.interests?.solutions_interested.map((item: any, index: any) => (
                                        <p key={index} style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{item}</p>
                                    ))
                                )}
                            </>
                        } />

                        <TSIAccordion icon={services} title={"Services"} desc={
                            <>
                                {(data?.interests?.services_interested) && (
                                    data?.interests?.services_interested.map((item: any, index: any) => (
                                        <p key={index} style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{item}</p>
                                    ))
                                )}
                            </>
                        } />

                        <TSIAccordion icon={enquires} title={"Enquires"} desc={
                            <>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 600, fontSize: '14px' }}>Title</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{data?.rfps?.title || "NA"}</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 600, fontSize: '14px' }}>Expiry</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{data?.rfps?.expiry || "NA"}</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 600, fontSize: '14px' }}>Summary</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{data?.rfps?.summary || "NA"}</p>
                            </>
                        } />

                        <TSIAccordion icon={rfps} title={"RFP"} desc={
                            <>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 600, fontSize: '14px' }}>Title</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{data?.rfps?.title || "NA"}</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 600, fontSize: '14px' }}>Expiry</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{data?.rfps?.expiry || "NA"}</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 600, fontSize: '14px' }}>Summary</p>
                                <p style={{ padding: 0, margin: 0, fontFamily: "OpenSans", fontWeight: 400, fontSize: '14px' }}>{data?.rfps?.summary || "NA"}</p>
                            </>
                        } />
                    </div>

                </div>) : (
                    <div style={{ width: '100%', height: '350px', overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '10px', paddingTop: '2px' }}>
                        <div className="centered-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                )}

            </Popover>)}
        </div>
    )
}

export default TSIOrgPopup
