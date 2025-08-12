import { Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import CloseIcon from '@mui/icons-material/Close';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import TSITextfield from '../Atoms/TSITextfield';

const TSIEditProfessionalBasicDetails = ({
    open, setIsOpen, title, btn2Color,
    about, setAbout,
    professionalIncome, setProfessionalIncome,
    profIncome, setProfIncome,
    state, setState,
    startYear, setStartYear,
    city, setCity,
    indVerticles, states, stateCities,
    genders, colleges, disabilities,
    college, setCollege,
    disability, setDisability,
    gender, setGender,
    industry, setIndustry,
    experience,
    setExperience
}: any) => {
    const deviceType = useDeviceType();

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType === "mobile" ? "75%" : "35%",
        height: '80%',
        padding: "10px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
        borderRadius: '5px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => (currentYear - i).toString());

    // When modal opens, determine experience based on data
    useEffect(() => {
        if (industry) {
            setExperience("Experienced");
        } else {
            setExperience("Fresher");
        }
    }, [open]);

    const handleExperienceChange = (value: string) => {
        setExperience(value);
        if (value === "Fresher") {
            setIndustry("");
            setStartYear("");
        } else {
            setCollege("");
            setProfIncome("");
            setDisability("");
        }
    };

    const handleCollegeChange = (value: string) => {
        setCollege(value);
        if (value !== "Tier-3 or Rural College") {
            setProfIncome("");
            setDisability("");
        }
    };

    const handleStateChange = (selectedValue: string) => {
        const selectedState = states.find((item: any) => item.value === selectedValue);
        if (selectedState) {
            setState({ key: selectedState.key, value: selectedState.value });
        } else {
            setState({ key: "", value: "" });
        }
        setCity("");
    };

    return (
        <Modal
            open={open}
            onClose={() => setIsOpen(false)}
            sx={{ border: "0px solid transparent" }}
        >
            <div style={style}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: '100%',
                            padding: '10px',
                        }}
                    >
                        <Typography
                            style={{
                                color: '#1D2020',
                                fontFamily: "OpenSansMedium",
                                fontSize: deviceType === 'mobile' ? '20px' : '24px',
                                fontWeight: '600',
                            }}
                        >
                            {title}
                        </Typography>
                        <button onClick={() => setIsOpen(false)} style={{ backgroundColor: "transparent", border: 'none' }}>
                            <CloseIcon sx={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '0 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            width: '100%',
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            scrollbarWidth: "none"
                        }}
                    >
                        <TSITextfield
                            title="About"
                            placeholder="Enter About"
                            value={about}
                            type="text"
                            name="about"
                            multiline
                            rows={3}
                            handleChange={(e: any) => setAbout(e.target.value)}
                        />

                        <TSISingleDropdown
                            name="Experience"
                            setFieldValue={handleExperienceChange}
                            fieldvalue={experience}
                            dropdown={["Fresher", "Experienced"]}
                        />

                        {experience === "Experienced" && (
                            <>
                                <TSISingleDropdown
                                    name="Industry"
                                    setFieldValue={setIndustry}
                                    fieldvalue={industry}
                                    dropdown={indVerticles.map((item: any) => item.value)}
                                />
                                <TSISingleDropdown
                                    name="Career Start Year"
                                    setFieldValue={setStartYear}
                                    fieldvalue={startYear || ""}
                                    dropdown={years}
                                />
                            </>
                        )}

                        {experience === "Fresher" && (
                            <TSISingleDropdown
                                name="College"
                                setFieldValue={handleCollegeChange}
                                fieldvalue={college}
                                dropdown={colleges.map((item: any) => item.value)}
                            />
                        )}

                        {college === "Tier-3 or Rural College" && (
                            <>
                                <TSISingleDropdown
                                    name="Professional Income"
                                    setFieldValue={setProfIncome}
                                    fieldvalue={profIncome}
                                    dropdown={professionalIncome.map((item: any) => item.value)}
                                />
                                <TSISingleDropdown
                                    name="Disability"
                                    setFieldValue={setDisability}
                                    fieldvalue={disability}
                                    dropdown={disabilities.map((item: any) => item.value)}
                                />
                            </>
                        )}

                        <TSISingleDropdown
                            name="Gender"
                            setFieldValue={setGender}
                            fieldvalue={gender}
                            dropdown={genders.map((item: any) => item.value)}
                        />

                        <TSISingleDropdown
                            name="Year"
                            setFieldValue={setStartYear}
                            fieldvalue={startYear || ""}
                            dropdown={years}
                        />

                        <TSISingleDropdown
                            name="State"
                            setFieldValue={handleStateChange}
                            fieldvalue={state?.value || ""}
                            dropdown={states.map((item: any) => item.value)}
                        />

                        <TSISingleDropdown
                            name="City (Nearest City)"
                            setFieldValue={setCity}
                            fieldvalue={city}
                            dropdown={stateCities.map((item: any) => item.value)}
                        />
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            borderTop: `1px solid ${colors.grey80}`,
                            padding: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            flexDirection: "row",
                        }}
                    >
                        <TSIButton
                            name="Okay"
                            disabled={false}
                            variant="contained"
                            padding={deviceType === "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors
                            customOutlineColor={`1px solid ${btn2Color}`}
                            customOutlineColorOnHover={`1px solid ${btn2Color}`}
                            customBgColorOnhover={btn2Color}
                            customBgColor={btn2Color}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TSIEditProfessionalBasicDetails;
