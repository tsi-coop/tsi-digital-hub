import React, { useEffect, useState } from 'react'
import colors from '../../../assets/styles/colors'
import TSIButton from '../Atoms/TSIButton';
import TSITable from './TSITable';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIAddEditUserModal from './TSIUserAddEditModal';
import TSIConfirmationModal from './TSIConfirmationModal';
import TSIEditUserRoleChange from './TSIEditUserRoleChange';
import TSIExportModal from '../Atoms/TSIExportModal';

const TSIExportData = () => {
    const [isDelete, setIsDelete] = useState<any>(false);
    const [isEditRole, setIsEditRole] = useState<any>(false);
    const [isUserOpen, setIsUserOpen] = useState<any>(false);
    const [isUserEditOpen, setIsUserEditOpen] = useState<any>(false);
    const [isExportData, setIsExportData] = useState<any>(false);
    const [load, setLoad] = useState(false)
    const [userData, setUserData] = useState([])
    const [isuserObj, setIsUserObj] = useState<any>({})
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handlegetUserData = () => {
        setLoad(true)
        const body = {
            "_func": "get_business_userlist"
        }

        apiInstance.getUserData(body)
            .then((response: any) => {
                if (response.data) {
                    setUserData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                })
            });
    }

    useEffect(() => {
        handlegetUserData()
    }, [])

    const actions = [
        { label: "Edit", onClick: (row: any) => { setIsUserEditOpen(true); setIsUserObj(row); } },
        { label: "Delete", onClick: (row: any) => { setIsDelete(true); setIsUserObj(row); } },
        // { label: "Role Change", onClick: (row: any) => { setIsEditRole(true); setIsUserObj(row); } },
    ];

    const handleDeleteUserData = () => {
        setLoad(true)
        const body = {
            "_func": "deactivate_user",
            "email": isuserObj?.email
        }

        apiInstance.getUserData(body)
            .then((response: any) => {
                if (response.data._deactivated) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Deactivation Successful",
                    })
                    setIsDelete(false)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Error something went wrong",
                    })
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                })
            });
    }


    const columns: any = [
        {
            id: 'created', label: 'Date', minWidth: 100, render: (row: any) => <>{row?.created?.split("T")[0]}</>,
        },
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 100 },
        { id: 'action', label: '', minWidth: 10, },
    ];

    if (!load) {
        return (
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%', height: "100%" }}>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MuiAlert
                        sx={{
                            backgroundColor: snackbar.severity == "error" ? colors.red : colors.primary
                        }}
                        elevation={6}
                        variant="filled"
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity as AlertColor}
                    >
                        {snackbar.message}
                    </MuiAlert>
                </Snackbar>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                    <p style={{
                        margin: 0,
                        paddingBottom: "10px",
                        fontFamily: "OpenSans",
                        fontSize: "20px",
                        fontWeight: 600,
                        lineHeight: "32.68px",
                        textAlign: "left",
                        textUnderlinePosition: "from-font",
                        textDecorationSkipInk: "none",
                    }}>
                        {/* Export Data */}
                    </p>
                    <TSIButton
                        name={"Export"}
                        disabled={false}
                        variant={'contained'}
                        padding={"5px 10px"}
                        load={false}
                        leadingIcon={<></>}
                        isCustomColors={true}
                        customOutlineColor={`0px solid ${colors.snowywhite}`}
                        customOutlineColorOnHover={`0px solid ${colors.snowywhite}`}
                        customBgColorOnhover={colors.primary}
                        customBgColor={colors.primary}
                        customTextColorOnHover={colors.white}
                        customTextColor={colors.white}
                        handleClick={
                            () => {
                                setIsExportData(true)
                            }
                        }
                    />
                </div>
                <TSITable
                    columns={columns}
                    rows={userData}
                    actions={actions} />
                <TSIConfirmationModal
                    open={isDelete}
                    title={"Delete Application"}
                    desc={"Are you sure you want to delete this application?"}
                    buttonName1={"No"}
                    buttonName2={"Yes, Delete"}
                    btn2Color={colors.primary}
                    onClose={() => { setIsDelete(false) }}
                    onClick={() => { handleDeleteUserData() }}
                />
                {(isUserOpen) && (<TSIAddEditUserModal
                    isOpen={isUserOpen}
                    setIsOpen={setIsUserOpen}
                    isuserObj={isuserObj}
                    setIsUserObj={setIsUserObj}
                    edit={false}
                />)}
                {(isUserEditOpen) && (<TSIAddEditUserModal
                    isOpen={isUserEditOpen}
                    setIsOpen={setIsUserEditOpen}
                    isuserObj={isuserObj}
                    setIsUserObj={setIsUserObj}
                    edit={true}
                />)}
                {(isEditRole) && (<TSIEditUserRoleChange
                    open={isEditRole}
                    userObj={isuserObj}
                    setIsOpen={() => { setIsEditRole(false); setIsUserObj({}) }}
                    title={"Role Change"}
                    buttonName1={"No"}
                    buttonName2={"Yes, Change"}
                    btn2Color={colors.primary}
                />)}

                {(isExportData) && (<TSIExportModal
                    isOpen={isExportData}
                    setIsOpen={() => { setIsExportData(false); }}

                />)}

            </div>
        )
    }
    else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default TSIExportData
