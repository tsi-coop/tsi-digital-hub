import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import colors from '../../../assets/styles/colors';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => string;
}



const TSITable = ({ columns, rows, actions }: any) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState<any>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper elevation={0} sx={{ width: '100%', height: '100%', overflowY: 'scroll', scrollbarWidth: "none", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <TableContainer sx={{ height: '90%' }}>
                <Table stickyHeader aria-label="custom table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column: any, index: any) => (
                                <TableCell key={index} align={column.align} style={{ minWidth: column.minWidth, backgroundColor: colors.white, color: colors.black, fontWeight: 600, fontSize: "14px" }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, rowIndex: any) => (
                            <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={rowIndex}
                                sx={{
                                    backgroundColor: colors.white,
                                    "& .MuiTableRow-root.MuiTableRow-hover": {
                                        backgroundColor: colors.lightPrimary,
                                    },
                                }}

                            >
                                {columns?.filter((item: any, index: any) => item.id !== "action").map((column: any, index: any) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell
                                            key={index}
                                            align={column.align}
                                            sx={{ backgroundColor: 'inherit' }}
                                        >
                                            {column.format && typeof value === 'number' ? column.format(value) || "NA" : value || "NA"}
                                        </TableCell>
                                    );
                                })}
                                <TableCell align="center" sx={{ backgroundColor: 'inherit' }}>
                                    <button
                                        onClick={(event) => handleClick(event, row)}
                                        style={{
                                            padding: 0, margin: 0,
                                            textAlign: "center",
                                            backgroundColor: "transparent",
                                            border: "0px solid transparent"
                                        }}>
                                        <MoreVertOutlinedIcon sx={{ width: '20px', height: "20px" }} />
                                    </button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        elevation={1}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >

                                        {actions?.map((action: any, index: any) => (
                                            <MenuItem key={index} onClick={() => { action.onClick(selectedRow); handleClose(); }}>
                                                {action.label}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                sx={{
                    overflow: 'hidden',
                    '& .css-7mt0f-MuiTablePagination-root': {
                        scrollbarWidth: "none"
                    }
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default TSITable;
