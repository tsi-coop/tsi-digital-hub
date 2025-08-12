import React from 'react'
import { account, adminB, ComB, enqB, jobB, meeting, orgB, postB, pzB, rfpB, serB, solB, talB, testB, trB } from '../../../assets'
import colors from '../../../assets/styles/colors'
import useDeviceType from '../../../Utils/DeviceType'

const TSIDashboard = () => {
    const deviceType = useDeviceType()
    const sidebarItems: any = [
        { id: 'business', label: 'Business', icon: ComB, number: 50 },
        { id: 'solutions', label: 'Solutions', icon: solB, number: 50 },
        { id: 'services', label: 'Services', icon: serB, number: 50 },
        { id: 'professionals', label: 'Professionals', icon: account, number: 50 },
        { id: 'jobs', label: 'Jobs', icon: jobB, number: 50 },
        { id: 'training', label: 'Training', icon: trB, number: 50 },
    ]
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap", gap: '10px' }}>
            {sidebarItems.map((item: any, index: any) => (
                <div style={{ width: deviceType == "mobile" ? "100%" : "30%", height: '100px', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", borderRadius: '12px', border: "0.5px solid #6F7978", padding: '10px', gap: '10px' }}>
                    <div style={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: '20px', }}>
                        <div style={{
                            width: 45,
                            height: 45,
                            borderRadius: '50px',
                            backgroundColor: colors.lightPrimary,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <img src={item?.icon} style={{ width: '24px', height: '24px' }} />
                        </div>
                        <span style={{
                            fontFamily: "OpenSans",
                            fontWeight: 700,
                            fontSize: "24px",
                            lineHeight: " 140%",
                            letterSpacing: "0%",
                            color: colors.primary,
                        }}>
                            {item.number}
                        </span>
                    </div>
                    <span style={{
                        fontFamily: "OpenSans",
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: "140%",
                        letterSpacing: "0%",
                    }}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default TSIDashboard
