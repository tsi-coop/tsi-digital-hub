import React from 'react'
import TSICircularProgress from './TSICircularProgress'
import { officialLogo } from '../../../assets'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material';
import colors from '../../../assets/styles/colors';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: colors.yellow,
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: colors.primary,
        ...theme.applyStyles('dark', {
            backgroundColor: colors.blue,
        }),
    },
}));
const StepupHeader = ({ value }: any) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center", gap: '20px', width: "100%", height: '20%', }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: '20px', width: "100%", }}>
                <img src={officialLogo} style={{
                    width: "105.39px",
                    height: "62.98px",
                }} alt='/blank' />

                <TSICircularProgress
                    value={value}
                />
            </div>
            {/* <BorderLinearProgress variant="determinate" value={value} sx={{ width: '100%', height: 3 }} /> */}
        </div>
    )
}

export default StepupHeader
