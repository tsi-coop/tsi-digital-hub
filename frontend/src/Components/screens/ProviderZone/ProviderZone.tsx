import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { calender, image, man, NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import TSIConfirmationModal from '../../common/Molecules/TSIConfirmationModal';
import TSIMessage from '../../common/Molecules/TSIMessage';
import TSIPZoneCard from '../../common/Molecules/TSIPZoneCard';
import TSIAddSolutionModal from '../../common/Molecules/TSIAddSolutionModal';
import TSIAddServicesModal from '../../common/Molecules/TSIAddServicesModal';
import apiInstance from '../../../services/authService';
import TSIAddTrainingModal from '../../common/Molecules/TSIAddTrainingModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ConsentPopup from '../../common/Molecules/ConsentPopup';
import ConsentManager from '../../common/Molecules/ConsentManager';
import TSIStrictModal from '../../common/Molecules/TSIStrictModal';
import { TSICONFIG } from '../../../configData';
const ProviderZone = () => {
    const deviceType = useDeviceType()
    const [searchParams] = useSearchParams();
    const sel = searchParams.get("sel");
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [selectedSort, setSelectedSort] = useState<any>("Solutions");
    const [open, setOpen] = useState<any>(false);
    const [isRejection, setRejection] = useState<any>(false);
    const [isMessage, setIsMessage] = useState<any>(false);
    const [load, setLoad] = useState(false)
    const [solutionOpen, setSolutionOpen] = useState<any>(false);
    const [servicesOpen, setServicesOpen] = useState<any>(false);
    const [trainingOpen, setTrainingOpen] = useState<any>(false);
    const [servicesEditOpen, setServicesEditOpen] = useState<any>(false);
    const [solutionsEditOpen, setSolutionsEditOpen] = useState<any>(false);
    const [trainingEditOpen, setTrainingEditOpen] = useState<any>(false);
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [solutions, setSolutions] = useState<any>([]);
    const [services, setServices] = useState<any>([]);
    const [trainings, setTrainings] = useState<any>([]);
    const [showConsent, setShowConsent] = useState(false);
    const navigate: any = useNavigate();
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const sortItems = [
        { label: "Solutions" },
        { label: "Services" },
        { label: "Training" },
    ];
    function getCookie(name: string): string | undefined {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ').reduce<Record<string, string>>((acc, current) => {
            const [key, value] = current.split('=');
            acc[key] = value;
            return acc;
        }, {});
        return cookies[name];
    }

    const getSolutionsData = () => {
        setLoad(true)
        const body = {
            "_func": "get_provider_solutions"
        }

        apiInstance.getSolutions(body)
            .then((response: any) => {
                if (response.data) {
                    setSolutions(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getServicesData = () => {
        setLoad(true)
        const body = {
            "_func": "get_provider_services"
        }

        apiInstance.getServices(body)
            .then((response: any) => {
                if (response.data) {
                    setServices(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getTrainingData = () => {
        setLoad(true)
        const body = {
            "_func": "get_provider_trainings"
        }

        apiInstance.getTraining(body)
            .then((response: any) => {
                if (response.data) {
                    setTrainings(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    useEffect(() => {
        // const stored: any = getCookie("CONSENT_LOCAL_STORAGE_KEY")
       /* const stored: any = getCookie(TSICONFIG.COOKIE_LOCAL_STORAGE_KEY)
        let parsed: any;
        if (stored && stored !== "undefined") {
            parsed = JSON.parse(stored);
            // use `parsed`
        } else {
            console.warn("Consent data is missing or invalid:", stored);
            // handle as needed (e.g., show default UI or fetch from server)
        }*/
        // setShowConsent(parsed?.preferences?.purpose_solution_service_training_showcase ? false : true)
       /* if (parsed?.preferences?.purpose_solution_service_training_showcase ? false : true) {
            navigate(-1)
        }*/
        if (sel == "solutions") {
            setSelectedSort("Solutions")
        } else if (sel == "services") {
            setSelectedSort("Services")
        } else if (sel == "training") {
            setSelectedSort("Training")
        }
        getServicesData()
        getSolutionsData()
        getTrainingData()
    }, [])


    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', backgroundColor: colors.lightPrimary, height: '100%' }}>

                <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", gap: '5px' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '10px' }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                        }}>Provider Zone</p>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "22.4px",
                            letterSpacing: "0.5px",
                            textAlign: "left",
                        }}>
                            Expand your reach. Showcase your IT products, services, and training to a targeted audience.
                            Connect with businesses seeking your expertise
                        </p>
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", gap: '20px', alignItems: "center", borderBottom: `1px solid ${colors.snowywhite}`, }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "center", width: '70%', }}>

                            {sortItems?.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => { setSelectedSort(item.label) }}
                                    style={{
                                        margin: 0, padding: 8,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: "center",
                                        fontFamily: "OpenSans",
                                        fontSize: "15px",
                                        fontWeight: item.label == selectedSort ? 600 : 400,
                                        lineHeight: "20px",
                                        textUnderlinePosition: "from-font",
                                        textDecorationSkipInk: "none",
                                        textTransform: 'capitalize',
                                        cursor: "pointer",
                                        color: colors.brownCharcoal,
                                        paddingBottom: '15px',
                                        borderBottom: item.label == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`)
                                    }}>
                                    {item?.label}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", gap: '20px', alignItems: "center", width: '30%', paddingBottom: '10px' }}>
                            {(selectedSort == "Solutions") && (<TSIButton
                                name={"+ Add Solution"}
                                disabled={false}
                                variant={'contained'}
                                padding={deviceType == "mobile" ? "5px 15px" : "5px 15px"}
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
                                        setSolutionOpen(true)
                                    }
                                }
                            />)}
                            {(selectedSort == "Services") && (
                                <TSIButton
                                    name={"+ Add Services"}
                                    disabled={false}
                                    variant={'contained'}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 15px"}
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
                                            setServicesOpen(true)
                                        }
                                    }
                                />
                            )}
                            {(selectedSort == "Training") && (
                                <TSIButton
                                    name={"+ Add Training"}
                                    disabled={false}
                                    variant={'contained'}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 15px"}
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
                                            setTrainingOpen(true)
                                        }
                                    }
                                />
                            )}
                        </div>
                    </div>
                    {(selectedSort == "Solutions") && (
                        <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: '5px', height: '62vh', scrollbarWidth: "none" }}>

                            {(solutions?.length > 0) ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '85%', scrollbarWidth: "none", gap: "10px" }}>
                                {solutions.map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSIPZoneCard post={post} selectedSort={"solution"} setClickedPost={setClickedPost} setIsEditPost={setSolutionsEditOpen} isExpandable={false} />
                                    </div>
                                ))}
                            </div>) : (
                                <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: '10px', paddingTop: '2px', height: '85%', scrollbarWidth: "none" }}>
                                    <img src={NoData} style={{ height: "80%" }} />
                                </div>
                            )}

                        </div>
                    )}
                    {(selectedSort == "Services") && (
                        <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: '5px', height: '62vh', scrollbarWidth: "none" }}>

                            {(services?.length > 0) ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '85%', scrollbarWidth: "none", gap: "10px" }}>
                                {services.map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSIPZoneCard post={post} selectedSort={"service"} setClickedPost={setClickedPost} setIsEditPost={setServicesEditOpen} isExpandable={false} />
                                    </div>
                                ))}
                            </div>) :
                                (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: '10px', paddingTop: '2px', height: '85%', scrollbarWidth: "none" }}>
                                    <img src={NoData} style={{ height: "80%" }} />
                                </div>)}

                        </div>
                    )}
                    {(selectedSort == "Training") && (
                        <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: '5px', height: '62vh', scrollbarWidth: "none" }}>

                            {(trainings?.length > 0) ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '85%', scrollbarWidth: "none", gap: "10px" }}>
                                {trainings.map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSIPZoneCard post={post} selectedSort={"training"} setClickedPost={setClickedPost} setIsEditPost={setTrainingEditOpen} isExpandable={false} />
                                    </div>
                                ))}
                            </div>) : (
                                <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: '10px', paddingTop: '2px', height: '85%', scrollbarWidth: "none" }}>
                                    <img src={NoData} style={{ height: "80%" }} />
                                </div>
                            )}

                        </div>
                    )}

                </div>


                {(solutionOpen) && (<TSIAddSolutionModal
                    isOpen={solutionOpen}
                    setIsOpen={setSolutionOpen}
                    edit={false}
                    editablePost={{}}
                    onSubmit={() => { getSolutionsData() }}
                    title={"Solution"}
                />)}

                {(solutionsEditOpen) && (<TSIAddSolutionModal
                    isOpen={solutionsEditOpen}
                    edit={true}
                    editablePost={clickedPost}
                    setIsOpen={setSolutionsEditOpen}
                    title={"Solution"}
                    onSubmit={() => { }}
                />)}

                {(servicesEditOpen) && (<TSIAddServicesModal
                    isOpen={servicesEditOpen}
                    setIsOpen={setServicesEditOpen}
                    edit={true}
                    editablePost={clickedPost}
                    onSubmit={() => { setServicesEditOpen(false); }}
                    title={"Services"}
                />)}

                {(servicesOpen) && (
                    <TSIAddServicesModal
                        isOpen={servicesOpen}
                        setIsOpen={setServicesOpen}
                        edit={false}
                        editablePost={{}}
                        onSubmit={() => { getServicesData() }}
                        title={"Services"}
                    />
                )}

                {(trainingOpen) && (<TSIAddTrainingModal
                    isOpen={trainingOpen}
                    setIsOpen={setTrainingOpen}
                    edit={false}
                    editablePost={{}}
                    onSubmit={() => { getTrainingData() }}
                    title={"Training"}
                />)}

                {(trainingEditOpen) && (<TSIAddTrainingModal
                    isOpen={trainingEditOpen}
                    setIsOpen={setTrainingEditOpen}
                    edit={true}
                    editablePost={clickedPost}
                    onSubmit={() => { getTrainingData() }}
                    title={"Training"}
                />)}

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Your account created successfully"}
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

export default ProviderZone
