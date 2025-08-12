import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Modal, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { calender, cityB, image, man, NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import SyncIcon from '@mui/icons-material/Sync';
import TSIApplicationCard from '../../common/Molecules/TSIApplicationCard';
import TSIJobAddModal from '../../common/Molecules/TSIJobAddModal';
import TSIConfirmationModal from '../../common/Molecules/TSIConfirmationModal';
import TSIInviteDiscussion from '../../common/Molecules/TSIInviteDiscussion';
import TSIMessage from '../../common/Molecules/TSIMessage';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIJobApplicantAddModal from '../../common/Molecules/TSIJobApplicantAddModal';
import { useNavigate } from 'react-router-dom';

const JobsProfessional = () => {
    const deviceType = useDeviceType()
    const role = localStorage.getItem("role")
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [selectedSort, setSelectedSort] = useState<any>(role == "PROFESSIONAL" ? "recommended_jobs" : "applications_received");
    const [jobOpen, setJobOpen] = useState<any>(false);
    const [jobApplicantOpen, setJobApplicantOpen] = useState<any>(false);
    const [jobId, setJobId] = useState<any>("");
    const [open, setOpen] = useState<any>(false);
    const [isRejection, setRejection] = useState<any>(false);
    const [isMessage, setIsMessage] = useState<any>(false);
    const [recommandedjobs, setRecommandedJobs] = useState<any>([]);
    const [applicationsReceived, setApplicationsReceived] = useState<any>([]);
    const [myApplications, setMyApplications] = useState<any>([]);
    const [businessjobs, setBusinessJobs] = useState<any>([]);
    const [jobData, setJobData] = useState<any>([]);
    const navigation = useNavigate()
    const [load, setLoad] = useState<any>(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const sortItems = [
        ...(role == "BUSINESS"
            ? [{ value: "Applications Received", slug: "applications_received" }, { value: "Posted Jobs", slug: "posted_jobs" },]
            : []),
        ...(role == "PROFESSIONAL"
            ? [{ value: "Recommended Jobs", slug: "recommended_jobs" }, { value: "My Applications", slug: 'my_applications' },]
            : []),
    ];
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loader, setLoader] = useState(false)
    const prevOpen = React.useRef(open);
    const anchorRef: any = React.useRef(null);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    const handleScroll = () => {
        const container = containerRef.current;
        if (container && hasMore && !load && !loader) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setCurrentPage((prev) => prev + 1);
            }
        }
    };

    const getJobsData = () => {
        setLoad(true)
        const body = {
            "_func": "get_professional_job_applications"
        }

        apiInstance.getJobs(body)
            .then((response: any) => {
                if (response.data) {
                    setMyApplications(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRecommandedJobsData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_jobs",
            "pg": currentPage
        }

        apiInstance.getRecommandedJOBS(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if(response.data.length < 5){
                            setHasMore(false);
                        }
                        setRecommandedJobs((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoader(false)
            })
            .catch((error: any) => {
                setLoader(false)
            });
    }

    const getApplicationReceivedData = () => {
        setLoad(true)
        const body = {
            "_func": "get_business_jobs"
        }

        apiInstance.getReceivedJobs(body)
            .then((response: any) => {
                if (response.data) {

                    setBusinessJobs(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }



    const getJobApplicatonData = () => {
        setLoad(true)
        const body = {
            "_func": "get_business_job_applications"
        }

        apiInstance.getRecommandedJOBS(body)
            .then((response: any) => {
                if (response.data) {
                    setApplicationsReceived(response.data)

                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }
    useEffect(() => {

        if (role == "PROFESSIONAL") {
            getRecommandedJobsData()
        }

    }, [currentPage])
    useEffect(() => {

        if (role == "PROFESSIONAL") {

            getJobsData()


        } else {
            getApplicationReceivedData()
            getJobApplicatonData()
        }


    }, [])
   


    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', backgroundColor: colors.lightPrimary, height: '92%' }}>
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
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", padding: '10px' }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                        }}>Jobs</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px',
                            padding: '10px'
                        }}>

                            {(selectedSort == "applications_received" || selectedSort == "posted_jobs") && (<TSIButton
                                name={"Add New"}
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
                                        // if (selectedSort == "posted_jobs" || selectedSort == "my_applications" ) {
                                        //     setJobApplicantOpen(true)
                                        // } else if (selectedSort == "applications_received" || selectedSort == "recommended_jobs") {
                                        setJobOpen(true)
                                        // }
                                    }
                                }
                            />)}
                        </div>
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "center", flexWrap: "wrap", borderBottom: `1px solid ${colors.snowywhite}`, }}>

                        {sortItems?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => { setSelectedSort(item.slug) }}
                                style={{
                                    margin: 0, padding: 8,
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "20px",
                                    textAlign: "left",
                                    textUnderlinePosition: "from-font",
                                    textDecorationSkipInk: "none",
                                    textTransform: 'capitalize',
                                    color: colors.brownCharcoal,
                                    cursor: "pointer",
                                    borderBottom: item?.slug == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`)
                                }}>
                                {item?.value}
                            </div>
                        ))}
                    </div>


                    {(selectedSort == "recommended_jobs") && (
                        recommandedjobs.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {recommandedjobs.map((post: any, index: any) => (
                                <div key={index} onClick={() => setJobData(post)} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>

                                    <TSIApplicationCard post={post} sideDisplay={false} apply={true} handleApply={() => {
                                        navigation(`/jobs/details?id=${post?.id}`)
                                    }}
                                        onHandleClick={() => { navigation(`/jobs/details?id=${post?.id}`) }}
                                    />
                                </div>
                            ))}
                             {(hasMore) && (<div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center", gap: '5px', scrollbarWidth: "none", }}>
                                <Button sx={{padding:'10px',}} onClick={() => { setCurrentPage(currentPage + 1) }}><SyncIcon sx={{ color: colors.primary }} /></Button>
                            </div>)}
                            {(loader) && (<div className="centered-container">
                                <div className="loader"></div>
                            </div>)}
                        </div>

                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )

                    )}

                    {(selectedSort == "my_applications") && (
                        myApplications.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", marginTop: '10px' }}>
                            {myApplications.map((post: any, index: any) => (
                                <div onClick={() => setJobData(post)} key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIApplicationCard post={{ ...post, "title": post?.job_title }} sideDisplay={false} handleApply={() => {
                                        navigation(`/jobs/applicationdetails?id=${post?.id}`)
                                    }}
                                        apply={false} onHandleClick={() => { }} />
                                </div>
                            ))}
                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )
                    )}
                </div>


                {(jobOpen) && (<TSIJobAddModal
                    isOpen={jobOpen}
                    setIsOpen={setJobOpen}
                    onSubmit={() => {
                        getApplicationReceivedData()
                        getRecommandedJobsData()
                        getJobApplicatonData()
                    }}
                    modaltitle={"Jobs"}
                    tree1Title={"Solutions"}
                    tree2Title={"Services"}
                    tree3Title={"Skills"}
                />)}

                {(jobApplicantOpen) && (<TSIJobApplicantAddModal
                    isOpen={jobApplicantOpen}
                    setIsOpen={setJobApplicantOpen}
                    onSubmit={() => { setJobApplicantOpen(false); }}
                    modaltitle={"Job Application"}
                    tree1Title={"Solutions"}
                    tree2Title={"Services"}
                    tree3Title={"Skills"}
                    jobId={jobId}
                    jobData={jobData}
                />)}


                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Job created successfully"}
                    buttonName={"Go to Home"}
                    image={success}
                    onSubmit={() => { setOpen(false) }}
                />
                <TSIConfirmationModal
                    open={isRejection}
                    title={"Reject Application"}
                    desc={"Are you sure you want to reject this application?"}
                    buttonName1={"No"}
                    buttonName2={"Yes, Reject"}
                    btn2Color={colors.saturatedRed}
                    onClick={() => { setRejection(false) }}
                />


                <TSIMessage
                    open={isMessage}
                    setIsOpen={setIsMessage}
                    title={"Invite Discussion"}
                    buttonName2={"Send"}
                    btn2Color={colors.primary}
                    onClick={() => { }}
                />


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

export default JobsProfessional
