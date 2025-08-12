import React, { useState } from 'react';
import { List, ListItem, ListItemText, Collapse, IconButton, Switch, Checkbox } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import colors from '../../../assets/styles/colors';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


export const CollapsibleTree = ({ data, selectedItems, setSelectedItems }: any) => {
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

    const handleToggleExpand = (key: string) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelectItem = (key: string) => {
        setSelectedItems((prev: any) =>
            prev.includes(key) ? prev.filter((item: any) => item !== key) : [...prev, key]
        );
    };

    const findChildrenKey = (node: any) => {
        return Object.keys(node).find(
            (key) => Array.isArray(node[key]) && node[key].every((item: any) => typeof item === 'object')
        );
    };


    const renderTree = (node: any) => {
        const labelKey = Object.keys(node).find((key) => typeof node[key] === 'string' && key.includes('val') || key.includes('value') || key.includes('label'));
        const idKey = Object.keys(node).find((key) => typeof node[key] === 'string' && key.includes('key') || key.includes('id'));
        const childrenKey: any = findChildrenKey(node);

        const label = node[labelKey || ''] || 'Unknown';
        const id = node[idKey || ''] || label;

        const checkStringsInChildren = (
            node: Record<string, any>,
            childrenKey: string,
            searchStrings: string[]
        ): boolean => {
            if (!Array.isArray(node[childrenKey])) return false;

            return node[childrenKey]?.some((child: Record<string, any>) =>
                Object.values(child)?.some(value =>
                    typeof value === "string" && searchStrings?.some(str => value.includes(str))
                )
            );
        };



        return (
            <List
                component="nav" disablePadding key={id}
                sx={{
                    width: '100%',
                    borderRadius: '5px',
                    paddingTop: "0px",
                    paddingBottom: '0px',
                    '& .css-10b8wcc-MuiListItem-root': {
                        paddingTop: "0px",
                        paddingBottom: '0px'
                    },
                    '& .MuiListItem-root': {
                        paddingTop: "0px",
                        paddingBottom: '0px'
                    },
                    '& .css-1wg5ebk-MuiList-root': {
                        paddingTop: "0px",
                        paddingBottom: '0px',
                        borderRadius: "5px",
                    },
                }}>
                <ListItem sx={{ pl: 2,  display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div style={{ display: 'flex', justifyContent: "flex-start", flexDirection: "row", padding: "5px", paddingLeft: "0px", gap: "5px" }}>
                        {(childrenKey) ? (


                            checkStringsInChildren(node, childrenKey, selectedItems) ?
                                <Checkbox
                                    checked={true}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: colors.graniteGrey,
                                        },
                                        padding: "0px"
                                    }}
                                />
                                : ""

                        ) : (
                            <Checkbox
                                checked={selectedItems?.includes(id)}
                                onChange={() => handleSelectItem(id)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                sx={{
                                    '&.Mui-checked': {
                                        color: colors.primary,
                                    },
                                    padding: "0px"
                                }}
                            />
                        )}

                        <span
                            onClick={() => {
                                if (childrenKey) {
                                    handleToggleExpand(id)
                                }
                            }}
                            style={{
                                fontFamily: "OpenSans",
                                fontSize: childrenKey ? "14px" : "12px",
                                fontWeight: childrenKey ? 600 : 400,
                                lineHeight: "24px",
                                letterSpacing: "0.5px",
                                textAlign: "left",
                            }}>{label} </span>
                    </div>
                    {(childrenKey) && (<IconButton onClick={() => handleToggleExpand(id)}>
                        {expanded[id] ? <ExpandMore /> : <KeyboardArrowRightIcon />}
                    </IconButton>)}
                </ListItem>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "flex-start",
                }}>
                    {childrenKey && (
                        <Collapse in={expanded[id]} sx={{ pl: 2 }} timeout="auto" unmountOnExit>
                            {node[childrenKey].map((child: any) => renderTree(child))}
                        </Collapse>
                    )}
                </div>
            </List>
        );
    };

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: "column",
            justifyContent: "flex-start",
        }}>
            {Array.isArray(data) ? data.map(renderTree) : renderTree(data)}
        </div>
    )
};

