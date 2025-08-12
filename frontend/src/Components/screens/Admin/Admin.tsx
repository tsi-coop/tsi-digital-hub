import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIButton from '../../common/Atoms/TSIButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import apiInstance from '../../../services/authService';
import TSIReviewCard from '../../common/Molecules/TSIReviewCard';
import TSIDashboard from '../../common/Molecules/TSIDashboard';
import { Autocomplete, Avatar, Button, IconButton, Paper, TextField, Snackbar, Modal, TableBody, TableContainer, Table, TableRow, TableCell, TableHead, TablePagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import { useLocation, useNavigate } from 'react-router-dom';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIConfirmationModal from '../../common/Molecules/TSIConfirmationModal';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../../common/Atoms/TSITextfield';
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SupportCard from '../../common/Atoms/SupportCard';
const Admin = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const location = useLocation();
    const [load, setLoad] = useState<any>(false);
    const [isOpen, setIsOpen] = useState<any>(false);
    const [selectedSort, setSelectedSort] = useState<any>("dashboard");
    const [selectedPost, setSelectedPost] = useState<any>({});
    const [selected, setSelected] = useState<any>("Company Profile");
    const [reviews, setReviews] = useState([])
    const [account, setAccount] = useState<any>([])
    const [dashboard, setDashboard] = useState([])
    const [query, setQuery] = useState<any>("");
    const [ambAccountSlug, setAmbAccountSlug] = useState<any>("");
    const [reviewContent, setReviewContent] = useState<any>([])
    const [selectedRole, setSelectedRole] = useState<any>("BUSINESS");
    const [addUser, setAddUser] = useState<any>(false);
    const [userType, setUserType] = useState<any>("Business");

    const [name, setName] = useState<any>("");
    const [about, setAbout] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [startYear, setStartYear] = React.useState<any>("");
    const [indVerticles, setIndVerticles] = React.useState<any>([]);
    const [indSubtypes, setIndSubtypes] = React.useState<any>([]);
    const [categoryValues, setCategoryValues] = React.useState<any>([]);
    const [states, setStates] = React.useState<any>([]);
    const [stateCities, setStateCities] = React.useState<any>([]);
    const [numberOfEmployees, setNumberOfEmployees] = useState([]);
    const [numberofEmp, setNumberofEmp] = React.useState("");
    const [industry, setIndustry] = React.useState('');
    const [category, setCategory] = React.useState("");
    const [subtype, setSubType] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState<any>({});
    const [organisation, setOrganisation] = React.useState("");
    const [support, setSupport] = useState<any[]>([]);
    const [status, setStatus] = useState("OPEN")
    const [changingstatus, setChangingStatus] = useState("OPEN")
    const [openChangeReqModal, setOpenChangeReqModal] = useState(false)
    const [rowData, setRowData] = useState<any>({})
    const [loginDetails, setLoginDetails] = useState<any>({
        "open": false,
        "accountType": "",
        "accountSlug": ""
    });
    const [kycDetails, setKycDetails] = useState<any>({
        "open": false,
        "accountType": "",
        "accountSlug": ""
    });
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const [communitySorting, setCommunitySorting] = React.useState<any>([
        {
            "value": "Dashboard",
            "slug": "dashboard"
        },
        // {
        //     "value": "Pending Reviews",
        //     "slug": "pending_reviews"
        // },
        // {
        //     "value": "Reviews",
        //     "slug": "reviews"
        // },

        {
            "value": "Account",
            "slug": "account"
        },
        {
            "value": "Support",
            "slug": "support"
        },
        // {
        //     "value": "Reports",
        //     "slug": "reports"
        // },
        // {
        //     "value": "Configurations",
        //     "slug": "configurations"
        // },
    ]);

    const data = [
        { name: "Company Profile" },
        { name: "Solutions" },
        { name: "Services" },
    ]

    const getData = (body: any, setState: any) => {
        setLoad(true);

        apiInstance.getLookUp(body)
            .then((response: any) => {
                if (response.data) {
                    setState(response.data);
                }
            })
            .catch((error: any) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoad(false);
            });
    };

    const fetchData = (body: object, setData: React.Dispatch<React.SetStateAction<any>>, successMessage: string = "") => {
        setLoad(true);
        apiInstance.getGetOptions(body)
            .then((response: any) => {
                setLoad(false);
                if (response.status === 200 && response.data) {
                    setData(response.data);
                    if (successMessage) {
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            message: successMessage,
                        });
                    }
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: response.data?.code || "Something went wrong",
                    });
                }
            })
            .catch((error: any) => {
                setLoad(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error?.message || "Something went wrong",
                });
            });
    };

    React.useEffect(() => {
        fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);
        getData({ "_func": "lookup", "type": "ORG_NUM_EMP_RANGE" }, setNumberOfEmployees);
        getData({ "_func": "lookup", "type": "ORG_CATEGORY" }, setCategoryValues);
        fetchData({ "_func": "get_state_list" }, setStates);
    }, [])

    const getPendingReviewData = () => {
        setLoad(true)
        const body = {
            "_func": "get_pending_reviews"
        }
        apiInstance.getPendingReview(body)
            .then((response: any) => {
                if (response.data) {
                    setReviews(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }
    const giveReview = (body: any) => {
        setLoad(true)
        apiInstance.getPendingReview(body)
            .then((response: any) => {
                if (response.data) {
                    setReviews(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }
    const getDashboardData = () => {
        setLoad(true)
        const body = {
            "_func": "get_pending_reviews"
        }
        apiInstance.getReviewContent(body)
            .then((response: any) => {
                if (response.data) {
                    setDashboard(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getReviewContentData = (id: any, type: any) => {
        setLoad(true)
        const body = {
            "_func": "get_review_content",
            "content_type": type,
            "id": id
        }

        apiInstance.getReviewContent(body)
            .then((response: any) => {
                if (response.data) {
                    setReviewContent(response.data)
                    setIsOpen(!isOpen)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }



    const getKycDetails = (body: any) => {
        setLoad(true)
        apiInstance.getKYC(body)
            .then((response: any) => {
                if (response.data) {
                    setKycDetails({
                        "open": false,
                        "accountType": "",
                        "accountSlug": ""
                    })
                    navigate(`/admin/accountDetails?account_type=${body.account_type}&account_slug=${body?.account_slug}`);

                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }


    const postAssist = () => {
        setLoad(true)
        const body = {
            "_func": "assist",
            "account_type": loginDetails?.accountType,
            "account_slug": loginDetails?.accountSlug
        }
        apiInstance.postAccount(body)
            .then((response: any) => {
                if (response.data) {
                    localStorage.setItem("token", response.data._token)
                    localStorage.setItem("role", response.data._system)
                    localStorage.setItem("email", response.data?._email)
                    localStorage.setItem("name", response.data._name)
                    setLoginDetails({
                        "open": false,
                        "accountType": "",
                        "accountSlug": ""
                    })
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: 'Login updated',
                    });
                    setTimeout(() => {
                        navigate("/community");
                    }, 1000);
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: 'No response',
                    });
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                });
            });
    }

    const getSearchData = () => {
        setLoad(true);

        let body;
        let apiCall;

        if (selectedRole === "BUSINESS") {
            body = {
                "_func": "search_organizations",
                "q": query
            };
            apiCall = apiInstance.getsearchorg;
        } else if (selectedRole === "PROFESSIONAL" || selectedRole === "AMBASSADOR") {
            body = {
                "_func": "search_professionals",
                "q": query
            };
            apiCall = apiInstance.getsearchTalent;
        } else {
            console.error("Invalid role selected");
            setLoad(false);
            return;
        }

        apiCall(body)
            .then((response: any) => {
                if (response.data) {
                    setAccount(response.data);
                }
            })
            .catch((error: any) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoad(false);
            });
    };

    const getAdminSupportData = (status: any) => {
        setLoad(true);
        const body = {
            "_func": "get_support_requests_by_status",
            "status": status
        };

        apiInstance
            .postAccount(body)
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


    const getAdminRoleChangingData = (id: any, status: any) => {
        setLoad(true);
        const body = {
            "_func": "change_support_request_status",
            "id": id,
            "status": status
        };

        apiInstance
            .postAccount(body)
            .then((response: any) => {
                if (response.data._changed) {
                    getAdminSupportData(1)
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Status Changed"
                    })
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sortParam = searchParams.get('sort');
        if (sortParam) setSelectedSort(sortParam);
    }, [location.search]);

    useEffect(() => {
        getAdminSupportData(1)
        // getPendingReviewData()
        // getReviewContentData()
    }, [])

    const userData = [
        {
            key: "Industry",
            value: reviewContent?.industry
        },
        {
            key: "Category",
            value: reviewContent?.category
        },
        {
            key: "No. of Employees",
            value: reviewContent?.num_employees
        },
        {
            key: "State",
            value: reviewContent?.state
        },
        {
            key: "City",
            value: reviewContent?.city
        },
    ]

    const Style: any = {
        fontFamily: "OpenSans",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: "0.5px",
        textAlign: "left",
        margin: 0,
        padding: 0,
        color: colors.lightgrey
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

    const getItemByValue = (array: any, value: any) => {
        const item = array.find((item: any) => item.value === value);
        return item ? item : null;
    };

    React.useEffect(() => {
        if (industry) {
            const itemkey: any = getItemByValue(indVerticles, industry)
            fetchData({ "_func": "get_industry_subtypes", "industry_slug": itemkey?.key }, setIndSubtypes);
        }
    }, [industry])

    React.useEffect(() => {
        if (state?.key) {
            fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
        }
    }, [state])



    const handleOnBoarding = () => {
        setLoad(true)

        const industrykey: any = getItemByValue(indVerticles, industry)
        const numofEmpkey: any = getItemByValue(numberOfEmployees, numberofEmp)
        const citykey: any = getItemByValue(stateCities, city)
        const categorykey: any = getItemByValue(categoryValues, category)

        const ambassadorbody = {
            "_func": "add_ambassador_from_backend",
            "account_type": "AMBASSADOR",
            "name": name,
            "about": about,
            "email": email,
            "solutions_interested": [],
            "services_interested": [],
            "trainings_interested": [],
            "skills_interested": []
        }

        const businessbody = {
            "_func": "add_business_from_backend",
            "email": email,
            "industry": industrykey?.key,
            "category": categorykey?.slug,
            "business_name": organisation,
            "name": name,
            "about": about,
            "start_year": parseInt(startYear),
            "num_employees": numofEmpkey?.slug,
            "state": state?.key,
            "city": citykey?.key,
            "solutions_interested": [],
            "services_interested": [],
            "trainings_interested": [],
            "skills_interested": []
        }


        apiInstance.addOnboardingAccount(userType == "Business" ? businessbody : ambassadorbody)
            .then((response: any) => {
                if (response.data._created) {
                    setLoad(false)
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: userType == "Business" ? "Onboarding Business successfull" : "Onboarding Ambassador successfull",
                    })
                    setAddUser(false)
                } else {
                    setLoad(false)
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: response?.data?.error || "Something went wrong with Onboarding",
                    })
                }

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

    const isBusinessUser = userType === "Business";

    const isFormValid = () => {
        const commonValid = userType && name && about && email;

        if (!commonValid) return false;

        if (isBusinessUser) {
            return (
                organisation &&
                industry &&
                subtype &&
                category &&
                numberofEmp &&
                state?.value &&
                city &&
                startYear
            );
        }

        return true;
    };

    const handleSortClick = (slug: string) => {

        const searchParams = new URLSearchParams(location.search);
        searchParams.set('sort', slug);

        navigate(`${location.pathname}?${searchParams.toString()}`);
        setSelectedSort(slug);
    };

    const getAmbassadorData = () => {
        setLoad(true)
        const body = {
            "_func": "get_ambassador_profile",
            "account_slug": ambAccountSlug
        }
        apiInstance.getAmbassador(body)
            .then((response: any) => {
                if (response.data) {
                    if (response?.data?.basic_details?.name && response?.data?.basic_details?.id) {
                        setAccount([
                            {
                                posted_by_account_slug: ambAccountSlug,
                                account_type: "AMBASSADOR",
                                city: "",
                                time_ago: "",
                                about: response?.data?.basic_details?.about || null,
                                posted_by_account_type: "AMBASSADOR",
                                posted_by: "Cross7",
                                org_name: response?.data?.basic_details?.name || null,
                            }
                        ]);
                    } else {
                        setSnackbar({
                            open: true,
                            severity: 'error',
                            message: 'Currently it is showing a dummy item with null values',
                        })
                    }
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)

            });
    }

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

                {(!isOpen) && (<div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", padding: '10px', gap: "10px" }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                        }}>Admin</p>


                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: (deviceType == "small-tablet" || deviceType == "mobile") ? "column" : 'row', justifyContent: (deviceType == "small-tablet" || deviceType == "mobile") ? "space-between" : "flex-start", alignItems: "flex-end", borderBottom: `1px solid ${colors.snowywhite}`, gap: '10px' }}>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', ...((deviceType == "small-tablet" || deviceType == "mobile") ? { width: "100%" } : {}), ...((deviceType == "mobile" || deviceType == "small-tablet") ? {} : { height: "40px" }) }}>
                            {[...communitySorting]?.map((item: any, index: any) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        // setSelectedSort(item.slug)
                                        handleSortClick(item.slug)
                                    }}
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
                                        height: '40px',
                                        borderBottom: item?.slug == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`),
                                    }}>
                                    {item?.value}
                                </div>
                            ))}
                        </div>


                    </div>
                    {(selectedSort == "dashboard") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '20px', gap: '10px' }}>
                        <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            <TSIDashboard />
                        </div>
                    </div>)}
                    {(selectedSort == "pending_reviews") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px', gap: '10px' }}>
                        {reviews.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {reviews.map((post: any, index) => (
                                <div key={index} onClick={() => {
                                    setSelectedPost(post);
                                }} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIReviewCard post={post} onHandleClick={() => { getReviewContentData(post?.id, post?.content_type) }} />
                                </div>
                            ))}
                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}
                    {(selectedSort == "reviews") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px', gap: '10px' }}>
                        {reviewContent.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {reviewContent.map((post: any, index: any) => (
                                <div key={index} onClick={() => { setSelectedPost(post); setIsOpen(!isOpen) }} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIReviewCard post={post} />
                                </div>
                            ))}
                        </div>
                        ) : (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                            <img src={NoData} />
                        </div>)}
                    </div>)}
                    {(selectedSort == "membership") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '20px', gap: '10px' }}>
                        {reviews.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {reviews.map((post, index) => (
                                <div key={index} onClick={() => { setSelectedPost(post); setIsOpen(!isOpen) }} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIReviewCard post={post} />
                                </div>
                            ))}
                        </div>
                        ) : (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                            <img src={NoData} />
                        </div>)}
                    </div>)}

                    {(selectedSort == "account") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '20px', gap: '10px' }}>

                        {(selectedSort == "account") ? (<div style={{ display: 'flex', flexDirection: (deviceType == "small-tablet" || deviceType == "mobile") ? "column" : "row", justifyContent: (deviceType == "small-tablet" || deviceType == "mobile") ? "flex-start" : "flex-start", alignItems: "center", width: "100%", gap: '10px', flexWrap: "wrap" }}>
                            <Autocomplete
                                id="tags-outlined"
                                options={["BUSINESS", "PROFESSIONAL", "AMBASSADOR"]}
                                size="small"
                                value={selectedRole}
                                onChange={(event: any, value: any[]) => { setSelectedRole(value); setQuery("") }}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={""}
                                        placeholder={"Select Role"}
                                        sx={{
                                            fontSize: "12px",
                                            '& .MuiInputBase-input': {
                                                fontSize: "12px",
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                fontSize: "12px",
                                            }
                                        }}
                                    />
                                )}
                                sx={{
                                    p: '2px 4px',
                                    color: "#000",
                                    fontSize: "12px",
                                    width: (deviceType == "mobile" || deviceType == "small-tablet") ? "100%" : '200px',
                                    border: `0px solid ${colors.primary}`,
                                    borderRadius: "30px",
                                    backgroundColor: "#E6F1EE",
                                    height: "35px",
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            fontSize: "12px",
                                            borderColor: colors.primary,
                                            borderRadius: "30px",
                                            height: "40px",
                                            border: `0px solid ${colors.primary}`,
                                        },
                                        '&:hover fieldset': {
                                            fontSize: "12px",
                                            borderColor: colors.primary,
                                            border: `0px solid ${colors.primary}`,
                                            borderRadius: "30px",
                                        },
                                        '&.Mui-focused fieldset': {
                                            fontSize: "12px",
                                            border: `0px solid ${colors.primary}`,
                                            borderRadius: "30px",
                                        },
                                    },
                                }}
                            />


                            {(selectedRole == "AMBASSADOR") ? (<div style={{
                                display: 'flex',
                                flexDirection: "row",
                                alignItems: 'center',
                                justifyContent: "flex-start",
                                gap: '10px',
                                ...((deviceType == "mobile" || deviceType == "small-tablet") ? { width: "100%" } : {})
                            }}>
                                <Paper
                                    component="form"
                                    sx={{ p: '2px 4px', paddingLeft: '10px', borderRadius: "30px", height: "35px", display: 'flex', alignItems: 'center', width: (deviceType == "small-tablet" || deviceType == "mobile") ? ((query && query?.length > 0) ? "80%" : "100%") : 200, border: "0px solid transparent", boxShadow: "none", backgroundColor: "#E6F1EE" }}
                                >

                                    <input
                                        style={{ marginLeft: 1, flex: 1, border: "0px solid transparent", backgroundColor: "transparent", fontSize: "14px", outline: "none", }}
                                        placeholder="Account Slug"
                                        value={ambAccountSlug}
                                        onChange={(e) => setAmbAccountSlug(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && ambAccountSlug?.length > 0) {
                                                e.preventDefault();
                                                getAmbassadorData()
                                            }
                                        }}
                                    />


                                </Paper>
                                {(ambAccountSlug) && (<div
                                    onClick={() => {
                                        getAmbassadorData()
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        padding: '10px',
                                        borderRadius: '30px',
                                        backgroundColor: colors.primary,
                                        color: colors.white,
                                        height: '40px',
                                        paddingLeft: "15px",
                                        paddingRight: '15px',
                                        width: "40px"
                                    }}>
                                    <SearchIcon />
                                </div>)}
                            </div>) : (<div style={{
                                display: 'flex',
                                flexDirection: "row",
                                alignItems: 'center',
                                justifyContent: "flex-start",
                                gap: '10px',
                                ...((deviceType == "mobile" || deviceType == "small-tablet") ? { width: "100%" } : {})
                            }}>
                                {(selectedRole) && (<Paper
                                    component="form"
                                    sx={{ p: '2px 4px', borderRadius: "30px", display: 'flex', alignItems: 'center', width: (deviceType == "small-tablet" || deviceType == "mobile") ? ((query && query?.length > 0) ? "80%" : "100%") : 200, border: "0px solid transparent", boxShadow: "none", backgroundColor: "#E6F1EE" }}
                                >
                                    <IconButton type="button" sx={{ p: '5px' }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                    <input
                                        style={{ marginLeft: 1, flex: 1, border: "0px solid transparent", backgroundColor: "transparent", fontSize: "14px", outline: "none", }}
                                        placeholder="Search Org / Prof"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && query?.length > 0) {
                                                e.preventDefault();
                                                getSearchData()
                                            }
                                        }}

                                    />


                                </Paper>)}
                                {(query) && (<div
                                    onClick={() => {
                                        getSearchData()
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        padding: '10px',
                                        borderRadius: '30px',
                                        backgroundColor: colors.primary,
                                        color: colors.white,
                                        height: '40px',
                                        paddingLeft: "15px",
                                        paddingRight: '15px',
                                        width: "40px"
                                    }}>
                                    <SearchIcon />
                                </div>)}
                            </div>)}

                            <div style={{
                                display: 'flex',
                                flexDirection: (deviceType == "mobile") ? "column" : "row",
                                alignItems: 'center',
                                justifyContent: "flex-start",
                                gap: '10px',
                                width: (deviceType == "small-tablet" || deviceType == "mobile") ? "100%" : "auto"
                            }}>

                                <TSIButton
                                    name={"New Business / Ambassador"}
                                    variant={'outlined'}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                    load={false}
                                    leadingIcon={<AddIcon sx={{ width: "20px" }} />}
                                    isCustomColors={true}
                                    customOutlineColor={`1px solid ${colors.primary}`}
                                    customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                    customBgColorOnhover={colors.white}
                                    customBgColor={colors.white}
                                    customTextColorOnHover={colors.primary}
                                    customTextColor={colors.primary}
                                    handleClick={
                                        () => {
                                            setName("")
                                            setAbout("")
                                            setEmail("")
                                            setStartYear("")
                                            setNumberofEmp("")
                                            setIndustry("")
                                            setCategory("")
                                            setSubType("")
                                            setCity("")
                                            setState("")
                                            setOrganisation("")
                                            setAddUser(true)
                                            setUserType("Business")
                                        }
                                    }
                                />
                            </div>
                        </div>) : (<></>)}



                        {account.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {account.map((post: any, index: any) => (
                                <div key={index} onClick={() => { }} style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "center", alignItems: "center", borderBottom: `1px solid ${colors.snowywhite}`, padding: '10px', gap: '5px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                                            <Avatar
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    // navigation(`/organisations/postdetails?id=${post?.posted_by_account_slug}`)
                                                }}
                                                sx={{
                                                    bgcolor: colors.lightywhite,
                                                    width: '44px',
                                                    height: '44px',
                                                    cursor: 'pointer',
                                                    fontFamily: 'OpenSans'
                                                }}>

                                                <span style={{
                                                    fontFamily: "OpenSans",
                                                    fontSize: "16px",
                                                    fontWeight: 500,
                                                    lineHeight: "28px",
                                                    color: colors.black,
                                                    textTransform: "capitalize"
                                                }}>{post?.posted_by?.charAt(0)}</span>
                                            </Avatar>
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>
                                                <p style={{
                                                    margin: 0, padding: 0,
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    lineHeight: "19.07px",
                                                    textAlign: 'left',
                                                    fontFamily: "OpenSans",
                                                    textTransform: "capitalize"
                                                }}>{post?.org_name || post?.posted_by}</p>
                                                <span style={{
                                                    color: colors.lightgrey,
                                                    fontSize: "14px",
                                                    fontWeight: 400,
                                                }}>{post?.city || "NA"} {(post?.city && post?.time_ago) && "•"} {post?.time_ago}</span>


                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "25px" }}>
                                            <button
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
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {

                                                    navigate(`/admin/accountDetails?account_type=${post?.posted_by_account_type}&account_slug=${post?.posted_by_account_slug}&org_name=${post?.org_name}`);
                                                }}
                                            >
                                                <CreditCardIcon sx={{ width: '20px', height: "20px" }} />
                                            </button>
                                            <button
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
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    setLoginDetails({
                                                        "open": true,
                                                        "accountType": post?.posted_by_account_type,
                                                        "accountSlug": post?.posted_by_account_slug
                                                    })

                                                }}
                                            >
                                                <LoginIcon sx={{ width: '20px', height: "20px" }} />
                                            </button>
                                        </div>
                                    </div>


                                    <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        lineHeight: "19.6px",
                                        color: colors.graniteGrey,
                                        textAlign: "left",
                                        margin: 0,
                                        padding: 0,
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        width: '100%'
                                    }}>{post?.about}</p>

                                </div>
                            ))}
                        </div>
                        ) : (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                            <img src={NoData} />
                        </div>)}
                    </div>)}

                    {(selectedSort == "support") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", padding: '20px', gap: '10px' }}>
                        <div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: 'flex-end', alignItems: "center", }}>
                            <div style={{ display: 'flex', width: (deviceType == "mobile" || deviceType == "small-tablet") ? "100%" : '25%', flexDirection: "row", justifyContent: "flex-end", alignItems: "center", }}>
                                <TSISingleDropdown
                                    name=""
                                    setFieldValue={(value: string) => {
                                        setStatus(value);
                                        getAdminSupportData(
                                            value == "OPEN" ? 1 : value == "CLOSED" ? 2 : value == "CANCELLED" ? 3 : 1
                                        );
                                    }}
                                    fieldvalue={status}
                                    dropdown={[
                                        { key: 1, value: "OPEN" },
                                        { key: 2, value: "CLOSED" },
                                        { key: 3, value: "CANCELLED" }
                                    ].map((item) => item.value)}
                                />
                            </div>
                        </div>


                        {(support?.length > 0) ? (<div style={{
                            width: '100%',
                            height: "100%",
                            overflowY: "scroll",
                        }}>
                            {support?.map((row, rowIndex) => (
                                <div onClick={() => { navigate(`/admin/supportdetails?id=${row?.id}&status=${row?.status}`) }} style={{ width: '100%', display: "flex", flexDirection: "row", justifyContent: 'center', }}>
                                    <SupportCard
                                        row={row}
                                        setRowData={setRowData}
                                        setOpenChangeReqModal={setOpenChangeReqModal}
                                    />
                                </div>
                            ))}
                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', height: '100%', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>)}
                    </div>)}
                </div>)
                }

                {
                    (isOpen) && (
                        <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>

                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '10px', height: "10%" }}>
                                <button
                                    onClick={() => { setIsOpen(!isOpen) }}
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
                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "flex-start", gap: '0px', width: '100%', height: "92%", overflowY: "scroll", scrollbarWidth: "none" }}>
                                <div style={{
                                    display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", width: '20%', height: "100%", fontFamily: "Opensans",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    lineHeight: "20px",
                                    letterSpacing: "0.16px",
                                    textAlign: "left",
                                    borderRight: "0.5px solid #BEC9C7"
                                }}>
                                    {
                                        (data)?.map((item: any, index: number) => (
                                            <div
                                                onClick={() => { setSelected(item.name) }}
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: "flex-start",
                                                    fontFamily: '16px',
                                                    height: '40px',
                                                    color: (item.name == selected) ? `${colors.primary}` : colors.darkblack,
                                                    width: '100%',
                                                    paddingLeft: "10px",
                                                    gap: '10px',
                                                    overflow: "scroll",
                                                    scrollbarWidth: "none",
                                                    borderRight: (item.name == selected) ? `1px solid ${colors.primary}` : "",
                                                    backgroundColor: (item.name == selected) ? `${colors.lightPrimary}` : "",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {item?.name}
                                            </div>
                                        ))
                                    }
                                </div>
                                <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '10px', width: '80%', height: "100%", overflow: 'scroll', scrollbarWidth: "none", padding: '40px', paddingTop: '20px', borderTop: "0.5px solid #BEC9C7" }}>

                                    {(selected == "Company Profile") && (
                                        <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", paddingTop: '10px', height: '75vh', scrollbarWidth: "none" }}>
                                            <div style={{ display: "flex", width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '2px', gap: '15px', }}>
                                                <p
                                                    style={{
                                                        fontFamily: "OpenSans",
                                                        fontSize: "24px",
                                                        fontWeight: 600,
                                                        lineHeight: "32.68px",
                                                        textAlign: "left",
                                                        textUnderlinePosition: "from-font",
                                                        textDecorationSkipInk: "none",
                                                        color: colors.black,
                                                        padding: 0,
                                                        margin: 0
                                                    }}
                                                >{reviewContent?.org_name}</p>
                                                <p
                                                    style={{
                                                        fontFamily: "OpenSans",
                                                        fontSize: "16px",
                                                        fontWeight: 400,
                                                        lineHeight: "32.68px",
                                                        textAlign: "left",
                                                        textUnderlinePosition: "from-font",
                                                        textDecorationSkipInk: "none",
                                                        color: colors.black,
                                                        padding: 0,
                                                        margin: 0
                                                    }}
                                                >{reviewContent?.about}</p>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", width: '100%', paddingBottom: "15px", }}>
                                                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", gap: '15px', }}>
                                                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", }}>
                                                        <p
                                                            style={{
                                                                fontFamily: "OpenSans",
                                                                fontSize: "18px",
                                                                fontWeight: 600,
                                                                lineHeight: "32.68px",
                                                                textAlign: "left",
                                                                textUnderlinePosition: "from-font",
                                                                textDecorationSkipInk: "none",
                                                                color: colors.black,
                                                                padding: 0,
                                                                margin: 0
                                                            }}
                                                        >Basic Details</p>
                                                    </div>
                                                </div>

                                            </div>
                                            {userData.map((item, index) => (<div key={index} style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                                                <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                                                    <p style={Style}>{item.key}</p>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                                                    <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{item.value}</p>
                                                </div>
                                            </div>))}


                                        </div>
                                    )}
                                    {(selected == "Solutions") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", paddingTop: '10px', height: '75vh', scrollbarWidth: "none" }}>
                                        <p
                                            style={{
                                                fontFamily: "OpenSans",
                                                fontSize: "18px",
                                                fontWeight: 600,
                                                lineHeight: "32.68px",
                                                textAlign: "left",
                                                textUnderlinePosition: "from-font",
                                                textDecorationSkipInk: "none",
                                                color: colors.black,
                                                padding: 0,
                                                margin: 0,
                                                width: '100%'
                                            }}
                                        >Solutions</p>
                                        {reviewContent?.solutions_interested
                                            .map((post: any, index: number) => (
                                                <div
                                                    key={index}
                                                    style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                                >
                                                    {post}
                                                </div>
                                            )
                                            )
                                        }
                                    </div>)}
                                    {(selected == "Services") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", paddingTop: '10px', height: '75vh', scrollbarWidth: "none" }}>
                                        <p
                                            style={{
                                                fontFamily: "OpenSans",
                                                fontSize: "18px",
                                                fontWeight: 600,
                                                lineHeight: "32.68px",
                                                textAlign: "left",
                                                textUnderlinePosition: "from-font",
                                                textDecorationSkipInk: "none",
                                                color: colors.black,
                                                padding: 0,
                                                margin: 0,
                                                width: '100%'
                                            }}
                                        >Services</p>
                                        {reviewContent?.services_interested
                                            .map((post: any, index: number) => (
                                                <div
                                                    key={index}
                                                    style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                                >
                                                    {post}
                                                </div>
                                            )
                                            )
                                        }
                                    </div>)}
                                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", width: '100%', paddingBottom: "10px", }}>
                                        <TSIButton
                                            name={"Reject"}
                                            variant={'outlined'}
                                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                            load={false}
                                            isCustomColors={true}
                                            customOutlineColor={`1px solid ${colors.primary}`}
                                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                            customBgColorOnhover={colors.white}
                                            customBgColor={colors.white}
                                            customTextColorOnHover={colors.primary}
                                            customTextColor={colors.primary}
                                            handleClick={
                                                () => {
                                                    const body = {
                                                        "_func": "reject",
                                                        "content_type": "ENQUIRY",
                                                        "id": reviewContent?.id
                                                    }
                                                    giveReview(body)
                                                }
                                            }
                                        />
                                        <TSIButton
                                            name={"Approve"}
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
                                                    const body = {
                                                        "_func": "approve",
                                                        "content_type": "ENQUIRY",
                                                        "id": reviewContent?.id
                                                    }
                                                    giveReview(body)
                                                }
                                            }
                                        />
                                    </div>

                                </div>

                            </div>


                        </div>
                    )
                }


                <Modal
                    open={addUser}
                    onClose={() => { setAddUser(false); }}
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
                                New Business / Ambassador
                            </span>
                            <button onClick={() => { setAddUser(false); }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
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
                            <TSISingleDropdown
                                name={"User Type"}
                                setFieldValue={(selectedValue: string) => {
                                    setUserType(selectedValue)
                                }}
                                fieldvalue={userType}
                                dropdown={[{ key: "Ambassador", value: "Ambassador" }, { key: "Business", value: "Business" }]?.map((item: any) => item.value) || []}
                                isRequired={true}
                            />
                            <TSITextfield
                                title={`Name`}
                                placeholder={`Enter Name`}
                                value={name}
                                type={"text"}
                                name={"field"}
                                handleChange={(event: any) => { setName(event.target.value) }}
                                isRequired={true}
                            />
                            <TSITextfield
                                title={`About`}
                                placeholder={`Enter About`}
                                value={about}
                                type={"text"}
                                name={"field"}
                                multiline={true}
                                maxLength={1000}
                                rows={3}
                                handleChange={(event: any) => { setAbout(event.target.value) }}
                                isRequired={true}
                            />

                            <TSITextfield
                                title={`Email`}
                                placeholder={`Enter Email`}
                                value={email}
                                type={"text"}
                                name={"field"}
                                handleChange={(event: any) => { setEmail(event.target.value) }}
                                isRequired={true}
                            />

                            {(userType == "Business") && (<div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    gap: '20px'
                                }}
                            >
                                <TSITextfield
                                    title={`Organisation`}
                                    placeholder={`Enter Organisation`}
                                    value={organisation}
                                    type={"text"}
                                    name={"field"}
                                    handleChange={(event: any) => { setOrganisation(event.target.value) }}
                                    isRequired={true}
                                />
                                <TSISingleDropdown
                                    name={"Industry"}
                                    setFieldValue={(selectedValue: string) => {
                                        setIndustry(selectedValue);
                                        setSubType("")
                                    }}
                                    fieldvalue={industry}
                                    dropdown={indVerticles?.map((item: any) => item.value) || []}
                                    isRequired={true}
                                />
                                <TSISingleDropdown
                                    name={"Sub Type"}
                                    setFieldValue={setSubType}
                                    fieldvalue={subtype}
                                    dropdown={indSubtypes.map((item: any) => item.value)}
                                    isRequired={true}
                                />

                                <TSISingleDropdown
                                    name={"Category"}
                                    setFieldValue={setCategory}
                                    fieldvalue={category}
                                    dropdown={categoryValues.map((item: any) => item.value)}
                                    isRequired={true}
                                />

                                <TSISingleDropdown
                                    name={"No. of Employees"}
                                    setFieldValue={setNumberofEmp}
                                    fieldvalue={numberofEmp}
                                    dropdown={numberOfEmployees.map((item: any) => item.value) || [
                                        "0-10", "11-25", "26-100", "100-500", "500+"
                                    ]}
                                    isRequired={true}
                                />
                                <TSISingleDropdown
                                    name={"State"}
                                    setFieldValue={(selectedValue: string) => {
                                        const selectedState = states.find((item: any) => item.value === selectedValue);
                                        if (selectedState) {
                                            setState({ key: selectedState.key, value: selectedState.value });
                                        }
                                        setCity("")
                                    }}
                                    fieldvalue={state?.value || ""}
                                    dropdown={states.map((item: any) => item.value)}
                                    isRequired={true}
                                />



                                <TSISingleDropdown
                                    name={"City"}
                                    setFieldValue={setCity}
                                    fieldvalue={city}
                                    dropdown={stateCities.map((item: any) => item.value)}
                                    isRequired={true}
                                />

                                <TSISingleDropdown
                                    name={"Business Start Year"}
                                    placeholder={"Select Start Year"}
                                    value={startYear}
                                    dropdown={[...Array(new Date().getFullYear() - 1990 + 1).keys()]
                                        .map(i => 1990 + i)
                                        .reverse()}
                                    setFieldValue={(selectedOption: any) => setStartYear(selectedOption)}
                                    previewMode={false}
                                    isRequired={true}
                                />
                            </div>)}
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
                                        setAddUser(false)
                                    }
                                }

                            />
                            <TSIButton
                                name={"Create User"}
                                variant={'contained'}
                                padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                load={false}
                                disabled={!isFormValid()}
                                isCustomColors={true}
                                customOutlineColor={`1px solid ${colors.primary}`}
                                customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                customBgColorOnhover={colors.primary}
                                customBgColor={colors.primary}
                                customTextColorOnHover={colors.white}
                                customTextColor={colors.white}
                                handleClick={
                                    () => {
                                        handleOnBoarding()
                                    }
                                }
                            />
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={openChangeReqModal}
                    onClose={() => { setOpenChangeReqModal(false) }}
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
                                Change Support Request Status
                            </span>
                            <button onClick={() => { setOpenChangeReqModal(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
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
                                name="Changing Status"
                                setFieldValue={(value: string) => {
                                }}
                                previewMode={true}
                                fieldvalue={rowData?.status}
                                dropdown={[
                                    { key: 1, value: "OPEN" },
                                    { key: 2, value: "CLOSED" },
                                    { key: 3, value: "CANCELLED" }
                                ].map((item) => item.value)}
                            />

                            <TSISingleDropdown
                                name="Changing Status"
                                setFieldValue={(value: string) => {
                                    setChangingStatus(value);

                                }}
                                fieldvalue={changingstatus}
                                dropdown={[
                                    { key: 1, value: "OPEN" },
                                    { key: 2, value: "CLOSED" },
                                    { key: 3, value: "CANCELLED" }
                                ].filter((item) => item.value !== rowData?.status)?.map((item) => item.value)}
                            />

                            <TSIButton
                                name={"Submit"}
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
                                        getAdminRoleChangingData(rowData.id,
                                            changingstatus == "OPEN" ? 1 : changingstatus == "CLOSED" ? 2 : changingstatus == "CANCELLED" ? 3 : 1
                                        );
                                    }
                                }
                            />

                        </div>

                    </div>
                </Modal>

                <TSIConfirmationModal
                    open={loginDetails?.open}
                    title={"Login"}
                    desc={"Are you sure you want to login to this user?"}
                    buttonName1={"No"}
                    buttonName2={"Yes, Login"}
                    btn2Color={colors.primary}
                    onClose={() => {
                        setLoginDetails({
                            "open": false,
                            "accountType": "",
                            "accountSlug": ""
                        })
                    }}
                    onClick={() => { postAssist() }}
                />


                <TSIConfirmationModal
                    open={kycDetails?.open}
                    title={"KYC"}
                    desc={"Are you sure you want to get kyc details?"}
                    buttonName1={"No"}
                    buttonName2={"Yes"}
                    btn2Color={colors.primary}
                    onClose={() => {
                        setKycDetails({
                            "open": false,
                            "accountType": "",
                            "accountSlug": ""
                        })
                    }}
                    onClick={() => {
                        getKycDetails({
                            "_func": "get_kyc",
                            "kyc_type": "pan",
                            "account_type": kycDetails?.accountType,
                            "account_slug": kycDetails?.accountSlug
                        })
                        // getSubscriptionDetails({
                        //     "_func": "get_subscription_details",
                        //      "account_type": kycDetails?.accountType,
                        //     "account_slug": kycDetails?.accountSlug
                        // })
                    }}
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

export default Admin
