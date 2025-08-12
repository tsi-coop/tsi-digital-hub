import React, { useEffect, useState } from 'react'
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown'
import TSIMultipleDropdown from '../../common/Atoms/TSIMultipleDropdown'
import useDeviceType from '../../../Utils/DeviceType'
import TSITextfield from '../../common/Atoms/TSITextfield'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import apiInstance from '../../../services/authService'
const SetupProfileStep1 = ({
    setCity,
    city,
    state,
    setState,
    numberofEmp,
    setNumberofEmp,
    setSubType,
    subtype,
    category,
    setCategory,
    setIndustry,
    industry,
    stateCities,
    states,
    indVerticles,
    indSubtypes,
    categoryValues,
    setStartYear,
    startYear,
    mobile,
    setMobile,
    about,
    setAbout,
    numberOfEmployees,
    setNumberOfEmployees
}: any) => {
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")



    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '0px', width: "100%", }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start",  width: "100%",gap:'5px',paddingBottom:'30px' }}>
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
                    }} >Basic Business Details</p>
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
                        padding: 0,
                        paddingBottom: '10px'
                    }}>Join our platform to explore products & servies</p>
                </div>
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
                <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-between", alignItems: "flex-start", gap: '20px', width: "100%", }}>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "100%" : "50%", height: '60%', marginTop: '20px' }}>

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




                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "100%" : "50%", height: '60%', marginTop: '20px' }}>



                      
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





                    
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        )
    }
}

export default SetupProfileStep1
