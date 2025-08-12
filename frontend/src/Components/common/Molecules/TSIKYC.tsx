import { Avatar, Badge, Button, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import colors from '../../../assets/styles/colors'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TSIButton from '../Atoms/TSIButton';
import TSIEditUserProfile from './TSIEditUserProfile';
import TSIEditBasicDetails from './TSIEditBasicDetails';
import TSIConfirmationModal from './TSIConfirmationModal';
import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TSIKYCAddModal from './TSIKYCAddModal';

const TSIKYC = () => {
  const [isEditUserProfile, setisEditUserProfile] = useState(false)
  const [isEditBasic, setisEditBasic] = useState(false)
  const [isKYCOpen, setIsKYCOpen] = useState<any>(false);
  const [isDelete, setIsDelete] = useState<any>(false);
  const Style: any = {
    fontFamily: "OpenSans",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "0.5px",
    textAlign: "left",
    margin: 0,
    padding: 0,
    color: colors.lightgrey
  }

  return (
    <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%', height: "100%" }}>

      <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', }}>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '2px', gap: '15px', }}>


          <p
            style={{
              fontFamily: "OpenSans",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "32.68px",
              textAlign: "left",
              textUnderlinePosition: "from-font",
              textDecorationSkipInk: "none",
              color: colors.black,
              padding: 0,
              margin: 0
            }}
          >{"KYC"}</p>

        </div>
        <Button
          onClick={() => { setIsKYCOpen(true) }}
          sx={{
            width: "auto",
            height: "32px",
            padding: "5px",
            paddingLeft: "10px",
            paddingRight: '10px',
            gap: "2px",
            borderRadius: "100px",
            backgroundColor: colors.primary,
            border: `1px solid ${colors.primary}`
          }}>
          <Add sx={{
            width: "20px",
            height: "15px",
            color: colors.white
          }} />
          <Typography sx={{
            fontFamily: "OpenSans",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "0.10000000149011612px",
            textAlign: "center",
            color: colors.white,
            textTransform: "capitalize"
          }}>Update KYC</Typography>
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", borderBottom: "1px solid #BEC9C7" }}>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '2px', gap: '15px', }}>


          <p
            style={{
              fontFamily: "OpenSans",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "32.68px",
              textAlign: "left",
              textUnderlinePosition: "from-font",
              textDecorationSkipInk: "none",
              color: colors.black,
              padding: 0,
              margin: 0
            }}
          >{"Voter ID"}</p>

        </div>
        <Button
          onClick={() => { setisEditUserProfile(true) }}
          sx={{
            width: "auto",
            height: "32px",
            padding: "5px",
            paddingLeft: "10px",
            paddingRight: '10px',
            gap: "2px",
            borderRadius: "100px",
            backgroundColor: colors.white,
            border: `1px solid ${colors.primary}`
          }}>
          <EditOutlinedIcon sx={{
            width: "20px",
            height: "15px",
            color: colors.primary
          }} />
          <Typography sx={{
            fontFamily: "OpenSans",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "0.10000000149011612px",
            textAlign: "center",
            color: colors.primary,
            textTransform: "capitalize"
          }}>Edit</Typography>
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "20px", }}>


        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
          <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
            <p style={Style}>Document Id</p>
          </div>
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
            <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>034925743589</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
          <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
            <p style={Style}>Document</p>
          </div>
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
            <span style={{ marginRight: '10px' }}>:</span><div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: '10px', width: '100%' }}>
              <div style={{
                width: "35px",
                height: "35px",
                backgroundColor: colors.lightPrimary,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: 'center'
              }}>
                <UploadFileIcon sx={{ color: colors.primary, width: '25px', height: "25px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '5px', width: '100%' }}>
                <p
                  style={{
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "22.4px",
                    textAlign: "left",
                    margin: 0,
                    padding: 0
                  }}
                >document_file_name.pdf</p>

              </div>


            </div>
          </div>
        </div>


      </div>
      {/* <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "flex-start", gap: '0px', width: '100%', height: "100%" }}>
        <TSIButton
          name={"Delete Account"}
          disabled={false}
          variant={'outlined'}
          padding={"5px 10px"}
          load={false}
          isCustomColors={true}
          customOutlineColor={`1px solid ${colors.browngrey}`}
          customOutlineColorOnHover={`1px solid ${colors.browngrey}`}
          customBgColorOnhover={colors.white}
          customBgColor={colors.white}
          customTextColorOnHover={colors.primary}
          customTextColor={colors.primary}
          handleClick={
            () => {
              setIsDelete(true)
            }
          }
        />
      </div> */}
      {(isEditUserProfile) && (<TSIEditUserProfile
        open={isEditUserProfile}
        setIsOpen={setisEditUserProfile}
        title={"Edit User Profile"}
        buttonName1={"Cancel"}
        buttonName2={"Save"}
        btn2Color={colors.primary}
        onClick={() => { }}
      />)}
      {(isEditBasic) && (<TSIEditBasicDetails
        open={isEditBasic}
        setIsOpen={setisEditBasic}
        title={"Edit Basic Details"}
        buttonName1={"Cancel"}
        buttonName2={"Save"}
        btn2Color={colors.primary}
        onClick={() => { }}
      />)}

      <TSIKYCAddModal
        isOpen={isKYCOpen}
        setIsOpen={setIsKYCOpen}
        onSubmit={() => { }}
      />

      <TSIConfirmationModal
        open={isDelete}
        title={"Delete Application"}
        desc={"Are you sure you want to delete this application?"}
        buttonName1={"No"}
        buttonName2={"Yes, Delete"}
        btn2Color={colors.primary}
        onClose={() => { setIsDelete(false) }}
        onClick={() => { setIsDelete(false) }}
      />
    </div>
  )
}

export default TSIKYC
