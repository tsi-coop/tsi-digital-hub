import React from "react";
import useDeviceType from "../../../Utils/DeviceType";

const CustomCircularProgress = ({ value }: any) => {
    const radius = 36;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const progress = ((value || 0) / 100) * circumference;
    const size = "80px";
    const deviceType = useDeviceType()
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <svg
                width={deviceType === "mobile" ? "60px" : size}
                height={deviceType === "mobile" ? "60px" : size}
                viewBox="0 0 80 80"
            >
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#FFE087"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={"#006A67"}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                />
            </svg>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#666",
                    fontFamily: "OpenSans",
                    fontWeight: 600,
                    fontSize: "20px",
                    display:'flex',
                    flexDirection:'column'
                }}
            >
                <span style={{ margin: 0, padding: 0 }}>{`${Math.round(value)}`}</span>
                <span style={{ margin: 0, padding: 0 }}>{`%`}</span>
            </div>
        </div>
    );
};

export default CustomCircularProgress;
