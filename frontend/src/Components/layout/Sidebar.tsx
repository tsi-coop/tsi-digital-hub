import React, { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowLeft } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { tsilogo } from '../../assets';
import useDeviceType from '../../Utils/DeviceType';
import colors from '../../assets/styles/colors';
import TSIStrictModal from '../common/Molecules/TSIStrictModal';
import { TSICONFIG } from '../../configData';

interface SidebarItemData {
    id: string;
    label: string;
    link: string;
    isSelected: boolean;
    children: SidebarItemData[];
    parentId?: string;
    isChild?: boolean;
    icon?: string;
    icon2?: string;
    disabled?: boolean;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedParent: string;
    setSelectedParent: React.Dispatch<React.SetStateAction<string>>;
    sidebarData: SidebarItemData[];
    setSelectedChild: React.Dispatch<React.SetStateAction<string | undefined>>;
    selectedChild: string | undefined;
    setShowPreferences: React.Dispatch<React.SetStateAction<string | undefined>>;
    showPreferences: string | undefined;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    selectedParent,
    setSelectedParent,
    sidebarData,
    selectedChild,
    setSelectedChild,
    showPreferences,
    setShowPreferences
}: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const deviceType = useDeviceType();
    const [load, setLoad] = useState(false)
    const [expandedParents, setExpandedParents] = useState<string[]>([]);
    const [showConsent, setShowConsent] = useState(false);
    const [showEngageConsent, setShowEngageConsent] = useState(false);
    const [parsedContent, setParsedContent] = useState<any>({})

    function getCookie(name: string): string | undefined {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ').reduce<Record<string, string>>((acc, current) => {
            const [key, value] = current.split('=');
            acc[key] = value;
            return acc;
        }, {});
        return cookies[name];
    }

    const deviceWidth =
        deviceType === 'large-desktop' || deviceType === 'extra-large-desktop'
            ? '300px'
            : '250px';

    const devicelargeWidth =
        deviceType === 'large-desktop' || deviceType === 'extra-large-desktop';

    useEffect(() => {
        setLoad(true)
        const pathWithoutParams = location.pathname.split('?')[0];
        const currentPath = location.pathname.split('/').pop();
        let matched = false;

        for (const parent of sidebarData) {
            if (parent.link.split('/').pop() === currentPath) {
                setSelectedParent(parent.id);
                setSelectedChild('');
                matched = true;
                break;
            }

            for (const child of parent.children || []) {
                if (child?.link?.split('/').pop() === currentPath) {
                    setSelectedParent(parent.id);
                    setSelectedChild(child.id);
                    // setExpandedParents((prev) => [...new Set([parent.id])]);
                    matched = true;
                    break;
                }
            }

            if (matched) break;
        }

        if (!matched) {
            setSelectedParent('');
            setSelectedChild(undefined);
        }

        const matchCustomPath = (route: string, parent: string, child: string) => {
            setLoad(true)
            if (pathWithoutParams === route) {
                setSelectedParent(parent);
                setSelectedChild(child);
                setExpandedParents((prev) => [...new Set([parent])]);
            }

        };

        matchCustomPath('/support/details', 'engage', 'support');
        matchCustomPath('/admin/supportdetails', 'admin', 'admin');
        matchCustomPath('/tsiratingsquestionnaireDM', 'tsiratings', 'tsiratingsdigitialmaturity');
        matchCustomPath('/tsiratingsquestionnaireCM', 'tsiratings', 'tsiratingscapabilitymaturity');
        matchCustomPath('/admin/accountDetails', 'admin', 'admin');
        matchCustomPath('/community/postdetails', 'engage', 'organisations');
        matchCustomPath('/community/postdetailscreen', 'community', 'community');
        matchCustomPath('/posts/postdetails', 'engage', 'posts');
        matchCustomPath('/training/details', 'discover', 'training');
        matchCustomPath('/solutions/details', 'discover', 'solutions');
        matchCustomPath('/services/details', 'discover', 'services');
        matchCustomPath('/talent/postdetails', 'discover', 'talent');
        matchCustomPath('/ambassador/postdetails', 'discover', 'talent');
        matchCustomPath('/meetup/postdetails', 'engage', 'meetup');
        matchCustomPath('/meetup/detail', 'engage', 'meetup');
        matchCustomPath('/organisations/postdetails', 'discover', 'organisations');
        matchCustomPath('/enquiries/postdetails', 'engage', 'enquiries');
        matchCustomPath('/rfps/postdetails', 'engage', 'rfps');
        matchCustomPath('/jobs/details', 'jobs', 'jobs');
        matchCustomPath('/jobs/jobdetails', 'jobs', 'jobs');
        matchCustomPath('/jobs/applicationdetails', 'jobs', 'jobs');
        matchCustomPath('/testimonial/postdetails', 'engage', 'testimonial');
        setTimeout(() => {
            setLoad(false)
        }, 50)
    }, [location.pathname, sidebarData]);

    const handleParentClick = (parent: SidebarItemData) => {
        setLoad(true)
        if (!parent?.disabled) {
            if (parent.children?.length) {
                setExpandedParents([parent.id]);
                navigate(parent?.children[0]?.link);
                setSelectedParent('');
                setSelectedChild('');
            } else {
                navigate(parent.link);
                setSelectedParent(parent.id);
                setSelectedChild('');
                setExpandedParents([]);
            }
            if (deviceType === 'mobile') onClose();
        }
        setLoad(false)
    };


    const handleChildClick = (parentId: string, child: SidebarItemData) => {
        setLoad(true)
        setSelectedParent(parentId);
        setSelectedChild(child.id);
        navigate(child.link);
        if (deviceType === 'mobile') onClose();
        setLoad(false)
    };
    if (!load) {
        return (
            <div
                style={{
                    width: deviceType === 'mobile' && isOpen ? '300px' : isOpen ? deviceWidth : '0%',
                    height: '97vh',
                    backgroundColor: colors.lightPrimary,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: isOpen ? 5 : -1,
                    position: deviceType === 'mobile' && isOpen ? 'absolute' : 'relative',
                    padding: '15px 15px 0 15px',
                }}
            >
                <div style={{ textAlign: 'start', paddingLeft: '20px' }}>
                    <img src={tsilogo} alt="Logo" style={{ width: '100px', height: '60px' }} />
                </div>

                <div
                    style={{
                        height: '90%',
                        overflowY: 'scroll',
                        scrollbarWidth: 'none',
                        width: '100%',
                        visibility: isOpen ? 'visible' : 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        gap: devicelargeWidth ? '10px' : '0px',
                        paddingBottom: '20px',
                        paddingTop: '10px',
                    }}
                >
                    {sidebarData?.map((parent: any) => (
                        <div key={parent.id} style={{ width: '100%' }}>
                            <div
                                style={{
                                    height: '45px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '100px',
                                    // backgroundColor: 'transparent',
                                    // color: colors.primary,
                                    backgroundColor:
                                        ((parent?.children?.length > 0) ? (
                                            "transparent"
                                        ) : (
                                            (selectedParent === parent.id || expandedParents.includes(parent.id)) ? colors.primary : "transparent"
                                        )),
                                    color:
                                        ((parent?.children?.length > 0) ? (
                                            colors.primary
                                        ) : (
                                            (selectedParent === parent.id || expandedParents.includes(parent.id)) ? colors.white : colors.primary
                                        )),
                                    fontWeight: ((selectedParent === parent.id) || expandedParents.includes(parent.id)) ? 700 : 500,
                                }}
                                onClick={() => {
                                        handleParentClick(parent)
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: "row",
                                        alignItems: 'center',
                                        gap: '25px',
                                        fontFamily: 'OpenSans',
                                        fontSize: devicelargeWidth ? '16px' : '14px',
                                    }}
                                >
                                    {parent.icon && (
                                        <img
                                            src={
                                                (parent?.children?.length > 0) ? (
                                                    parent.icon
                                                ) : (
                                                    (selectedParent === parent.id || expandedParents.includes(parent.id)) ? parent.icon2 : parent.icon
                                                )}
                                            alt={parent.label}
                                            style={{
                                                width: devicelargeWidth ? '24px' : '20px',
                                                height: devicelargeWidth ? '24px' : '20px',
                                            }}
                                        />
                                    )}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: '0px',
                                            fontFamily: 'OpenSans',
                                            textAlign: "left"
                                        }}
                                    >
                                        {isOpen && parent.label}  {(parent?.disabled) && (<span style={{ color: colors.red, fontSize: '10px', textAlign: "left" }}>{"Coming soon"}</span>)}
                                    </div>
                                </div>
                                {parent.children?.length > 0 && (
                                    <KeyboardArrowDown
                                        style={{
                                            transform: (expandedParents[expandedParents?.length - 1] == parent.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s',
                                        }}
                                    />
                                )}
                            </div>

                            {((selectedParent === parent?.id) || expandedParents?.includes(parent?.id)) && (
                                <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                                    {
                                        (parent?.children || [])
                                            .filter((child: any) => child != null)
                                            .map((child: any) => (
                                                <div
                                                    key={child.id}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '100px',
                                                        backgroundColor:
                                                            selectedChild === child?.id ? colors.primary : 'transparent',
                                                        color: selectedChild === child?.id ? colors.white : '#3F4948',
                                                        fontWeight: selectedChild === child?.id ? 600 : 400,
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        textAlign: 'left',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '15px',
                                                    }}
                                                    onClick={() => {
                                                            if (!child?.disabled) { handleChildClick(parent?.id, child) }
                                                    }}
                                                >
                                                    {child.icon && (
                                                        <img
                                                            src={selectedChild === child?.id ? child?.icon2 : child?.icon}
                                                            alt={child.label}
                                                            style={{
                                                                width: devicelargeWidth ? '24px' : '20px',
                                                                height: devicelargeWidth ? '24px' : '20px',
                                                            }}
                                                        />
                                                    )}

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: "column",
                                                            alignItems: "flex-start",
                                                            gap: '0px',
                                                            fontFamily: 'OpenSans',
                                                            textAlign: "left"
                                                        }}
                                                    >
                                                        {isOpen && child?.label}  {(child?.disabled) && (<span style={{ color: colors.red, fontSize: '10px', textAlign: "left" }}>{"Coming soon"}</span>)}
                                                    </div>
                                                </div>
                                            ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {deviceType === 'mobile' && isOpen && (
                    <div style={{ position: 'absolute', left: '100%', top: '3%' }}>
                        <button
                            onClick={onClose}
                            style={{
                                width: '24px',
                                height: '24px',
                                border: '1px solid #FFF',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.primary,
                                borderRadius: '100px',
                                cursor: 'pointer',
                            }}
                        >
                            <KeyboardArrowLeft style={{ color: '#fff', width: '16px', height: '16px' }} />
                        </button>
                    </div>
                )}
            </div>
        )
    }
    else {
        return (
            <div className="sidebarcentered-container">
                <div className="sidebarloader"></div>
            </div>
        //     <div style={{
        //         display: 'flex',
        //         justifyContent: 'center',
        //         gap: '4px',
        //         alignItems: 'center',
        //         height: '100px',
        //     }}>
        //         <div style={{
        //             width: '4px',
        //             height: '20px',
        //             backgroundColor: '#0A7B79',
        //             animation: 'stretch 0.8s infinite ease-in-out', animationDelay: '0s'
        //         }} />
        //         <div style={{
        //             width: '4px',
        //             height: '20px',
        //             backgroundColor: '#0A7B79',
        //             animation: 'stretch 0.8s infinite ease-in-out', animationDelay: '0.2s'
        //         }} />
        //         <div style={{
        //             width: '4px',
        //             height: '20px',
        //             backgroundColor: '#0A7B79',
        //             animation: 'stretch 0.8s infinite ease-in-out', animationDelay: '0.4s'
        //         }} />
        //         <style>
        //             {`
        //   @keyframes stretch {
        //     0%, 100% {
        //       transform: scaleY(1);
        //     }
        //     50% {
        //       transform: scaleY(2);
        //     }
        //   }
        // `}
        //         </style>
        //     </div>
        );
    }
};

export default React.memo(Sidebar);;
