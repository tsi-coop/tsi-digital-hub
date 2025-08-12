import { Box } from "@mui/material";
import React, { useState } from "react";
import colors from "../../../assets/styles/colors";

const TSIEditor = ({
    title,
    placeholder,
    content,
    setContent,
    isRequired = false,
    maxLength = 4000
}: any) => {
    const [isFocused, setIsFocused] = useState(false);

    const showLabelAsFloating = isFocused || content?.length > 0;

    return (
        <Box
            sx={{
                position: "relative",
                padding: "10px",
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                height: '100px',
                fontSize: "14px",
                fontFamily: 'OpenSans',
                borderRadius: '5px',
                border: `1px solid ${showLabelAsFloating ? colors.primary : colors.lightPrimaryBorder}`,
                '&:hover': {
                    borderColor: colors.primary,
                },
            }}
        >
            <Box
                component="label"
                sx={{
                    position: "absolute",
                    top: showLabelAsFloating ? "-10px" : "10px",
                    left: "10px",
                    fontSize: showLabelAsFloating ? "12px" : "15px",
                    fontWeight: 500,
                    color: showLabelAsFloating ? colors.grey : colors.grey,
                    backgroundColor: "white",
                    padding: "0 4px",
                    transition: "0.2s ease all",
                }}
            >
                {title}
                {(isRequired) && (<Box component="span" sx={{ color: colors.black, marginLeft: "2px" }}>*</Box>)}
            </Box>

            <textarea
                rows={6}
                cols={40}
                title={title}
                value={content}
                style={{ border: '0px solid transparent', outline: 'none', resize: "none", fontSize: '16px', fontFamily: 'OpenSans', width: '100%', }}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={showLabelAsFloating ? placeholder : ""}
                maxLength={maxLength}
            />
        </Box>
    );
};

export default TSIEditor;
