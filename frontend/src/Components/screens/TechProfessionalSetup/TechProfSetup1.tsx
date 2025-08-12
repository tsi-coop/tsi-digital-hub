import React, { useEffect, useState } from 'react'
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown'
import TSIMultipleDropdown from '../../common/Atoms/TSIMultipleDropdown'
import useDeviceType from '../../../Utils/DeviceType'
import TSITextfield from '../../common/Atoms/TSITextfield'
import apiInstance from '../../../services/authService'

const TechProfSetup1 = ({
    setCity,
    city,
    state,
    setState,
    experience, 
    setExperience,
    gender,
    setGender,
    setIndustry,
    industry,
    houseHoldIncome,
    setHouseHoldIncome,
    disability,
    setDisability,
    college,
    setCollege,
    indVerticles,
    states,
    stateCities,
    setStartYear,
    startYear,
    mobile,
    setMobile,
    about,
    setAbout,
    professionalIncome,
    genders,
    colleges,
    disabilities,
}: any) => {
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
   
    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '0px', width: "100%", }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: "100%", }}>
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
                    }} >Basic Details</p>
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
                        marginTop: '-20px'
                    }}>Join our platform to explore the opportunities</p>
                    <TSITextfield
                        title={`About`}
                        placeholder={`Enter About`}
                        value={about}
                        type={"text"}
                        name={"field"}
                        multiline={true}
                        maxLength={1000}
                        rows={4}
                        handleChange={(event: any) => { setAbout(event.target.value) }}
                    />

                </div>

                <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-between", alignItems: "flex-start", gap: '20px', width: "100%", paddingBottom: deviceType == "mobile" ? "10px" : "0px" }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap", gap: '20px', width: "100%", marginTop: '20px' }}>
                        <div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
                            <TSISingleDropdown
                                name="Experience"
                                setFieldValue={setExperience}
                                fieldvalue={experience}
                                dropdown={["Fresher", "Experienced"]}
                            />
                        </div>
                        {(experience == "Experienced") && (<div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
                            <TSISingleDropdown
                                name={"Industry"}
                                setFieldValue={setIndustry}
                                fieldvalue={industry}
                                dropdown={indVerticles?.map((item: any) => item.value) || []}
                            />
                        </div>)}
                        <div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
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
                        </div>
                        <div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
                            <TSISingleDropdown
                                name={"City"}
                                setFieldValue={setCity}
                                placeholder={"City (Nearest City)"}
                                fieldvalue={city}
                                dropdown={stateCities.map((item: any) => item.value)}
                            />
                        </div>
                        <div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
                            <TSISingleDropdown
                                name={"Gender"}
                                setFieldValue={setGender}
                                fieldvalue={gender}
                                dropdown={genders.map((item: any) => item.value) || [
                                    'Male',
                                    'Female',
                                ]}
                            />


                        </div>
                        {/* </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "100%" : "50%", marginTop: deviceType == "mobile" ? "10px" : '20px' }}> */}

                        {(experience == "Experienced")&&(<div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
                            <TSISingleDropdown
                                name={"Career Start Year"}
                                placeholder={"Select Career Start Year"}
                                value={startYear}
                                dropdown={[...Array(new Date().getFullYear() - 1990 + 1).keys()]
                                    .map(i => 1990 + i)
                                    .reverse()}
                                setFieldValue={(selectedOption: any) => setStartYear(selectedOption)}
                                previewMode={false}
                            />
                        </div>)}
                        {(experience == "Fresher")&&(<div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>

                            <TSISingleDropdown
                                name={"College"}
                                setFieldValue={setCollege}
                                fieldvalue={college}
                                dropdown={[...colleges].map((item: any) => item.value) || []}
                            />
                        </div>)}
                        {(college == "Tier-3 or Rural College") && (<div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
                            <TSISingleDropdown
                                name={"Household Income"}
                                setFieldValue={setHouseHoldIncome}
                                fieldvalue={houseHoldIncome}
                                dropdown={professionalIncome.map((item: any) => item.value) || [
                                    "<3L",
                                    "3L-5L", "5L-10L", "10L+",
                                ]}
                            />
                        </div>)}
                        {(college == "Tier-3 or Rural College") && (<div style={{ width: deviceType == "mobile" ? "100%" : "48%", }}>
                            <TSISingleDropdown
                                name={"Disability"}
                                setFieldValue={setDisability}
                                fieldvalue={disability}
                                dropdown={disabilities.map((item: any) => item.value) || [
                                    "None",
                                    "Low Vision",
                                    "Hearing Impairment",
                                    "Other"
                                ]}
                            />
                        </div>)}






                    </div>
                </div>
            </div >
        )
    } else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        )
    }
}

export default TechProfSetup1
