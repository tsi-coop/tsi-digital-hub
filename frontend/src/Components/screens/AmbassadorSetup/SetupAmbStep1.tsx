import React, { useEffect, useState } from 'react'
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown'
import TSIMultipleDropdown from '../../common/Atoms/TSIMultipleDropdown'
import useDeviceType from '../../../Utils/DeviceType'
import TSITextfield from '../../common/Atoms/TSITextfield'

const SetupAmbStep1 = ({
    about,
    setAbout,
    setIndustry,
    industry,
    indVerticles,
}: any) => {
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")



    if (!load) {
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
                        paddingBottom: '10px'
                    }} >Basic Ambassador Details</p>
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
                    }}>Join our platform to explore the offerings</p>
                </div>
                <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-between", alignItems: "flex-start", gap: '20px', width: "100%", }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "100%" : "100%", height: '60%', marginTop: '20px' }}>
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
                        />

                        {/* <TSISingleDropdown
                            name={"Industry"}
                            setFieldValue={(selectedValue: string) => {
                                setIndustry(selectedValue);
                                // setSubType("")
                            }}
                            fieldvalue={industry}
                            dropdown={indVerticles?.map((item: any) => item.value) || []}
                        /> */}
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

export default SetupAmbStep1
