import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import useDeviceType from '../../../Utils/DeviceType';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { CollapsibleTree } from '../Atoms/CollapsibleList';

const TSIOrgPrefer = () => {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState<any>({});
  const deviceType = useDeviceType();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [openIndustrySolutions, setOpenIndustrySolutions] = useState(false)
  const [openGeneralItSolutions, setOpenGeneralItSolutions] = useState(false)

  const [about, setAbout] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState<any>({});
  const [industry, setIndustry] = useState('');
  const [indVerticles, setIndVerticles] = useState([]);
  const [subtype, setSubType] = useState('');
  const [states, setStates] = useState([]);
  const [indSubtypes, setIndSubtypes] = useState([]);
  const [numberofEmp, setNumberofEmp] = useState('');
  const [org_name, setOrgName] = useState('');
  const [startYear, setStartYear] = useState('');
  const [stateCities, setStateCities] = useState([]);
  const [numberOfEmployees, setNumberOfEmployees] = useState([]);
  const [categoryValues, setCategoryValues] = useState([]);
  const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([]);
  const [itConsultingData, setItConsultingData] = useState<any>([]);
  const [generalITSolutionsData, setGeneralITSolutionsData] = useState<any>([]);
  const [trainingData, setTrainingData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [generalITSolutions, setGeneralITSolutions] = useState([]);
  const [industrySolutions, setIndustrySolutions] = useState([]);

  const email: any = localStorage.getItem('email');

  const getItemByValue = (array: any, value: any) => {
    return array.find((item: any) => item.value === value) || null;
  };

  const handleDeleteAccount = () => {
    setLoad(true);
    const body = {
      _func: 'reject_application',
      id: 'dfe70cbb-1d42-4ad4-8ffc-a50adc7b62d9',
    };
    apiInstance
      .deleteAccount(body)
      .then((response: any) => { })
      .catch((error: any) => {
        setSnackbar({
          open: true,
          severity: 'error',
          message: error.message || 'Something went wrong',
        });
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const getData = (body: any, setState: any) => {
    setLoad(true);
    apiInstance
      .getLookUp(body)
      .then((response: any) => {
        if (response.data) {
          setState(response.data);
        }
      })
      .catch((error: any) => console.error('Error fetching data:', error))
      .finally(() => setLoad(false));
  };

  const fetchData = (
    body: object,
    setData: React.Dispatch<React.SetStateAction<any>>,
    successMessage: string = ''
  ) => {
    setLoad(true);
    apiInstance
      .getGetOptions(body)
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          setData(response.data);
          if (successMessage) {
            setSnackbar({
              open: true,
              severity: 'success',
              message: successMessage,
            });
          }
        } else {
          setSnackbar({
            open: true,
            severity: 'error',
            message: response.data?.code || 'Something went wrong',
          });
        }
      })
      .catch((error: any) => {
        setSnackbar({
          open: true,
          severity: 'error',
          message: error?.message || 'Something went wrong',
        });
      })
      .finally(() => setLoad(false));
  };

  const getOrgData = () => {
    const getDomainFromEmail = () => email?.split('@')[1] || null;
    const body = {
      _func: 'get_org_profile',
      account_slug: getDomainFromEmail(),
    };
    setLoad(true);
    apiInstance
      .viewORG(body)
      .then((response: any) => {
        if (response.data) {
          const org = response.data;
          setData(org);
         
          fetchData(
            { _func: 'get_industry_solutions_tree', industry_slug: org?.basic_details?.industry?.toLowerCase() },
            setIndustrySolutionsData
          );
        }
      })
      .catch((error: any) => console.error(error))
      .finally(() => setLoad(false));
  };

  useEffect(() => {
    fetchData({ _func: 'get_industry_verticals' }, setIndVerticles);
    // getData({ _func: 'lookup', type: 'ORG_NUM_EMP_RANGE' }, setNumberOfEmployees);
    // getData({ _func: 'lookup', type: 'ORG_CATEGORY' }, setCategoryValues);
    // fetchData({ _func: 'get_state_list' }, setStates);
    fetchData({ _func: 'get_general_it_solutions_tree' }, setGeneralITSolutionsData);
    fetchData({ _func: 'get_services_tree' }, setItConsultingData);
    fetchData({ _func: 'get_trainings_tree' }, setTrainingData);
    fetchData({ _func: 'get_skills_tree' }, setSkillsData);
  }, []);

  useEffect(() => {
    if (industry) {
      const item = getItemByValue(indVerticles, industry);
      if (item) {
        fetchData({ _func: 'get_industry_subtypes', industry_slug: item?.key }, setIndSubtypes);
      }
    }
  }, [industry]);

  useEffect(() => {
    
      getOrgData();
    
  }, []);

  if (load) return <div className="centered-container">
    <div className="loader"></div>
  </div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', gap: '10px', width: '100%' }}>
      <div style={{ paddingBottom: '20px', borderBottom: '1px solid #BEC9C7' }}>
          <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", marginTop: '20px' }}>

            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "50%", }}>

              <ListItem sx={{
                pl: 2, border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", background: colors.lightPrimary,
                paddingTop: "0px",
                paddingBottom: '0px',
                borderBottomLeftRadius: openIndustrySolutions ? "0px" : "5px",
                borderBottomRightRadius: openIndustrySolutions ? "0px" : "5px",
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
                {(industrySolutions?.length > 0) && (<Checkbox
                  checked={industrySolutions?.length > 0 ? true : false}
                  onChange={() => { }}
                  inputProps={{ 'aria-label': 'controlled' }}
                  sx={{
                    '&.Mui-checked': {
                      color: colors.graniteGrey,
                    },
                  }}
                />)}
                <ListItemText primary={"Industry Solutions"} />
                <IconButton onClick={() => { setOpenIndustrySolutions(!openIndustrySolutions) }}>
                  {openIndustrySolutions ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
              <Collapse in={openIndustrySolutions} sx={{
                width: '100%', border: `1px solid ${colors.snowywhite}`,
                borderBottomLeftRadius: openIndustrySolutions ? "5px" : "5px",
                borderBottomRightRadius: openIndustrySolutions ? "5px" : "5px",
              }} timeout="auto" unmountOnExit>
                <CollapsibleTree data={industrySolutionsData} selectedItems={industrySolutions} setSelectedItems={setIndustrySolutions} />
              </Collapse>
            </div>
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "50%", }}>
              <ListItem sx={{
                pl: 2, border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", background: colors.lightPrimary,
                borderBottomLeftRadius: openGeneralItSolutions ? "0px" : "5px",
                borderBottomRightRadius: openGeneralItSolutions ? "0px" : "5px",
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
                {(generalITSolutions?.length > 0) && (<Checkbox
                  checked={generalITSolutions?.length > 0 ? true : false}
                  onChange={() => { }}
                  inputProps={{ 'aria-label': 'controlled' }}
                  sx={{
                    '&.Mui-checked': {
                      color: colors.graniteGrey,
                    },
                  }}
                />)}

                <ListItemText primary={"General IT Solutions "} />
                <IconButton onClick={() => { setOpenGeneralItSolutions(!openGeneralItSolutions) }}>
                  {openGeneralItSolutions ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
              <Collapse in={openGeneralItSolutions} sx={{
                width: '100%', border: `1px solid ${colors.snowywhite}`,
                borderBottomLeftRadius: openGeneralItSolutions ? "5px" : "5px",
                borderBottomRightRadius: openGeneralItSolutions ? "5px" : "5px",
              }} timeout="auto" unmountOnExit>
                <CollapsibleTree data={generalITSolutionsData} selectedItems={generalITSolutions} setSelectedItems={setGeneralITSolutions} />
              </Collapse>
            </div>



          </div>
      </div>
    </div>
  );
};

export default TSIOrgPrefer;
