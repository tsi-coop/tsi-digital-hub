import { useState } from "react";
import { Typography } from "@mui/material";
import colors from "../../../assets/styles/colors";
import { ExpandMore } from "@mui/icons-material";

const TSIAccordion = ({ icon, title, desc }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                borderRadius: "10px",
                border: "none",
                backgroundColor: colors.white,
                // boxShadow: "0px 0px 9px 2px #0000001A",
                fontFamily: "OpenSans",
                padding: "2px",
                width: '100%',
                height: "auto"
            }}
        >
            <div
                // onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "10px",
                }}
            >
                <div style={{
                     display: "flex",
                     flexDirection:"row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                     gap:'10px'
                }}>
                    <img src={icon} style={{
                        width:'14px',
                        height:"18px"
                    }} />
                    <Typography sx={{
                        fontFamily: "OpenSans",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "20px",
                    }}>{title}</Typography>
                </div>
                {/* <ExpandMore sx={{ color: "#006A67", transform: isOpen ? "rotate(180deg)" : "none" }} /> */}
            </div>
            {
                isOpen && (
                    <div style={{ marginTop: "10px", padding: '10px', backgroundColor: colors.white, borderRadius: "10px", fontSize: '14px' }}>
                        {desc}
                    </div>
                )
            }
        </div >
    );
};

export default TSIAccordion;
