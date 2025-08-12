import React, { useState } from 'react'
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown'
import TSIMultipleDropdown from '../../common/Atoms/TSIMultipleDropdown'
import useDeviceType from '../../../Utils/DeviceType'
import colors from '../../../assets/styles/colors'


const SetupProfileStep4 = ({

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
                }} >Invite Colleagues</p>
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
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '10px', width: deviceType == "mobile" ? "100%" : "50%", height: '60%', marginTop: '20px' }}>
                <TSIMultipleDropdown
                    name={"Email Ids"}
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
                    color: colors.lightgrey
                }}><span style={{ color: colors.black }}>Note:</span> All email ids should be in the same domain</p>

            </div>
        </div>
    )
}

export default SetupProfileStep4
