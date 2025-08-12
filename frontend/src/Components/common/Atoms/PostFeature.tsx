import React from 'react'
import { Button } from '@mui/material'
const PostFeature = ({ icon, count, onHandleClick }: any) => {
    return (
        <button
            onClick={() => { onHandleClick() }}
            style={{
                display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: '5px', fontFamily: "OpenSans",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "0.10000000149011612px",
                textAlign: "center",
                border: "0px solid transparent",
                backgroundColor: "transparent",
                cursor:'pointer'
            }}>
            {icon} {count}
        </button>
    )
}

export default PostFeature
