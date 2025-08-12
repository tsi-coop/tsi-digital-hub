import colors from "../../../assets/styles/colors";

const TSISelection = ({ selected, setSelected, options }: any) => {

    return (
        <div
            style={{
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            <p style={{
                fontFamily: "OpenSans",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "22.4px",
                letterSpacing: "-0.02em",
                textAlign: "left",
                textUnderlinePosition: "from-font",
                textDecorationSkipInk: "none",
                padding: 0,
                margin: 0,
                paddingBottom: '10px'
            }}>
                Select User Type
            </p>
            <div
                style={{
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    gap: '15px'
                }}
            >
                {options.map((item: any, index: any) => (
                    <button
                        key={index}
                        onClick={() => {
                            // if (item.name == selected) {
                            //     setSelected("")
                            // } else {
                            setSelected(item.name)
                            // }
                        }}
                        style={{
                            borderRadius: "8px",
                            border: selected === item.name ? "2px solid #0F5755" : `0.84px solid ${colors.lightPrimaryBorder}`, // Conditionally apply border
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: "center",
                            padding: '20px',
                            maxHeight: "125px",
                            // width: '150px',
                            gap: '10px',
                            backgroundColor: selected === item.name ? colors.lightPrimary : "transparent", // Conditionally apply background color
                            cursor: "pointer"
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: "center",
                            width: '34px',
                            height: '34px'
                        }}>
                            <img src={item?.icon} alt={`${item.name} icon`} style={{
                                width: '36px',
                                height: '36px'
                            }} />
                        </div>
                        <p
                            style={{
                                fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: selected === item.name ? 600 : 500,
                                lineHeight: "17.05px",
                                letterSpacing: "0.15px",
                                textAlign: "center",
                                color: selected === item.name ? "#1D2020" : colors.lightgrey,
                                padding: 0,
                                margin: 0,
                            }}
                        >
                            {item.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TSISelection;
