import { Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import CloseIcon from '@mui/icons-material/Close';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import apiInstance from '../../../services/authService';
import TSITextfield from '../Atoms/TSITextfield';
const TSIEditCompanyBasicDetails = ({ open, setIsOpen, title, buttonName1, buttonName2, btn2Color, data, industry, setIndustry, category, setCategory, numEmployees, setNumEmployees, numofEmployees, setNumofEmployees, about,
    setAbout, state, setState, startYear, setStartYear, city, setCity, indVerticles, setIndVerticles, states, setStates, stateCities, setStateCities, categoryValues, setCategoryValues }: any) => {
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }

    const getItemByValue = (array: any, value: any) => {
        const item = array.find((item: any) => item.value === value);
        return item ? item : null;
    };




    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '35%',
        height: '80%',
        padding: "10px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
        border: '0px solid #000',
        borderRadius: '5px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => (currentYear - i).toString());
    return (
        <Modal
            open={open}
            onClose={() => { setIsOpen(false) }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
                {(!load) ? (<div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        gap: '0px',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            padding: '10px',
                            width: '100%',
                            height: '90%',
                            gap: '10px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: '100%',
                                height: '10%',
                            }}
                        >
                            <Typography
                                style={{
                                    color: '#1D2020',
                                    fontFamily: "OpenSansMedium",
                                    fontSize: deviceType === 'mobile' ? '20px' : '24px',
                                    fontStyle: 'normal',
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    margin: '0px',
                                }}
                            >
                                {title}
                            </Typography>
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
                                height: '90%',
                                overflowY: 'scroll',
                                scrollbarWidth: 'none',
                                gap: '20px',
                                paddingTop: "10px"
                            }}
                        >
                            <TSITextfield
                                title={"About"}
                                placeholder={`Enter About`}
                                value={about}
                                type={"text"}
                                name={"field"}
                                multiline={true}
                                rows={3}
                                handleChange={(event: any) => { setAbout(event.target.value) }}
                            />
                            <TSISingleDropdown
                                name={"Industry"}
                                setFieldValue={setIndustry}
                                fieldvalue={industry}
                                dropdown={indVerticles?.map((item: any) => item.value) || []}
                            />
                            <TSISingleDropdown
                                name={"Category"}
                                setFieldValue={setCategory}
                                fieldvalue={category}
                                dropdown={categoryValues.map((item: any) => item.value) || []}
                            />
                            {/* <TSISingleDropdown
                                name={"Sub Type"}
                                setFieldValue={setSubType}
                                fieldvalue={subType}
                                dropdown={indSubtypes.map((item: any) => item.value) || []}
                            /> */}

                            <TSISingleDropdown
                                name={"No. of Employess"}
                                setFieldValue={setNumofEmployees}
                                fieldvalue={numofEmployees}
                                dropdown={numEmployees.map((item: any) => item.value) || []}
                            />
                            <TSISingleDropdown
                                name={"Year"}
                                setFieldValue={(selectedValue: string) => {
                                    setStartYear(selectedValue);
                                }}
                                fieldvalue={startYear || ""}
                                dropdown={years}
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
                            />
                            <TSISingleDropdown
                                name={"City (Nearest City) "}
                                setFieldValue={setCity}
                                fieldvalue={city}
                                dropdown={stateCities.map((item: any) => item.value)}
                            />

                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "center",
                            width: '100%',
                            height: '10%',
                            padding: '10px',
                            gap: '5px',
                            borderTop: `1px solid ${colors.grey80}`
                        }}
                    >
                        <TSIButton
                            name={"Okay"}
                            disabled={false}
                            variant={'outlined'}
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
                                    setIsOpen(false)
                                }
                            }
                        />
                        {/* <TSIButton
                            name={buttonName2}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${btn2Color}`}
                            customOutlineColorOnHover={`1px solid ${btn2Color}`}
                            customBgColorOnhover={btn2Color}
                            customBgColor={btn2Color}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    // handleEditProfessionalData()
                                }
                            }
                        /> */}
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

export default TSIEditCompanyBasicDetails
