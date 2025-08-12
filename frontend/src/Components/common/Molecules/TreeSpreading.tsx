import { Collapse, IconButton, ListItem } from '@mui/material'
import React, { useState } from 'react'
import { CollapsibleTree } from '../Atoms/CollapsibleList'
import colors from '../../../assets/styles/colors'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

const TreeSpreading = ({ data, setSelected, selected, title, isOpen = false }: any) => {
    const [open, setOpen] = useState(isOpen ? true : false)
    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
            <ListItem sx={{
                pl: 2, borderRadius: "5px",
                padding: "0px",
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
                width: '100%',
                '& .css-10b8wcc-MuiListItem-root': {
                    padding: "0px",
                    paddingBottom: '0px'
                },
                '& .MuiListItem-root': {
                    padding: "0px",
                    paddingBottom: '0px'
                },
                '& .css-1wg5ebk-MuiList-root': {
                    padding: "0px",
                    paddingBottom: '0px',
                    borderRadius: "5px",
                },
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', paddingBottom: '10px' }}>
                        <span style={{
                            fontFamily: "OpenSans",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "24px",
                            letterSpacing: "0.5px",
                            textAlign: "left",
                        }}>{title}</span>
                        <IconButton onClick={() => { setOpen(!open) }}>
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </div>

                </div>
            </ListItem>
            <Collapse in={open} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }} timeout="auto" unmountOnExit>
                <CollapsibleTree
                    data={data}
                    selectedItems={selected}
                    setSelectedItems={setSelected}
                />
            </Collapse>
        </div>
    )
}

export default TreeSpreading
