import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Checkbox, Collapse, IconButton, ListItem, ListItemText } from '@mui/material'
import { CollapsibleTree } from '../../common/Atoms/CollapsibleList'
import colors from '../../../assets/styles/colors'
import { ExpandLess, ExpandMore } from '@mui/icons-material'


const TechProfSetup4 = ({
    skillsTree,
    selectedSkills, setSelectedSkills,
}: any) => {
    const deviceType = useDeviceType()
    const [openItSkills, setOpenItSkills] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setOpenItSkills(true)
        }, 200)
    }, [])
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '0px', width: "100%", }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '0px', width: "100%", }}>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: "40px",
                    fontWeight: 600,
                    lineHeight: "54.47px",
                    textAlign: "left",
                    textUnderlinePosition: "from-font",
                    textDecorationSkipInk: "none",
                    margin: 0,
                    padding: 0,
                    paddingBottom:'10px'
                }} >Suitable Skills </p>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "22.4px",
                    letterSpacing: "-0.02em",
                    textAlign: "left",
                    textUnderlinePosition: "from-font",
                    textDecorationSkipInk: "none",
                    margin: 0,
                    padding: 0
                }}>Skills in use / will be helpful in future</p>
            </div>
            <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : "row", justifyContent: "flex-start", alignItems: "flex-start", overflowY: "scroll", scrollbarWidth: 'none', width: "100%", height: 'auto', gap: '20px', marginTop: '20px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", overflowY: "scroll", scrollbarWidth: 'none', width: deviceType == "mobile" ? "100%" : "50%", height: 'auto', marginTop: '20px' }}>
                    <ListItem sx={{
                        pl: 2, border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", background: colors.lightPrimary,
                        borderBottomLeftRadius: openItSkills ? "0px" : "5px",
                        borderBottomRightRadius: openItSkills ? "0px" : "5px",
                        paddingTop: "0px",
                        paddingBottom: '0px',
                        '& .css-10b8wcc-MuiListItem-root': {
                            paddingTop: "0px",
                            paddingBottom: '0px'
                        },
                        '& .MuiListItem-root': {
                            paddingTop: "0px",
                            paddingBottom: '0px'
                        },
                        '& .css-1wg5ebk-MuiList-root': {
                            paddingTop: "0px",
                            paddingBottom: '0px',
                            borderRadius: "5px",
                        },
                    }}>
                        {(selectedSkills?.length > 0) && (<Checkbox
                            checked={selectedSkills?.length > 0 ? true : false}
                            onChange={() => { }}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={{
                                '&.Mui-checked': {
                                    color: colors.graniteGrey,
                                },
                            }}
                        />)}

                        <ListItemText primary={"IT Skills"} />
                        <IconButton onClick={() => { setOpenItSkills(!openItSkills) }}>
                            {openItSkills ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItem>
                    <Collapse in={openItSkills} sx={{
                        width: '100%',
                        border: `1px solid ${colors.snowywhite}`,
                        borderBottomLeftRadius: openItSkills ? "5px" : "5px",
                        borderBottomRightRadius: openItSkills ? "5px" : "5px",
                    }} timeout="auto" unmountOnExit>
                        <CollapsibleTree data={skillsTree} selectedItems={selectedSkills} setSelectedItems={setSelectedSkills} />
                    </Collapse>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", overflowY: "scroll", scrollbarWidth: 'none', width: deviceType == "mobile" ? "100%" : "50%", height: 'auto', marginTop: '20px' }}>
                    {/* <ListItem sx={{
                        pl: 2, border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", background: colors.lightPrimary,
                        borderBottomLeftRadius: openTraining ? "0px" : "5px",
                        borderBottomRightRadius: openTraining ? "0px" : "5px",
                        paddingTop: "0px",
                        paddingBottom: '0px',
                        '& .css-10b8wcc-MuiListItem-root': {
                            paddingTop: "0px",
                            paddingBottom: '0px'
                        },
                        '& .MuiListItem-root': {
                            paddingTop: "0px",
                            paddingBottom: '0px'
                        },
                        '& .css-1wg5ebk-MuiList-root': {
                            paddingTop: "0px",
                            paddingBottom: '0px',
                            borderRadius: "5px",
                        },
                    }}>
                        <Checkbox
                            checked={openTraining}
                            onChange={() => { setOpenTraining(!openTraining) }}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={{
                                '&.Mui-checked': {
                                    color: colors.primary,
                                },
                            }}
                        />

                        <ListItemText primary={"IT Training"} />
                        <IconButton onClick={() => { setOpenTraining(!openTraining) }}>
                            {openTraining ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItem>
                    <Collapse in={openTraining} sx={{
                        width: '100%',
                        border: `1px solid ${colors.snowywhite}`,
                        borderBottomLeftRadius: openTraining ? "5px" : "5px",
                        borderBottomRightRadius: openTraining ? "5px" : "5px",
                    }} timeout="auto" unmountOnExit>
                        <CollapsibleTree data={trainingsTree} selectedItems={selectedTraining} setSelectedItems={setSelectedTraining} />
                    </Collapse> */}
                </div>
            </div>
        </div>
    )
}

export default TechProfSetup4
