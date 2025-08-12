import React, { useState } from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import colors from '../../../assets/styles/colors';
const SupportCard = ({ row, setRowData, setOpenChangeReqModal }: any) => {
    const [isHover, setIsHover] = useState(false)
    const columns: any[] = [
        { id: 'type', label: 'Request Type', minWidth: 150 },
        { id: 'query', label: 'Query', minWidth: 300 },
        { id: 'status', label: 'Status', minWidth: 100 },
        // { id: 'changestatus', label: 'Change Status', minWidth: 100 },
    ];
    return (
        <div
            onMouseEnter={() => { setIsHover(true) }}
            onMouseLeave={() => { setIsHover(false) }}
            style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", borderBottom: `0.5px solid ${colors.snowywhite}`, boxShadow: `20px 20px 50px ${colors.lightmediumSnowyWhite}`, gap: '10px', padding: '20px', borderRadius: '0px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, cursor: "pointer", }}>

            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: '5px'
            }}>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: '14px',
                    fontWeight: "bold",
                    color: colors.primary,
                    margin: 0
                }}>
                    Request Type : <span style={{
                        fontFamily: "OpenSans",
                        fontSize: '12px',
                        fontWeight: "bold",
                        color: colors.black
                    }}>
                        {row?.type}
                    </span>
                </p>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: '14px',
                    fontWeight: "bold",
                    color: colors.primary,
                    margin: 0
                }}>
                    Query : <span style={{
                        fontFamily: "OpenSans",
                        fontSize: '12px',
                        fontWeight: "bold",
                        color: colors.black
                    }}>
                        {row?.query}
                    </span>
                </p>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: '5px'
            }}>
                <button
                    style={{
                        border: `1px solid transparent`,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        color: colors.primary,
                        cursor: 'default',
                    }}
                >
                    {row.status}
                </button>
                <span style={{
                    color: colors.lightgrey,
                    fontSize: "14px",
                    fontWeight: 400,
                }}>{row?.time_ago}</span>
               
            </div>



        </div>
    )
}

export default SupportCard
