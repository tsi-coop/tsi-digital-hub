import React from 'react'
import { officialLogo, websitebackground } from '../../../../assets'
import Accordion from '../Accordion'
import { TSIWebCard } from './TSIWebCard'

const Container = () => {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", height: '90vh',
            width: "100%",
            overflowY: "scroll",
            scrollbarWidth: 'none',
        }}>
            <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", width: "100%", paddingTop: '35px', paddingBottom: '35px', borderBottom: "1px solid #BEC9C7",
            }}>

                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: "22px",
                    fontWeight: 600,
                    lineHeight: "30px",
                    letterSpacing: "0.10000000149011612px",
                    textAlign: "center",
                    color: "#006A67",
                    textShadow: ' 0 0 2px rgba(50, 48, 48, 0.30), 0 0 4px rgba(50, 48, 48, 0.30)',
                    margin: 0,
                    width: '85%'
                }}>
                    The TSI Coop platform will be designed to offer a Digital Solutions Hub for Indian businesses and a Connect & Thrive Module for technology professionals focusing on the domestic market.
                </p>
            </div>
            <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: "100%", backgroundImage: `url(${websitebackground})`, gap: '10px',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <div style={{
                    display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: "85%", paddingTop: '80px', gap: '50px'

                }}>
                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", width: "100%", gap: '30px'
                    }}>

                        <div style={{
                            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: "50%", gap: '20px'
                        }}>
                            <p style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "left",
                                color: '#006A67',
                                margin: 0,
                                padding: '0px'
                            }}>SOLUTIONS</p>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Solution A"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Solution B"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                        </div>
                        <div style={{
                            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: "50%", gap: '20px'
                        }}>
                            <p style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "left",
                                color: '#006A67',
                                margin: 0,
                                padding: '0px'
                            }}>TRAININGS</p>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Training A"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Training B"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                        </div>

                    </div>
                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", width: "100%", gap: '30px'
                    }}>

                        <div style={{
                            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: "50%", gap: '20px'
                        }}>
                            <p style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "left",
                                color: '#006A67',
                                margin: 0,
                                padding: '0px'
                            }}>SERVICES</p>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Services A"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Services B"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                        </div>
                        <div style={{
                            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: "50%", gap: '20px'
                        }}>
                            <p style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "left",
                                color: '#006A67',
                                margin: 0,
                                padding: '0px'
                            }}>TALENTS</p>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Talents B"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                            <div style={{
                                width: '100%',
                                height: '180px',
                            }}>
                                <TSIWebCard title={"Talents B"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."} />

                            </div>
                        </div>

                    </div>

                </div>
                <div style={{
                    display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: "100%", paddingTop: '150px', paddingBottom: '150px', 

                }}>
                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", width: "85%", gap: '50px',
                    }}>
                        <div style={{
                            width: '50%',
                            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '10px'
                        }}>
                            <p style={{
                                margin: 0,
                                padding: 0,
                                color: "#006A67",
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "left",
                            }}>FAQ'S</p>
                            <p style={{
                                margin: 0,
                                padding: 0,
                                color: "#006A67",
                                fontFamily: "OpenSans",
                                fontSize: "36px",
                                fontWeight: 700,
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "left",
                            }}>Frequently Asked Question</p>
                            <p style={{
                                margin: 0,
                                padding: 0,
                                color: "#1D2020",
                                fontFamily: "OpenSans",
                                fontSize: "16px",
                                fontWeight: 400,
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "left",
                            }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet.
                            </p>
                        </div>
                        <div style={{
                            width: '50%',
                            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '10px'
                        }}>
                            <Accordion title={"Why Section 8 co-op?"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."} />

                            <Accordion title={"Who are the members of the co-op?"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."} />

                            <Accordion title={"Is the services free?"} desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."} />
                        </div>

                    </div>
                </div>

            </div>
            <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "flex-start", width: "100%", backgroundColor: "#F4FBF9E5",
            }}>

                <div style={{
                    display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", width: "85%", backgroundColor: "#F4FBF9E5",
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '40px', paddingTop: '20px', width: "40%", }}>
                        <img src={officialLogo} style={{
                            width: "105.39px",
                            height: "62.98px",
                            top: "3%",
                            left: "5%",
                        }} />

                        <p style={{
                            fontFamily: "OpenSans",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "28px",
                            textAlign: "left",
                            margin: 0,
                            padding: 0
                        }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center", padding: '20px', paddingTop: '40px', paddingBottom: '40px', width: "60%", }}>
                        <div style={{
                            display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", width: "100%", backgroundColor: "#F4FBF9E5",
                            fontFamily: "OpenSans",
                            fontWeight: 600,
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '20px', gap: '20px', width: "30%", }}>
                                <p style={{ margin: 0, padding: 0, fontSize: "14px" }}>ABOUT US</p>
                                <p style={{ margin: 0, padding: 0, fontSize: "14px" }}>FAQS</p>
                                <p style={{ margin: 0, padding: 0, fontSize: "14px" }}>CONTACT US</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '20px', gap: '20px', width: "30%", }}>
                                <p style={{ margin: 0, padding: 0, fontSize: "14px" }}>PRIVACY POLICY</p>
                                <p style={{ margin: 0, padding: 0, fontSize: "14px" }}> TERMS & CONDITIONS</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '20px', gap: '20px', width: "30%", }}>
                                <p style={{ margin: 0, padding: 0, fontSize: "14px" }}> tsicoop@gmail.com</p>
                                <p style={{ margin: 0, padding: 0, fontSize: "14px" }}>  (+91) 8765432180</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Container
