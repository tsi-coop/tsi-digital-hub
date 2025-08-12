import { List, ListItem, ListItemText, Collapse, IconButton, Switch, Checkbox, Modal, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { CollapsibleTree2 } from '../Atoms/CollapsibleList2';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';

const TSICommunityFilterModal = ({
    isOpen,
    setIsOpen,
    filteringList,
    setFilteringList,
    onSubmit,
}: any) => {
    const deviceType = useDeviceType()
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([])
    const [servicesData, setServicesData] = useState<any>([])
    const [skillData, setSkillData] = useState<any>([])

    const [industry, setIndustry] = useState<any>("healthcare")
    const [openIndustrySolutions, setOpenIndustrySolutions] = useState(false)
    const [openServices, setOpenServices] = useState(false)
    const [openSkills, setOpenSkills] = useState(false)
    const [openCategory, setOpenCategory] = useState(false)
    // const [selectedindSolutions, setSelectedindSolutions] = useState<any>([])
    // const [selectedServices, setSelectedServices] = useState<any>([])
    // const [selectedSkills, setSelectedSkills] = useState<any>([])
    const [load, setLoad] = useState(false)

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, item: string) => {
        setSelectedItems((prevSelected) =>
            event.target.checked
                ? [...prevSelected, item] // Add item if checked
                : prevSelected.filter((selectedItem) => selectedItem !== item) // Remove if unchecked
        );
    };

    const getIndustrySolutions = () => {
        setLoad(true)
        const body = {
            "_func": "get_industry_solutions_tree",
            "industry_slug": industry
        }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setIndustrySolutionsData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }


    const getServices = () => {
        setLoad(true)
        const body = { "_func": "get_services_tree" }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setServicesData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getSkills = () => {
        setLoad(true)
        const body = { "_func": "get_skills_tree" }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setSkillData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }



    useEffect(() => {
        getIndustrySolutions()
        getServices()
        getSkills()
    }, [])

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "small-tablet" ? "40%" : deviceType == "tablet" ? "35%" : '35%',
        height: '90%',
        padding: "0px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '2px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };



    return (
        <Modal
            open={isOpen}
            onClose={() => { setIsOpen(false); }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        width: '100%',
                        borderBottom: `1px solid ${colors.snowywhite}`,
                        height: '10%',
                        padding: '20px',
                    }}
                >
                    <span style={{
                        fontFamily: "OpenSans",
                        fontSize: "24px",
                        fontWeight: 600,
                        textAlign: "left",
                    }}>
                        Filter By
                    </span>
                    <button onClick={() => { setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
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
                        padding: '10px 20px',
                        overflowY: "scroll",
                        scrollbarWidth: 'none',
                        height: '80%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: "space-between",
                            width: '100%',
                            padding: 0,
                            paddingRight: '0px',
                            paddingBottom: '10px'
                        }}
                    >
                        <span style={{
                        }}>

                        </span>
                        <Button onClick={() => { setFilteringList([]); setIsOpen(false) }} style={{ backgroundColor: "transparent", border: '0px solid transparent', color: colors.primary, margin: 0, padding: 0 }}>
                            Clear
                        </Button>

                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: '100%',
                            gap:'15px'
                        }}
                    >

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            width: '100%',
                            scrollbarWidth: 'none',
                        }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: '100%',
                                scrollbarWidth: 'none',
                            }}
                            >
                                <p style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    lineHeight: "25.2px",
                                    textAlign: "left",
                                    padding: "0px",
                                    margin: 0
                                }}>Category</p>
                                <IconButton onClick={() => { setOpenCategory(!openCategory) }}>
                                    {openCategory ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </div>

                            <Collapse in={openCategory} sx={{ width: '100%' }} timeout="auto" unmountOnExit>
                                {["All", "Announcements", "Meetups", "Technical", "Advisory", "Miscellaneous"].map((item, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '5px', width: "100%" }}>
                                        <Checkbox
                                            checked={selectedItems.includes(item)}
                                            onChange={(event) => handleCheckboxChange(event, item)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: colors.primary,
                                                },
                                            }}
                                        />
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "16px",
                                            fontWeight: 400,
                                            lineHeight: "24px",
                                            letterSpacing: "0.5px",
                                            textAlign: "left",
                                            color: colors.black
                                        }}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </Collapse>

                        </div>
                        <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", borderTop: `1px solid ${colors.snowywhite}` }}>
                            <ListItem sx={{
                                pl: 2, borderRadius: "5px",
                                padding: "0px",
                                borderBottomLeftRadius: openIndustrySolutions ? "0px" : "5px",
                                borderBottomRightRadius: openIndustrySolutions ? "0px" : "5px",
                                width: '100%',
                                '& .css-10b8wcc-MuiListItem-root': {
                                    padding: "0px",
                                    paddingBottom: '0px'
                                },
                                '& .MuiListItem-root': {
                                    padding: "0px",
                                    paddingBottom: '0px'
                                },
                                '& .css-1wg5ebk-MuiList-root': {
                                    padding: "0px",
                                    paddingBottom: '0px',
                                    borderRadius: "5px",
                                },
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            lineHeight: "24px",
                                            letterSpacing: "0.5px",
                                            textAlign: "left",
                                        }}>{"Solutions"}</span>
                                        <IconButton onClick={() => { setOpenIndustrySolutions(!openIndustrySolutions) }}>
                                            {openIndustrySolutions ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </div>
                                    <ListItem sx={{ pl: 4, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", width: '100%', }}>
                                        <Checkbox
                                            checked={openIndustrySolutions}
                                            onChange={() => { setOpenIndustrySolutions(!openIndustrySolutions) }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: colors.primary,
                                                },
                                            }}
                                        />
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            lineHeight: "24px",
                                            letterSpacing: "0.5px",
                                            textAlign: "left",
                                        }}>{"Industry Solutions"}</span>
                                        <IconButton onClick={() => { setOpenIndustrySolutions(!openIndustrySolutions) }}>
                                            {openIndustrySolutions ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </ListItem>
                                </div>
                            </ListItem>
                            <Collapse in={openIndustrySolutions} sx={{ width: '100%' }} timeout="auto" unmountOnExit>
                                <CollapsibleTree2
                                    data={industrySolutionsData}
                                    selectedItems={filteringList}
                                    setSelectedItems={setFilteringList}
                                />
                            </Collapse>
                        </div>


                        <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", borderTop: `1px solid ${colors.snowywhite}` }}>
                            <ListItem sx={{
                                pl: 2, borderRadius: "5px",
                                padding: "0px",
                                borderBottomLeftRadius: openIndustrySolutions ? "0px" : "5px",
                                borderBottomRightRadius: openIndustrySolutions ? "0px" : "5px",
                                width: '100%',
                                '& .css-10b8wcc-MuiListItem-root': {
                                    padding: "0px",
                                    paddingBottom: '0px'
                                },
                                '& .MuiListItem-root': {
                                    padding: "0px",
                                    paddingBottom: '0px'
                                },
                                '& .css-1wg5ebk-MuiList-root': {
                                    padding: "0px",
                                    paddingBottom: '0px',
                                    borderRadius: "5px",
                                },
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            lineHeight: "24px",
                                            letterSpacing: "0.5px",
                                            textAlign: "left",
                                        }}>{"Service"}</span>
                                        <IconButton onClick={() => { setOpenServices(!openServices) }}>
                                            {openServices ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </div>

                                </div>
                            </ListItem>
                            <Collapse in={openServices} sx={{ width: '100%' }} timeout="auto" unmountOnExit>
                                <CollapsibleTree2
                                    data={servicesData}
                                    selectedItems={filteringList}
                                    setSelectedItems={setFilteringList}
                                />
                            </Collapse>
                        </div>


                        <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", borderTop: `1px solid ${colors.snowywhite}` }}>
                            <ListItem sx={{
                                pl: 2, borderRadius: "5px",
                                padding: "0px",
                                borderBottomLeftRadius: openSkills ? "0px" : "5px",
                                borderBottomRightRadius: openSkills ? "0px" : "5px",
                                width: '100%',
                                '& .css-10b8wcc-MuiListItem-root': {
                                    padding: "0px",
                                    paddingBottom: '0px'
                                },
                                '& .MuiListItem-root': {
                                    padding: "0px",
                                    paddingBottom: '0px'
                                },
                                '& .css-1wg5ebk-MuiList-root': {
                                    padding: "0px",
                                    paddingBottom: '0px',
                                    borderRadius: "5px",
                                },
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            lineHeight: "24px",
                                            letterSpacing: "0.5px",
                                            textAlign: "left",
                                        }}>{"Skills"}</span>
                                        <IconButton onClick={() => { setOpenSkills(!openSkills) }}>
                                            {openSkills ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </div>

                                </div>
                            </ListItem>
                            <Collapse in={openSkills} sx={{ width: '100%' }} timeout="auto" unmountOnExit>
                                <CollapsibleTree2
                                    data={skillData}
                                    selectedItems={filteringList}
                                    setSelectedItems={setFilteringList}
                                />
                            </Collapse>
                        </div>


                    </div>
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
                        gap: '20px',
                        padding: '15px'
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
                                setIsOpen(false)
                            }
                        }
                    />
                    <TSIButton
                        name={"Save"}
                        disabled={false}
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
                                onSubmit()
                                setIsOpen(false)
                            }
                        }
                    />
                </div>
            </div>
        </Modal >
    )
}

export default TSICommunityFilterModal
