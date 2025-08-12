import React, { useState } from 'react'
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown'
import TSIMultipleDropdown from '../../common/Atoms/TSIMultipleDropdown'
import useDeviceType from '../../../Utils/DeviceType'
import TSITextfield from '../../common/Atoms/TSITextfield'
import TSIDocUpload from '../../common/Atoms/TSIDocUpload'


const TechProfSetup6 = ({

}: any) => {
    const deviceType = useDeviceType()
    const [emailids, setEmailIds] = useState([])
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
                }}>Upload KYC Document</p>
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
                }}>Loren ipsum is simply dummy text</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '15px', width: deviceType == "mobile" ? "100%" : "50%", marginTop: '20px' }}>

                <TSISingleDropdown
                    name={"Document Type"}
                    setFieldValue={setEmailIds}
                    fieldvalue={emailids}
                    dropdown={[
                        'kenzi.lawson@example.com',
                        'jackson@example.com',
                        'debra.holt@example.com',
                        'georgia@example.com',
                        'tanya.hill@example.com',
                    ]}
                />
                <TSITextfield
                    title={"Document ID"}
                    placeholder={""}
                    value={""}
                    isRequired={true}
                    type={"text"}
                    name={"field"}
                    multiline={false}
                    rows={1}
                    handleChange={() => { }}
                    previewMode={false}
                />

                <TSIDocUpload
                    imgCardLabel={"Document Upload"}
                />



            </div>
        </div>
    )
}

export default TechProfSetup6
