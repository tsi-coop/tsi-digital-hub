import { Avatar, Button, InputBase, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import apiInstance from '../../../services/authService';
import { DeleteForever } from '@mui/icons-material';
const TSIPZoneCard = ({ post, selectedSort, setClickedPost, setIsEditPost, isExpandable }: any) => {
    const [load, setLoad] = useState(false)
    const [data, setData] = useState<any>({})
    const [contentExapnd, setContentExpand] = useState(false)

    const deviceType = useNavigate()

    const getViewData = (id: any, type: "solution" | "service" | "training") => {
        setLoad(true);
        const body = {
            "_func": `view_${type}`,
            "id": id
        };

        const apiMethod = {
            solution: apiInstance.viewSolutions,
            service: apiInstance.viewServices,
            training: apiInstance.viewTraining
        }[type];

        apiMethod(body)
            .then((response: any) => {
                if (response.data) {
                    setData(response.data);
                    setContentExpand(!contentExapnd)
                }
            })
            .catch((error: any) => {
                console.error(error);
            })
            .finally(() => {
                setLoad(false);
            });
    };

    const deletePost = (id: any, type: "solution" | "service" | "training") => {
        setLoad(true);
        const body = {
            "_func": `cancel_${type}`,
            "id": id
        };

        const apiMethod = {
            solution: apiInstance.getSolutions,
            service: apiInstance.getServices,
            training: apiInstance.getTraining
        }[type];

        apiMethod(body)
            .then((response: any) => {
                if (response.data?._cancelled) {

                }
            })
            .catch((error: any) => {
                console.error(error);
            })
            .finally(() => {
                setLoad(false);
            });
    };

    // Usage:

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
    };
    const [isHover, setIsHover] = useState(false)

    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `0.2px solid ${colors.lightPrimaryBorder}`, backgroundColor: isHover ? colors.lightPrimarybackground : colors.white,}}>
                <div
                    onMouseEnter={() => { setIsHover(true) }}
                    onMouseLeave={() => { setIsHover(false) }}
                    style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", marginTop: '10px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: '10px', paddingBottom: '10px',  }}>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", gap: "20px", width: '100%' }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontSize: "16px",
                                fontWeight: 600,
                                lineHeight: "19.07px",
                                textAlign: 'left',
                                fontFamily: "OpenSans"
                            }}>{post?.title}</p>


                            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",gap:'10px'}}>
                                <span style={{
                                    margin: 0, padding: 0,
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "19.07px",
                                    textAlign: 'left',
                                    fontFamily: "OpenSans"
                                }}>{post?.time_ago}</span>

                                <button
                                    onClick={() => { setClickedPost(post); setIsEditPost(true); }}
                                    style={{
                                        padding: 0, margin: 0, fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        lineHeight: "20px",
                                        letterSpacing: "0.10000000149011612px",
                                        textAlign: "center",
                                        textTransform: "capitalize",
                                        backgroundColor: "transparent",
                                        border: "0px solid transparent"
                                    }}>
                                    <EditNoteIcon sx={{ width: '25px', height: "25px" }} />
                                </button>
                            </div>
                        </div>

                        <p style={{
                            margin: 0, padding: 0,
                            color: colors.lightgrey,
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            textAlign: 'left',
                            fontFamily: "OpenSans"
                        }}>{post?.positioning}</p>
                    </div>
                </div>
                {(contentExapnd) && (<div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", gap: '2px', padding: '10px', borderTop: `0.5px solid ${colors.snowywhite}` }}>

                    {(data.positioning) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Positioning</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data.positioning}</p>
                        </div>
                    </div>)}
                    {(data?.industry) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Industry</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data.industry}</p>
                        </div>
                    </div>)}
                    {(data?.course_outline) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Course Outline</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data?.course_outline}</p>
                        </div>
                    </div>)}
                    {(data?.features) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Key Features</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data?.features}</p>
                        </div>
                    </div>)}
                    {(data?.benefits) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Benefits</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data?.benefits}</p>
                        </div>
                    </div>)}
                   
                    {(data?.solutions_offered) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Solutions Offered</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span>  <TSISpreadItems items={data.solutions_offered?.replace(/[{}]/g, '').split(',') || []} />
                        </div>
                    </div>)}
                    {(data?.services_offered) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Services Offered</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span>  <TSISpreadItems items={data.services_offered?.replace(/[{}]/g, '').split(',') || []} />
                        </div>
                    </div>)}
                    {(data?.skills_used || data?.skills_offered) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                            <p style={{ ...Style, }}>Skills Used</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                            <span style={{ marginRight: '10px' }}>:</span>  <TSISpreadItems items={data?.skills_used?.replace(/[{}]/g, '').split(',') || data?.skills_offered?.replace(/[{}]/g, '').split(',') || []} />
                        </div>

                    </div>)}



                </div>)}

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

export default TSIPZoneCard
