import * as React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Checkbox, Modal, Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import colors from '../../../assets/styles/colors';
import { calender, category, cityB, community, enquires, industry, man, rfps, serB, services, solB, solutions, success, trB } from '../../../assets';
import TSIAccordion from '../../common/Atoms/TSIAccordion';
import apiInstance from '../../../services/authService';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import TSIPosts from '../../common/Molecules/TSIPosts';
import TSITextfield from '../../common/Atoms/TSITextfield';
import TSIButton from '../../common/Atoms/TSIButton';
import useDeviceType from '../../../Utils/DeviceType';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSICard from '../../common/Molecules/TSICard';
import TSIRFPAddModal from '../../common/Molecules/TSIRFPAddModal';
import TSIAddTrainingModal from '../../common/Molecules/TSIAddTrainingModal';
import TSITestimonialAddModal from '../../common/Molecules/TSITestimonialAddModal';
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import TSIPostFlagModal from '../../common/Molecules/TSIPostFlagModal';
const TSIOrgProfile = ({ }: any) => {
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({})
    const [searchParams] = useSearchParams();
    const deviceType = useDeviceType()
    const navigation = useNavigate()
    const [title, setTitle] = React.useState<any>("")
    const [query, setQuery] = React.useState<any>("")
    const [remainAnonomous, setRemainAnonomous] = React.useState<any>(false);
    const [open, setOpen] = React.useState(false)
    const [trainingOpen, setTrainingOpen] = React.useState<any>(false);
    const [testimonialOpen, setTestimonialOpen] = React.useState<any>(false);
    const [isEnquiry, setIsEnquiry] = React.useState<any>(false);
    const [isRfp, setIsRFP] = React.useState<any>(false);
    const [enquiryOptions, setEnquiryOptions] = React.useState<any>([]);
    const [enquirytype, setEnquiryType] = React.useState<any>([]);
    const role = localStorage.getItem("role");
    const admin = role === "ADMIN";
    const [isDetailFlagged, setIsDetailFlagged] = React.useState<any>(false);
    const [isFlag, setIsFlag] = React.useState<any>(false);
    const [comment, setComment] = React.useState<any>("");
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const id = searchParams.get("id");
    React.useEffect(() => {
        funcLookUp()
        if (id) {
            getOrgData()
        }
    }, [])
    const getOrgData = () => {
        setLoad(true)
        const body = {
            "_func": "get_org_profile",
            "account_slug": id
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
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                })

            });
    }



    const funcLookUp = () => {
        setLoad(true);

        const body = {
            "_func": "lookup",
            "type": "ENQUIRY_TYPE"
        }

        apiInstance.getLookUp(body)
            .then((response: any) => {
                if (response.data) {
                    setEnquiryOptions(response.data)
                }
            })
            .catch((error: any) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoad(false);
            });
    };

    const addEnquiresData = () => {
        setLoad(true)
        const email: any = localStorage.getItem("email");
        const domain = id;

        const body = {
            "_func": "add_enquiry",
            "enquiry_type": enquirytype,
            "title": title,
            "query": query,
            "to_businesses": [domain],
            "to_professionals": [],
            "discoverable": 0,
            "anonymous": remainAnonomous ? 1 : 0,
            "taxonomies_offered": [],
        }

        apiInstance.addEnquires(body)
            .then((response: any) => {
                if (response.data._added) {
                    setTitle("")
                    setQuery("")
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Enquires added successfull",
                    })
                    setIsEnquiry(false)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Enquires is unsuccesfull",
                    })
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                })
            });
    }

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '33%',
        padding: deviceType == "mobile" ? "15px" : "2%",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: '0px solid #000',
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const handlePostFlag = () => {
        setLoad(true)
        const flagbody = {
            "_func": "flag",
            "content_type": "NEW_ORG",
            "id": data?.basic_details?.id,
            "comments": comment
        }

        const unflagbody = {
            "_func": "unflag",
            "content_type": "NEW_ORG",
            "id": data?.basic_details?.id,
            "comments": comment
        }

        apiInstance.postFlag(isDetailFlagged ? unflagbody : flagbody)
            .then((response: any) => {
                if (response.data?._flagged) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Organisation is Flagged`,
                    })
                    setComment("")
                    setIsFlag(false)
                } else if (response.data?._flagged == false) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Organisation is UnFlagged`,
                    })
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: `Something went wrong`,
                    })
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                })
            });
    }

    return (
        <div style={{
            width: "100%"
            , height: "92%", backgroundColor: colors.lightPrimary, paddingTop: '5px', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '10px',
        }}>
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
            <div style={{ width: '100%', height: "100%", backgroundColor: colors.white, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '10px', borderRadius: '24px', }}>
                <div style={{ width: '100%', backgroundColor: colors.white, display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", padding: '10px' }}>
                    <button
                        onClick={() => { navigation(-1) }}
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
                        paddingLeft: "10px",
                        fontFamily: "OpenSans",
                        fontSize: "20px",
                        fontWeight: 600,
                        lineHeight: "32.68px",
                        textAlign: "left",
                        textTransform: 'capitalize'
                    }}>{data?.basic_details?.title || "NA"}</span>
                    {(admin) && (<button onClick={() => { setIsFlag(true) }} style={{ padding: 0, margin: 0, backgroundColor: "transparent", border: "0px solid transparent", cursor: "pointer" }}>
                        <FlagIcon sx={{ color: colors.primary }} />
                    </button>)}
                </div>
                {(!load) ? (<div style={{ width: '100%', height: "100%", overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px", paddingTop: '2px', fontSize: '14px', fontFamily: "OpenSans", }}>



                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '10px', gap: '10px', flexWrap: "wrap" }}>
                        {
                            [
                                data?.basic_details?.start_year ? { icon: calender, name: data?.basic_details?.start_year } : { icon: calender, name: null },
                                data?.basic_details?.num_employees ? { icon: man, name: data?.basic_details?.num_employees } : { icon: man, name: null },
                                data?.basic_details?.city ? { icon: cityB, name: data?.basic_details?.city } : { icon: cityB, name: null }
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
                                    <img src={item?.icon} style={{ width: '19px', height: '17px' }} /> {item?.name || <span style={{ color: colors.snowywhite }}>Not Available</span>}
                                </div>
                            ))
                        }

                        {
                            [
                                data?.basic_details?.category ? { icon: category, name: data?.basic_details?.category } : { icon: category, name: null },
                                data?.basic_details?.industry ? { icon: industry, name: data?.basic_details?.industry } : { icon: industry, name: null }
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
                                    <img src={item?.icon} style={{ width: '19px', height: '17px' }} /> {item?.name || <span style={{ color: colors.snowywhite }}>Not Available</span>}
                                </div>
                            ))
                        }
                    </div>

                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%' }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', width: deviceType == "mobile" ? "100%" : '70%' }}>
                            {(data?.basic_details?.about && data?.basic_details?.about !== "") && (<p style={{
                                margin: 0,
                                paddingLeft: "10px",
                                fontFamily: "OpenSans",
                                color: colors.lightgrey,
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "19.6px",
                                textAlign: 'left',
                            }}>{data?.basic_details?.about}</p>)}
                            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '10px', padding: '10px' }}>
                                <TSIAccordion icon={community} title={"Posts"} desc={""} />
                                <>
                                    {(data?.posts > 0) ? (
                                        data?.posts.map((item: any, index: any) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    if (item) {
                                                        navigation(`/posts/postdetails?id=${item.id}`)
                                                    }
                                                }}

                                                style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                            >
                                                <TSIPosts
                                                    key={index}
                                                    post={item}
                                                    iscommunity={true}
                                                    setClickedPost={{}}
                                                    setPostView={() => { }}
                                                    setIsEditPost={() => { }}
                                                    onSubmit={() => { }}
                                                    isCommentNeeded={false}
                                                    isProfile={true}
                                                />
                                            </div>
                                        ))
                                    ) : <span style={{ color: colors.snowywhite }}>Not Available</span>}
                                </>
                            </div>
                            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '10px', padding: '10px' }}>
                                <TSIAccordion icon={solB} title={"Solutions"} desc={""} />
                                <>
                                    {(data?.offerings?.solutions?.length > 0) ? (
                                        data?.offerings?.solutions.map((item: any, index: any) => (
                                            <TSICard
                                                post={item}
                                                type={""}
                                                setClickedPost={{}}
                                                onHandleClick={() => { navigation(`/solutions/details?id=${item?.id}`) }}
                                                setIsEditPost={() => { }}
                                                onEditClick={() => { }}
                                                isProfile={true}
                                            />
                                        ))
                                    ) : <span style={{ color: colors.snowywhite }}>Not Available</span>}
                                </>
                            </div>
                            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '10px', padding: '10px' }}>
                                <TSIAccordion icon={serB} title={"Services"} desc={""} />
                                <>
                                    {(data?.offerings?.services?.length > 0) ? (
                                        data?.offerings?.services.map((item: any, index: any) => (
                                            <TSICard
                                                post={item}
                                                type={""}
                                                setClickedPost={{}}
                                                onHandleClick={() => { navigation(`/services/details?id=${item?.id}`) }}
                                                setIsEditPost={() => { }}
                                                onEditClick={() => { }}
                                                isProfile={true}
                                            />
                                        ))
                                    ) : <span style={{ color: colors.snowywhite }}>Not Available</span>}
                                </>
                            </div>
                            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '10px', padding: '10px' }}>

                                <TSIAccordion icon={trB} title={"Training"} desc={""} />
                                <>
                                    {(data?.offerings?.trainings?.length > 0) ? (
                                        data?.offerings?.trainings.map((item: any, index: any) => (
                                            <TSICard
                                                post={item}
                                                type={""}
                                                setClickedPost={{}}
                                                onHandleClick={() => { navigation(`/training/details?id=${item?.id}`) }}
                                                setIsEditPost={() => { }}
                                                onEditClick={() => { }}
                                                isProfile={true}
                                            />
                                        ))
                                    ) : <span style={{ color: colors.snowywhite }}>Not Available</span>}
                                </>
                            </div>
                            {/* <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '10px', padding: '10px' }}>

                                <TSIAccordion icon={enquires} title={"Interests"} desc={""} />
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", width: '100%' }}>
                                    {
                                        data?.interests?.every((section: string[]) => section?.length === 0 || !section) ? (
                                            <p style={{ fontFamily: "OpenSans", fontSize: '14px', color: colors.snowywhite }}>Not Available</p>
                                        ) : (
                                            data?.interests && data.interests.length > 0 && (
                                                data.interests.map((section: string[], index: number) => (
                                                    <div key={index} style={{ fontFamily: "OpenSans", fontSize: '14px' }}>
                                                        {section.length > 0 && (
                                                            section.map((item: string, itemIndex: number) => (
                                                                <p
                                                                    key={itemIndex}
                                                                    style={{
                                                                        padding: 0,
                                                                        margin: 0,
                                                                        fontFamily: 'OpenSans',
                                                                        fontWeight: 400,
                                                                        fontSize: '14px',
                                                                        textAlign: "left",
                                                                        color: colors.graniteGrey
                                                                    }}
                                                                >
                                                                    {item}
                                                                </p>
                                                            )))}
                                                    </div>
                                                )
                                                )
                                            )
                                        )
                                    }
                                </div>
                            </div> */}
                        </div>
                        {(deviceType !== "mobile") && (<div style={{
                            display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', width: '30%', padding: '10px'
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '15px',
                                    backgroundColor: isEnquiry ? colors.primary : colors.white,
                                    border: `1px solid ${colors.primary}`,
                                    color: isEnquiry ? colors.white : colors.primary,
                                    fontWeight: 500,
                                    height: '35px',
                                    paddingLeft: "15px",
                                    paddingRight: '15px',
                                    width: "200px"
                                }}
                                onClick={() => {
                                    setIsEnquiry(true)
                                }}
                            >
                                Send Enquiry
                            </div>
                            {(role !== "PROFESSIONAL" && role !== "NEW_PROFESSIONAL") && (<div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '15px',
                                    backgroundColor: isRfp ? colors.primary : colors.white,
                                    border: `1px solid ${colors.primary}`,
                                    color: isRfp ? colors.white : colors.primary,
                                    fontWeight: 500,
                                    height: '35px',
                                    paddingLeft: "15px",
                                    paddingRight: '15px',
                                    width: "200px"
                                }}
                                onClick={() => {
                                    setIsRFP(true)
                                }}
                            >
                                Send RFP
                            </div>)}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '15px',
                                    backgroundColor: testimonialOpen ? colors.primary : colors.white,
                                    border: `1px solid ${colors.primary}`,
                                    color: testimonialOpen ? colors.white : colors.primary,
                                    fontWeight: 500,
                                    height: '35px',
                                    paddingLeft: "15px",
                                    paddingRight: '15px',
                                    width: "200px"
                                }}
                                onClick={() => {
                                    setTestimonialOpen(true)
                                }}
                            >
                                Send Testimonial
                            </div>


                        </div>)}
                    </div>

                    {(trainingOpen) && (<TSIAddTrainingModal
                        isOpen={trainingOpen}
                        setIsOpen={setTrainingOpen}
                        edit={false}
                        editablePost={{}}
                        title={"Training"}
                    />)}

                    {(testimonialOpen) && (<TSITestimonialAddModal
                        isOpen={testimonialOpen}
                        setIsOpen={setTestimonialOpen}
                        onSubmit={() => {

                        }}
                        modaltitle={"Enquiries"}
                        tree1Title={"Enquiries Tags"}
                        tree2Title={"Skills Offered"}
                        discoverable={1}
                        isSolutionScreen={false}
                        isServiceScreen={false}
                        isTrainingScreen={false}
                    />)}

                    {(isRfp) && (<TSIRFPAddModal
                        isOpen={isRfp}
                        setIsOpen={setIsRFP}
                        onSubmit={() => { setIsRFP(false); setOpen(true) }}
                        modaltitle={"RFP"}
                        isRFPScreen={false}
                        isSolutionScreen={false}
                        isServiceScreen={false}
                        isTrainingScreen={false}
                    />)}

                    <TSIPopup
                        isOpen={open}
                        setIsOpen={setOpen}
                        text1={"Success"}
                        text2={"Submited successfully"}
                        buttonName={"Okay"}
                        image={success}
                        onSubmit={() => { setOpen(false); }}
                    />

                    <TSIPostFlagModal
                        isOpen={isFlag}
                        setIsOpen={() => { setIsFlag(false); setComment("") }}
                        comment={comment}
                        setComment={setComment}
                        onSubmit={() => { handlePostFlag() }}
                    />

                    <Modal
                        open={isEnquiry}
                        onClose={() => { setIsEnquiry(false); }}
                        sx={{
                            border: "0px solid transparent"
                        }}
                    >
                        <div style={{ ...style, }}>

                            <div style={{
                                display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", width: '100%', borderRadius: '12px', padding: '10px', gap: '20px'
                            }}>
                                <div style={{
                                    display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", width: '100%',
                                }}>
                                    <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "20px",
                                        fontWeight: 600,
                                        lineHeight: "28px",
                                        letterSpacing: "0.5px",
                                        textAlign: "left",
                                        color: colors.black,
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        Send Enquiry
                                    </p>
                                    <button onClick={() => { setIsEnquiry(false) }} style={{ width: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                        <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                    </button>
                                </div>

                                <TSISingleDropdown
                                    name={"Enquiry Type"}
                                    setFieldValue={setEnquiryType}
                                    fieldvalue={enquirytype}
                                    dropdown={enquiryOptions?.map((item: any) => item.value)}
                                />
                                <TSITextfield
                                    title={"Title"}
                                    placeholder={"Enter Title"}
                                    value={title}
                                    isRequired={true}
                                    type={"text"}
                                    name={"field"}
                                    handleChange={(event: any) => { setTitle(event.target.value) }}
                                />

                                <TSITextfield
                                    title={"Query"}
                                    placeholder={"Enter Query"}
                                    value={query}
                                    isRequired={true}
                                    type={"text"}
                                    name={"field"}
                                    multiline={true}
                                    rows={4}
                                    handleChange={(event: any) => { setQuery(event.target.value) }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '20px',
                                        width: '100%',
                                    }}
                                >
                                    <Checkbox
                                        checked={remainAnonomous}
                                        onChange={(event) => { setRemainAnonomous(event.target.checked); }}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: colors.primary,
                                            },
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    <span style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        lineHeight: "25.2px",
                                        textAlign: "left",
                                        color: colors.black
                                    }}>
                                        Remain Anonymous?

                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: '100%' }}>
                                    <TSIButton
                                        name={"Submit"}
                                        disabled={!title || !query}
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
                                                if (title && query) {
                                                    addEnquiresData()
                                                } else if (!title) {
                                                    setSnackbar({
                                                        open: true,
                                                        severity: 'error',
                                                        message: "Title is Required",
                                                    })
                                                } else if (!title) {
                                                    setSnackbar({
                                                        open: true,
                                                        severity: 'error',
                                                        message: "Query is Required",
                                                    })
                                                }
                                            }
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal>

                </div>) : (
                    <div className="centered-container">
                        <div className="loader"></div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default TSIOrgProfile
