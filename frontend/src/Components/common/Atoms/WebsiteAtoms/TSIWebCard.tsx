import React, { useState } from 'react'

export const TSIWebCard = ({ title, desc }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                width: "100%",
                border: "2px solid #FFFFFF03",
                boxShadow: isHovered ? "0px 0px 10px 0px #00000050" : "0px 0px 10px 0px #00000014",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                height: "180px",
                transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                backgroundColor: "#D9D9D9",
                width: '35%',
                borderRadius: "4px"
            }}>

            </div>
            <div style={{
                backgroundColor: "#FFF",
                width: '65%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: '20px',
                gap: '10px'
            }}>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "26px",
                    textAlign: "left",
                    color: '#006A67',
                    padding: 0,
                    margin: 0
                }}>{title}</p>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "26px",
                    textAlign: "left",
                    color: '#000000',
                    padding: 0,
                    margin: 0
                }}>{desc}</p>

            </div>

        </div >
    )
}
