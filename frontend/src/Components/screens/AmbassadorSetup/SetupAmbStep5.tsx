import React, { useEffect, useState } from 'react'
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown'
import TSIMultipleDropdown from '../../common/Atoms/TSIMultipleDropdown'
import useDeviceType from '../../../Utils/DeviceType'
import TSITextfield from '../../common/Atoms/TSITextfield'
import { Checkbox, Collapse, IconButton, ListItem, ListItemText } from '@mui/material'
import colors from '../../../assets/styles/colors'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { CollapsibleTree } from '../../common/Atoms/CollapsibleList'


const SetupAmbStep5 = ({
    trainingInterested,
    setTrainingInterested,
    trainingData,
    setTrainingData,
}: any) => {
    const deviceType = useDeviceType()
    const [openTraining, setOpenTraining] = useState(false)
    
    useEffect(() => {
        setTimeout(() => {
            setOpenTraining(true)
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
                }} >Suitable Training needed for your Business</p>
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
                }}>Solutions in use / will be helpful in future</p>
            </div>
            <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", height: '60%', marginTop: '20px' }}>



                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "50%", }}>
                    <ListItem sx={{
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
                        {(trainingInterested?.length > 0) && (<Checkbox
                            checked={trainingInterested?.length > 0 ? true : false}
                            onChange={() => { }}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={{
                                '&.Mui-checked': {
                                    color: colors.graniteGrey,
                                },
                            }}
                        />
                        )}
                        <ListItemText primary={"Training"} />
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
                        <CollapsibleTree data={trainingData} selectedItems={trainingInterested} setSelectedItems={setTrainingInterested} />
                    </Collapse>
                </div>

                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "50%", }}>
                    
                </div>
            </div>
        </div >
    )
}

export default SetupAmbStep5
