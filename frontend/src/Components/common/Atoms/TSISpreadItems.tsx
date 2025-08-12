import React from 'react'
import colors from '../../../assets/styles/colors'

const TSISpreadItems = ({ items }: any) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', paddingTop: "2px", flexWrap: "wrap" }}>
            {
                items?.map((item: string, index: number) => (
                    <div
                        key={index}
                        style={{
                            padding: "4px 10px",
                            borderRadius: "100px",
                            backgroundColor: colors.lightPrimary,
                            color: colors.darkblack,
                            fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "18px",
                            letterSpacing: "0.16px",
                            textAlign: "left",
                        }}
                    >
                        {item}
                    </div>
                ))
            }

        </div>
    )
}

export default TSISpreadItems
