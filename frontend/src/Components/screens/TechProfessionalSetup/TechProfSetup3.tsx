import React, { useEffect, useState } from 'react'
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown'
import TSIMultipleDropdown from '../../common/Atoms/TSIMultipleDropdown'
import useDeviceType from '../../../Utils/DeviceType'
import { Checkbox, Collapse, IconButton, ListItem, ListItemText } from '@mui/material'
import colors from '../../../assets/styles/colors'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { CollapsibleTree } from '../../common/Atoms/CollapsibleList'


const TechProfSetup3 = ({
    servicesInterested,
    setServicesInterested,
    itConsultingData,
}: any) => {
    const deviceType = useDeviceType()
    const [openItServices, setOpenItServices] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setOpenItServices(true)
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
                }} >Services Experience</p>
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
                }}>Services in use / will be helpful in future</p>
            </div>
            <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", height: '60%', marginTop: '20px' }}>

                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "50%", }}>
                    <ListItem sx={{
                        pl: 2, border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", background: colors.lightPrimary,
                        borderBottomLeftRadius: openItServices ? "0px" : "5px",
                        borderBottomRightRadius: openItServices ? "0px" : "5px",
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
                        {(servicesInterested?.length > 0) && (<Checkbox
                            checked={servicesInterested?.length > 0 ? true : false}
                            onChange={() => { }}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={{
                                '&.Mui-checked': {
                                    color: colors.graniteGrey,
                                },
                            }}
                        />)}

                        <ListItemText primary={"IT Services"} />
                        <IconButton onClick={() => { setOpenItServices(!openItServices) }}>
                            {openItServices ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItem>
                    <Collapse in={openItServices} sx={{
                        width: '100%',
                        border: `1px solid ${colors.snowywhite}`,
                        borderBottomLeftRadius: openItServices ? "5px" : "5px",
                        borderBottomRightRadius: openItServices ? "5px" : "5px",
                    }} timeout="auto" unmountOnExit>
                        <CollapsibleTree data={itConsultingData} selectedItems={servicesInterested} setSelectedItems={setServicesInterested} />
                    </Collapse>
                </div>

                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "50%", }}>
                  
                </div>


            </div>
        </div>
    )
}

export default TechProfSetup3
