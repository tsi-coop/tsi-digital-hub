import React, { memo } from 'react';
import { officialLogo } from '../../../../assets';
import TSIButton from '../TSIButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
export function Header() {

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "#F4FBF9",
                height: "100px",
                width: '100%'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "space-between", width: '85%' }}>
                <img src={officialLogo} style={{
                    width: "105.39px",
                    height: "62.98px",
                    top: "3%",
                    left: "5%",
                }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: "50px" }}>
                    {["HOME", "ABOUT US", "FAQ'S", "CONTACT US"].map((item, index) => (
                        <span key={index} style={{
                            color: "#000000",
                            fontFamily: "OpenSans",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "21px",
                        }}>{item}</span>
                    ))}

                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "space-between", gap: '20px', }}>
                    <TSIButton
                        name={"Register"}
                        variant='contained'
                        trailingIcon={<KeyboardArrowDownIcon sx={{ color: "#FFF" }} />}
                        isCustomColors={"#FFF"}
                        customBgColor={"#006A67"}
                        customTextColor={"#FFF"}
                        customBgColorOnhover={"#006A67"}
                        customTextColorOnHover={"#FFF"}
                        customOutlineColor={"transparent"}
                        customOutlineColorOnHover={"transparent"}
                        padding={"4px 15px"}
                        handleClick={() => { }}
                    />

                    <TSIButton
                        name={"Login"}
                        variant='outlined'
                        isCustomColors={"#FFF"}
                        customBgColor={"#F4FBF9E5"}
                        customTextColor={"#006A67"}
                        customBgColorOnhover={"#F4FBF9E5"}
                        customTextColorOnHover={"#006A67"}
                        customOutlineColor={"transparent"}
                        customOutlineColorOnHover={"transparent"}
                        padding={"4px 15px"}
                        handleClick={() => { }}
                    />

                </div>

            </div>


        </div>
    );
}

export default memo(Header);