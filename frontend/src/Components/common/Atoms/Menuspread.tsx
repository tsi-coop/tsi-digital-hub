import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import colors from '../../../assets/styles/colors';

export default function Menuspread({ title, menuItems, activity, setActivity, select }: any) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const style: any = {
        fontFamily: "OpenSans",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "20px",
        textAlign: "center",
        textTransform: "capitalize"
    }


    return (
        <div style={{
            border: `1px solid ${colors.snowywhite}`,
            height: "32px",
            width: "auto",
            gap: "2px",
            borderRadius: "100px",
            display: 'flex',
            flexDirection: 'row',
            alignItems: "center",
            paddingLeft: "10px",
            paddingRight: '10px',
            justifyContent: 'center'
        }}>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <span style={{ ...style, color: colors.lightgrey, }}>{title}</span>
                <span style={{
                    ...style,
                    color: colors.black,
                    marginLeft: "5px"
                }}>{activity}</span>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems.map((item: any, index: any) => (
                    <MenuItem key={index}
                        sx={{
                            '&:hover': {
                                backgroundColor: colors.lightPrimary,
                            }
                        }}
                        onClick={() => { setActivity(item?.label); handleClose() }}>
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </div >
    );
}
