import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSIDropdown from '../Atoms/TSIDropdown';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import TSISwitch from '../Atoms/TSISwitch';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { List, ListItem, ListItemText, Collapse, IconButton, Switch, Checkbox, Modal } from '@mui/material';
import { CollapsibleTree } from '../Atoms/CollapsibleList';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import TSIFileUpload from '../Atoms/TSIFileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
const TSIAddTalentModal = ({
    isOpen,
    setIsOpen,
    onSubmit,
    title,
    tree1Title,
    tree2Title
}: any) => {
    const deviceType = useDeviceType()
    const [whenLaunched, setWhenLaunched] = useState("")
    const [keyFeatures, setKeyFeatures] = useState("")
    const [benifits, setBenifits] = useState("")
    const [positioning, setPositioning] = useState("")
    const [talentTitle, setTalentTitle] = useState("")
    const [collaterals, setCollaterals] = useState([])
    const [collateralDetails, setCollateralDetails] = useState([])
    const [numofCustomers, setNumofCustomers] = useState("")
    const [preview, setPreview] = useState(false)
    const [industry, setIndustry] = useState<any>('healthcare')
    const [load, setLoad] = useState(false)

    const [openTalentTags, setOpenTalentTags] = useState<any>(false)
    const [selectedTalent, setSelectedTalent] = useState<any>(false)

    const [selectedSourcing, setSelectedSourcing] = useState<any>([])

    const [openSkills, setOpenSkills] = useState<any>([])
    const [selectedSkills, setSelectedSkills] = useState<any>([])

    const [skillData, setskillData] = useState<any>([])
    const [status, setStatus] = useState(false)
    const [collateralid, setCollateralId] = useState("")
    const [deactivate, setDeactivate] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getSkills = () => {
        setLoad(true)
        const body = { "_func": "get_skills_tree" }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setskillData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    useEffect(() => {
        getSkills()
    }, [])

    const addTalentData = () => {
        setLoad(true)
        const body = {
            "_func": "add_talent",
            "talent_title": talentTitle,
            "positioning": positioning,
            // "collaterals": [collateralid],
            "collaterals": [],
            "start_year": parseInt(whenLaunched),
            "num_customers_range": numofCustomers,
            "industry": industry,
            "state": "KA",
            "city": "Bengaluru",
            "talent_tags": selectedTalent,
            "skills_used": ["python", "mysql", "metabase"]
        }

        apiInstance.addTalent(body)
            .then((response: any) => {
                if (response.data._added) {
                    setIsOpen(false)
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Talent post added successful",
                    })
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Something went wrong",
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
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "55%" : deviceType == "tablet" ? "50%" : '50%', height: '80%',
        padding: deviceType == "mobile" ? "15px" : "20px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };

    const grpstyle: any = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: '100%',
        gap: '5px'
    }
    const titleStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }
    const valueStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "22.4px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }

    const sourcingTags: any = [
        { id: "full-time", label: "Fulltime" },
        { id: "contract", label: "Contract" },
        { id: "flexi", label: "Flexi" },
        { id: "on-demand", label: "OnDemand" }
    ]

    return (
        <Modal
            open={isOpen}
            onClose={() => { setIsOpen(false); setPreview(false) }}
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
                {(!load) ? (<div style={{ width: '100%', height: "100%" }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: "space-between",
                            width: '100%',
                            borderBottom: `1px solid ${colors.snowywhite}`,
                            height: '8%'
                        }}
                    >
                        <span style={{
                            fontFamily: "OpenSans",
                            fontSize: "25px",
                            fontWeight: 400,
                            textAlign: "left",
                        }}>
                            {!preview ? `Add ${title}` : "Preview Talent"}
                        </span>
                        <button onClick={() => { setPreview(false); setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                            <CloseIcon sx={{ width: '20px', height: '20px' }} />
                        </button>

                    </div>
                    {(!preview) && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                width: '100%',
                                padding: '15px',
                                marginTop: '20px',
                                overflowY: "scroll",
                                scrollbarWidth: 'none',
                                height: '80%'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: "flex-start",
                                    justifyContent: 'center',
                                    width: '100%',
                                    gap: '20px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '20px',
                                        width: '50%',
                                    }}
                                >
                                    <TSITextfield
                                        title={`${title} Title`}
                                        placeholder={`Enter ${title} Title`}
                                        value={talentTitle}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        multiline={false}
                                        rows={1}
                                        handleChange={(event: any) => { setTalentTitle(event.target.value) }}
                                    />

                                    <TSITextfield
                                        title={"Key Features"}
                                        placeholder={"Enter Key Features"}
                                        value={keyFeatures}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        multiline={false}
                                        rows={1}
                                        handleChange={(event: any) => { setKeyFeatures(event.target.value) }}
                                    />


                                    <TSISingleDropdown
                                        name={"No. of customers"}
                                        setFieldValue={setNumofCustomers}
                                        fieldvalue={numofCustomers}
                                        dropdown={[
                                            '0-15',
                                            '15-25',
                                            '25-35',
                                            '35-45',
                                            '45-55',
                                            '55-65',
                                            '65-75',
                                            '75-85',
                                            '85-95',
                                        ]}
                                    />


                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '20px',
                                        width: '50%',
                                    }}
                                >
                                    <TSITextfield
                                        title={"Positioning"}
                                        placeholder={"Enter Positioning"}
                                        value={positioning}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        multiline={false}
                                        rows={1}
                                        handleChange={(event: any) => { setPositioning(event.target.value) }}
                                    />

                                    <TSITextfield
                                        title={"Benefits"}
                                        placeholder={"Enter Benefits"}
                                        value={benifits}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        multiline={false}
                                        rows={1}
                                        handleChange={(event: any) => { setBenifits(event.target.value) }}
                                    />

                                    <TSITextfield
                                        title={"When Launched"}
                                        placeholder={"Enter When Launched"}
                                        value={whenLaunched}
                                        isRequired={true}
                                        type={"number"}
                                        name={"field"}
                                        multiline={false}
                                        rows={1}
                                        handleChange={(event: any) => {
                                            if (event.target.value.length < 5) {
                                                setWhenLaunched(event.target.value)
                                            }
                                        }}
                                    />

                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '40px', alignItems: 'center', width: "100%" }}>
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "18px",
                                            fontWeight: 600,
                                            lineHeight: "25.2px",
                                            textAlign: "left",
                                            color: colors.black
                                        }}>
                                            Status
                                        </span>
                                        <TSISwitch checkstatus={status} setStatus={setStatus} />
                                    </div>

                                </div>
                            </div>
                            {/* <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    marginTop: '20px',
                                }}
                            >
                                <TSIFileUpload
                                    uploadedImage={"Upload File"}
                                    uploadTitle={"Drop a file or click to upload"}
                                    imgCardLabel={"Collaterals"}
                                    name={""}
                                    fileType={""}
                                    fileSize={""}
                                    isRequired={false}
                                    setUploadedImage={() => { }}
                                    previewMode={false}
                                    showToastMessage={true}
                                    showDownloadIcon={false}
                                    leadingIcon={<UploadFileIcon />}
                                    downloadFile={(fileData: any) => { }}
                                    fileDataArray={collaterals}
                                    fileDataArrayDetails={collateralDetails}
                                    setFileDataArrayDetails={setCollateralDetails}
                                    setFileDataArray={setCollaterals}
                                    collateralid={collateralid}
                                    setCollateralId={setCollateralId}
                                />
                            </div> */}

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: "flex-start",
                                    justifyContent: 'center',
                                    gap: '20px',
                                    width: '100%',
                                    marginTop: '20px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '20px',
                                        width: '50%',
                                    }}
                                >

                                    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                        <ListItem sx={{
                                            pl: 2, borderRadius: "5px",
                                            padding: "0px",
                                            borderBottomLeftRadius: "5px",
                                            borderBottomRightRadius: "5px",
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
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', paddingBottom: '10px' }}>
                                                    <span style={{
                                                        fontFamily: "OpenSans",
                                                        fontSize: "16px",
                                                        fontWeight: 600,
                                                        lineHeight: "24px",
                                                        letterSpacing: "0.5px",
                                                        textAlign: "left",
                                                    }}>{"Solution Tags"}</span>

                                                </div>

                                            </div>
                                        </ListItem>
                                        <Collapse in={true} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }} timeout="auto" unmountOnExit>
                                            <CollapsibleTree
                                                data={sourcingTags}
                                                selectedItems={selectedSourcing}
                                                setSelectedItems={setSelectedSourcing}
                                            />
                                        </Collapse>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '20px',
                                        width: '50%',
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                        <ListItem sx={{
                                            pl: 2, borderRadius: "5px",
                                            padding: "0px",
                                            borderBottomLeftRadius: openTalentTags ? "0px" : "5px",
                                            borderBottomRightRadius: openTalentTags ? "0px" : "5px",
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
                                                    }}>{"Skills Used"}</span>
                                                    <IconButton onClick={() => { setOpenSkills(!openSkills) }}>
                                                        {openSkills ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                </div>

                                            </div>
                                        </ListItem>
                                        <Collapse in={openSkills} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", }} timeout="auto" unmountOnExit>
                                            <CollapsibleTree
                                                data={skillData}
                                                selectedItems={selectedSkills}
                                                setSelectedItems={setSelectedSkills}
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
                                    justifyContent: "flex-start",
                                    gap: '20px',
                                    width: '100%',
                                }}
                            >
                                <Checkbox
                                    checked={deactivate}
                                    onChange={(event) => { setDeactivate(event.target.checked); }}
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
                        </div>
                    )}

                    {(preview) && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                width: '100%',
                                padding: '10px',
                                paddingTop: '0px',
                                marginTop: '20px',
                                overflowY: "scroll",
                                scrollbarWidth: 'none',
                                height: '80%',
                                gap: '10px'
                            }}
                        >
                            <div style={grpstyle}>
                                <p style={titleStyle}>{`${title} Title`}</p>
                                <p style={valueStyle}>{talentTitle}</p>
                            </div>

                            <div style={grpstyle}>
                                <p style={titleStyle}>Positioning</p>
                                <p style={valueStyle}>{positioning}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Key Features</p>
                                <p style={valueStyle}>{keyFeatures}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Benefits</p>
                                <p style={valueStyle}>{benifits}</p>
                            </div>
                            {/* <div style={grpstyle}>
                                <p style={titleStyle}>Collaterals</p>
                                <p style={valueStyle}>{collaterals}</p>
                            </div> */}
                            <div style={grpstyle}>
                                <p style={titleStyle}>When Launched</p>
                                <p style={valueStyle}>{whenLaunched}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>No. of customers</p>
                                <p style={valueStyle}>{numofCustomers}</p>
                            </div>

                            <div style={grpstyle}>
                                <p style={titleStyle}>{`${title} Tags`}</p>
                                <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', }}>


                                    <TSISpreadItems items={selectedSourcing || []} />

                                </div>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Skills Used</p>
                                <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', }}>


                                    <TSISpreadItems items={selectedSkills || []} />

                                </div>
                            </div>

                        </div>
                    )}
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
                        {(preview) && (<TSIButton
                            name={"Edit"}
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
                                    setPreview(!preview)
                                }
                            }
                        />)}
                        <TSIButton
                            name={"Add"}
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
                                    if (preview == false) {
                                        setPreview(true)
                                    } else {
                                        // onSubmit()
                                        addTalentData()
                                    }
                                }
                            }
                        />
                    </div>
                </div>) : (
                    <div className="centered-container">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </Modal >
    )
}

export default TSIAddTalentModal
