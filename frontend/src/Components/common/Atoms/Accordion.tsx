import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Typography } from "@mui/material";

const Accordion = ({ title, desc }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0px 0px 9px 2px #0000001A",
                fontFamily: "OpenSans",
                padding: "10px",
                width: '100%',
                height:"auto"
            }}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                }}
            >
                <Typography component="span">{title}</Typography>
                <AddCircleIcon sx={{ color: "#006A67", transform: isOpen ? "rotate(45deg)" : "none" }} />
            </div>
            {isOpen && (
                <div style={{ marginTop: "10px" }}>
                    {desc}
                </div>
            )}
        </div>
    );
};

export default Accordion;
