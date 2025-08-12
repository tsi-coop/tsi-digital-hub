import React, { useState } from 'react'
import { badge } from '../../../assets'
import colors from '../../../assets/styles/colors'
import { Slider } from '@mui/material';


const BadgePoster = ({ assessmentReport }: any) => {
    const [sliderValue, setSliderValue] = useState(assessmentReport?.rating);

    const handleSliderChange = (event: any, newValue: any) => {
        setSliderValue(newValue);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: '20px'
        }}>
            <div style={{
                width: "59px",
                height: '59px',
                borderRadius: "5px",
                backgroundColor: "rgb(227, 240, 237)",
                display: 'flex',
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <img src={badge} style={{
                    width: "28px",
                    height: "35px",
                }} alt='/blank' />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start"
            }}>
                <p style={{
                    margin: 0, padding: 0,
                    fontFamily: "OpenSansSemiBold",
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: "28px",
                    textAlign: "left",
                    textUnderlinePosition: "from-font",
                    textDecorationSkipInk: "none",
                    color: colors.primary
                }}>{assessmentReport?.rating_summary}</p>
                <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onChangeCommitted={() => {

                    }}
                    valueLabelDisplay="auto"
                    // step={Math.round(10000 / CurrencyData[currency])}
                    marks
                    min={0}
                    disabled={true}
                    // max={Math.round((1000000 / CurrencyData[currency]) / 1000) * 1000}
                    max={10}
                    sx={{
                        '& .MuiSlider-thumb': {
                            color: colors.primary,
                            backgroundColor: colors.primary,
                            border: '1px solid #FFF',
                            boxShadow: 'none',
                        },
                        '& .MuiSlider-rail': {
                            color: colors.yellow,
                            backgroundColor: colors.yellow,
                            height: '8px',
                        },
                        '& .MuiSlider-mark': {
                            display: 'none',
                        },
                        '& .MuiSlider-track': {
                            color: colors.primary,
                            backgroundColor: colors.primary,
                            height: '8px',
                        },
                        '& .MuiSlider-valueLabelOpen': {
                            color: colors.primary,
                            backgroundColor: colors.lightPrimaryBorder,
                        },
                    }}
                />
                <p style={{
                    margin: 0, padding: 0,
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "28px",
                    textAlign: "left",
                    textUnderlinePosition: "from-font",
                    textDecorationSkipInk: "none",
                    color: colors.black
                }}>Last Assessed Date : {assessmentReport?.report_date}</p>

            </div>

        </div>
    )
}

export default BadgePoster
