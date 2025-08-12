import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useDeviceType from '../Utils/DeviceType';
import Login from '../Components/screens/Login/Login';
import VerifyOTP from '../Components/screens/Login/VerifyOTP';
import Register from '../Components/screens/Register/Register';
import Sidebar from '../Components/layout/Sidebar';
import { Header } from '../Components/layout/Header';
import BusinessAdminForm from '../Components/screens/Register/BusinessAdminForm';
import TechProfessionalForm from '../Components/screens/Register/TechProfessionalForm';
import Community from '../Components/screens/Community/Community';
import { ComB, ComW, serB, serW, solB, solW, talW, trB, trW, talB, enqB, enqW, rfpB, rfpW, jobB, jobW, testB, testW, pzB, pzW, orgB, orgW, meeting, meetingw, postB, postW, adminB, adminW, RatingB, RatingW, SupportB, SupportW, accelaratorsB, accelaratorsW, discoB, discoW, interactB, interactW } from '../assets';
import VerifyRegisterOTP from '../Components/screens/Register/VerifyRegisterOTP';
import Solutions from '../Components/screens/Solutions/Solutions';
import colors from '../assets/styles/colors';
import Services from '../Components/screens/Services/Services';
import Training from '../Components/screens/Training/Training';
import Talent from '../Components/screens/Talents/Talent';
import Enquiries from '../Components/screens/Enquires/Enquiries';
import RFPS from '../Components/screens/Rfps/RFPs';
import Jobs from '../Components/screens/Jobs/Jobs';
import ProviderZone from '../Components/screens/ProviderZone/ProviderZone';
import Organizations from '../Components/screens/Organizations/Organizations';
import JobsProfessional from '../Components/screens/Jobs/JobsProfessional';
import Testimonial from '../Components/screens/Testimonial/Testimonial';
import Settings from '../Components/screens/Settings/Settings';
import Website from '../Components/screens/Website/Website';
import MyPosts from '../Components/screens/Posts/MyPosts';
import TSIOrgProfile from '../Components/screens/Community/TSIOrgProfile';
import TSITalentProfile from '../Components/screens/Talents/TSITalentProfile';
import Meetups from '../Components/screens/Meetup/Meetups';
import AmbassadorForm from '../Components/screens/Register/AmbassadorForm';
import Admin from '../Components/screens/Admin/Admin';
import TSIMyPostDetails from '../Components/screens/Posts/TSIMyPostDetails';
import TSIMyMeetupDetails from '../Components/common/Molecules/TSIMyMeetupDetails';
import SolutionsDetails from '../Components/screens/Solutions/SolutionsDetails';
import ServicesDetails from '../Components/screens/Services/ServicesDetails';
import TrainingDetails from '../Components/screens/Training/TrainingDetails';
import MeetupDetails from '../Components/screens/Meetup/MeetupDetails';
import EnquiriesDetails from '../Components/screens/Enquires/EnquiriesDetails';
import RFPDetails from '../Components/screens/Rfps/RFPDetails';
import JobDetails from '../Components/screens/Jobs/JobDetails';
import JobApplicationDetail from '../Components/screens/Jobs/JobApplicationDetail';
import TestimonialDetails from '../Components/screens/Testimonial/TestimonialDetails';
import AmbassadorRegister from '../Components/screens/Register/AmbassadorRegister';
import ConsentManager from '../Components/common/Molecules/ConsentManager';
import { TSICONFIG } from '../configData';
import AccountDetails from '../Components/screens/Admin/AccountDetails';
import TSIRatingsQuestionareCM from '../Components/screens/TSIRating/TSIRatingsQuestionareCM';
import TSIRatingsQuestionareDM from '../Components/screens/TSIRating/TSIRatingsQuestionareDM';
import TSIRatingsDM from '../Components/screens/TSIRating/TSIRatingsDM';
import TSIRatingsCM from '../Components/screens/TSIRating/TSIRatingsCM';
import Support from '../Components/screens/Support/Support';
import SupportDetails from '../Components/screens/Support/SupportDetails';
import AcceleratorsDPDPCMS from '../Components/screens/Accelerators/AcceleratorsDPDPCMS';
import AcceleratorsDigitalFoundations from '../Components/screens/Accelerators/AcceleratorsDigitalFoundations';

const AppRoutes: React.FC = () => {
  const deviceType = useDeviceType();
  const [loader, setLoader] = useState(true);
  const [selectedParent, setSelectedParent] = useState('dashboard');
  const [selectedChild, setSelectedChild] = useState<string | undefined>(undefined);
  const location = useLocation();
  const deviceWidth = (deviceType == "large-desktop" || deviceType == "extra-large-desktop" || deviceType == "desktop" || deviceType == "tablet" || deviceType == "small-tablet") ? "300px" : (deviceType === "mobile" || deviceType === "small-tablet") ? "0px" : "250px";
  const [sidebarHeaderLock, setSidebarHeaderLock] = useState(true);
  const role = localStorage.getItem("role");
  const business = role === "BUSINESS";
  const professional = role === "PROFESSIONAL";
  const ambassador = role === "AMBASSADOR";
  const admin = role === "ADMIN";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const iframeRef: any = useRef(null);
  const [showBanner, setShowBanner] = useState<any>(false);
  const [showPreferences, setShowPreferences] = useState<any>(false);
  const alreadyConsented = document.cookie.includes('user_consent=true');
  function getCookie(name: string): string | undefined {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ').reduce<Record<string, string>>((acc, current) => {
      const [key, value] = current.split('=');
      acc[key] = value;
      return acc;
    }, {});
    return cookies[name];
  }
  let parsed: any;
  const localStorageKey: any = TSICONFIG.COOKIE_LOCAL_STORAGE_KEY
  useEffect(() => {
    const stored: any = getCookie(localStorageKey)
    // const tsi_coop_sandbox_envt_consent = localStorage.getItem("tsi_coop_sandbox_envt_consent")
    const tsi_coop_sandbox_envt_consent = localStorage.getItem(TSICONFIG.LOCALSTORAGE_ENV_CONSENT)
    // const userId = localStorage.getItem('tsi_coop_user_id') || `anon_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const userId = localStorage.getItem(TSICONFIG.USER_ID)
    // || `anon_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    if (tsi_coop_sandbox_envt_consent) {
      document.cookie = `${localStorageKey}=${tsi_coop_sandbox_envt_consent}; path=/; max-age=${60 * 60 * 24 * 360}`;
      document.cookie = `user_consent=true; path=/; max-age=${60 * 60 * 24 * 360}`;
    }
    if (userId) {
      // localStorage.setItem('tsi_coop_user_id', userId); // Persist anon ID if generated
      // document.cookie = `tsi_coop_user_id=${userId}; path=/; max-age=" + 60 * 60 * 24 * 365`;
      localStorage.setItem(TSICONFIG.USER_ID, userId); // Persist anon ID if generated
      document.cookie = `${TSICONFIG.USER_ID}=${userId}; path=/; max-age=" + 60 * 60 * 24 * 365`;
      document.cookie = `user_consent=true; path=/; max-age=${60 * 60 * 24 * 360}`;
    }

    /*if (stored && stored !== "undefined") {
      parsed = JSON.parse(stored);
      // use `parsed`
    } else {
      console.warn("Consent data is missing or invalid:", stored);
      // handle as needed (e.g., show default UI or fetch from server)
    }*/
    // if (
    //   !(alreadyConsented && getCookie('consent_id')) &&  !(localStorage.getItem("tsi_coop_user_id") && localStorage.getItem("tsi_coop_sandbox_envt_consent"))
    // ) {
    //   setShowConsent(true);
    // }
    if (deviceType == "large-desktop" || deviceType == "extra-large-desktop" || deviceType === "small-tablet") {
      setIsOpen(true)
    } else {
      if (deviceType == "mobile") {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
  }, [deviceType])


  useEffect(() => {
    setLoader(true);
    const lockSidebarHeader = [
      '/login',
      '/register',
      '/otp',
      '/businesssetup',
      '/ambassadorsetup',
      '/techsetup',
      '/website'
    ].some(path => location.pathname.includes(path)) || location.pathname === '/';
    setSidebarHeaderLock(lockSidebarHeader);
    setLoader(false);
  }, [location.pathname]);

  const isOrg = location.pathname.split('?')[0] == "/community/postdetails";
  const sidebarItems: any = [
    (admin) ? { id: 'admin', label: 'Administration', link: '/admin', icon: adminB, icon2: adminW, } : null,
    (professional || business || ambassador || admin) ? { id: 'community', label: 'Community', link: '/community', icon: ComB, icon2: ComW, } : null,

    (business || ambassador || admin || professional) ? {
      id: 'discover', label: 'Discover', link: '/discover', icon: discoB, icon2: discoW,
      children: [
        ...(professional || ambassador || admin || (isOrg)
          ? [{ id: 'organisations', label: 'Organisations', link: '/organisations', icon: orgB, icon2: orgW, }]
          : []),
        ...(business || ambassador || admin
          ? [{ id: 'solutions', label: 'Solutions', link: '/solutions', icon: solB, icon2: solW }]
          : []),
        ...(business || ambassador || admin
          ? [{ id: 'services', label: 'Services', link: '/services', icon: serB, icon2: serW }]
          : []),
        ...(business || ambassador || admin || professional
          ? [{ id: 'training', label: 'Trainings', link: '/training', icon: trB, icon2: trW }]
          : []),
        ...(business || ambassador || admin
          ? [{ id: 'talent', label: 'Talent', link: '/talent', icon: talB, icon2: talW }]
          : []),

      ]
    } : null,
    (business || ambassador || admin || professional) ? {
      id: 'engage', label: 'Engage', link: '/engage', icon: interactB, icon2: interactW,
      children: [
        ...(professional || business || ambassador || admin
          ? [{ id: 'posts', label: 'Posts', link: '/posts', icon: postB, icon2: postW }]
          : []),
        ...(professional || business || ambassador || admin
          ? [{ id: 'meetup', label: 'Meetups', link: '/meetup', icon: meeting, icon2: meetingw }]
          : []),
        ...(professional || business || ambassador || admin
          ? [{ id: 'enquiries', label: 'Enquiries', link: '/enquiries', icon: enqB, icon2: enqW }]
          : []),
        ...(business || ambassador || admin
          ? [{ id: 'rfps', label: 'RFPs', link: '/rfps', icon: rfpB, icon2: rfpW }]
          : []),
        ...(professional || business || ambassador || admin
          ? [{ id: 'testimonial', label: 'Testimonials', link: '/testimonial', icon: testB, icon2: testW }]
          : []),
        (business || professional) ? { id: 'support', label: 'Support', link: '/support', icon: SupportB, icon2: SupportW, } : null,
      ]
    } : null,
    (business) ? {
      id: 'tsiratings', label: 'Ratings', link: '/tsiratings', icon: RatingB, icon2: RatingW, disabled: false,
      children: [
        { id: 'tsiratingsdigitialmaturity', label: 'Digitial Maturity', link: '/tsiratingsdigitialmaturity', icon: RatingB, icon2: RatingW, },
        { id: 'tsiratingscapabilitymaturity', label: 'Capability Maturity', link: '/tsiratingscapabilitymaturity', icon: RatingB, icon2: RatingW, }
      ]
    } : null,
    (business) ? {
      id: 'tsiaccelerators', label: 'Accelerators', link: '/tsiaccelerators', icon: accelaratorsB, icon2: accelaratorsW, children: [
        { id: 'tsiacceleratorsDF', label: 'Digital Foundations', link: '/tsiacceleratorsDF', icon: accelaratorsB, icon2: accelaratorsW, },
        { id: 'tsiacceleratorsCMS', label: 'DPDP CMS', link: '/tsiacceleratorsCMS', icon: accelaratorsB, icon2: accelaratorsW, }
      ], disabled: false
    } : null,
     (professional || business) ? { id: 'jobs', label: 'Jobs', link: '/jobs', icon: jobB, icon2: jobW, } : null,
    (business || admin) ? { id: 'pZone', label: 'Provider Zone', link: '/pZone', icon: pzB, icon2: pzW, isAccessNeeded: parsed?.preferences?.purpose_solution_service_training_showcase ? false : true } : null,
  ].filter(Boolean);


  if (!loader) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', margin: 0, backgroundColor: colors.lightPrimary }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", height: '100vh', padding: '10px', width: '100%' }}>
          <div style={{ width: !sidebarHeaderLock ? deviceWidth : "0%", overflowY: 'auto', scrollbarWidth: "none", backgroundColor: colors.lightPrimary, }}>
            {!sidebarHeaderLock && (
              <Sidebar
                isOpen={isOpen}
                onClose={() => { setIsOpen(false) }}
                selectedParent={selectedParent}
                setSelectedParent={setSelectedParent}
                sidebarData={sidebarItems}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
                showPreferences={showPreferences}
                setShowPreferences={setShowPreferences}
              />
            )}
          </div>
          <div
            style={{
              width: sidebarHeaderLock ? "100%" : `calc(100% - ${deviceWidth})`,
              display: "flex",
              flexDirection: "column",
              justifyContent: 'flex-start',
              overflowY: 'auto',
              scrollbarWidth: "none",
              backgroundColor: colors.white,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                backgroundColor: colors.lightPrimary,
                width: '100%'
              }}
            >
              {!sidebarHeaderLock && <Header isOpen={isOpen} setIsOpen={setIsOpen} setQuery={setQuery} query={query} selected={selected} setSelected={setSelected} showConsent={showPreferences} setShowConsent={setShowPreferences} iframeRef={iframeRef} />}
            </div>
            <Routes>
              <Route path="/" >
                <Route path="" element={<Navigate to="login" />} />
                <Route path="/login" element={<Login />} />
              </Route>
              <Route path="/register" element={<Register />} />
              <Route path="/ambassador/register" element={<AmbassadorRegister />} />
              <Route path="/otp" element={<VerifyOTP />} />
              <Route path="/registerOTP" element={<VerifyRegisterOTP />} />
              <Route path='/businesssetup' element={<BusinessAdminForm />} />
              <Route path='/techsetup' element={<TechProfessionalForm />} />
              <Route path='/ambassadorsetup' element={<AmbassadorForm />} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/admin/accountDetails' element={<AccountDetails />} />
              <Route path="/admin/supportdetails" element={<SupportDetails isAdmin={true} />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/postdetails" element={<TSIOrgProfile />} />
              <Route path="/posts" element={<MyPosts setQuery={() => { setQuery(""); setSelected("") }} query={query} />} />
              <Route path="/posts/postdetails" element={<TSIMyPostDetails />} />
              <Route path="/meetup" element={<Meetups />} />
              <Route path="/meetup/detail" element={<MeetupDetails />} />
              <Route path="/meetup/postdetails" element={<TSIMyMeetupDetails />} />
              <Route path="/solutions" element={<Solutions setQuery={() => { setQuery(""); setSelected("") }} query={query} />} />
              <Route path="/solutions/details" element={<SolutionsDetails />} />
              <Route path="/services" element={<Services setQuery={() => { setQuery(""); setSelected("") }} query={query} />} />
              <Route path="/services/details" element={<ServicesDetails />} />
              <Route path="/training" element={<Training setQuery={() => { setQuery(""); setSelected("") }} query={query} />} />
              <Route path="/training/details" element={<TrainingDetails />} />
              <Route path="/talent" element={<Talent setQuery={() => { setQuery(""); setSelected("") }} query={query} />} />
              <Route path="/talent/postdetails" element={<TSITalentProfile />} />
              <Route path="/ambassador/postdetails" element={<TSITalentProfile isAmbassador={true} />} />
              <Route path="/enquiries" element={<Enquiries />} />
              <Route path="/enquiries/postdetails" element={<EnquiriesDetails />} />
              <Route path="/rfps" element={<RFPS />} />
              <Route path="/rfps/postdetails" element={<RFPDetails />} />
              <Route path="/jobs" element={professional ? <JobsProfessional /> : <Jobs />} />
              <Route path="/jobs/details" element={professional ? <JobDetails /> : <JobApplicationDetail />} />
              <Route path="/jobs/jobdetails" element={<JobDetails />} />
              <Route path="/jobs/applicationdetails" element={<JobApplicationDetail />} />
              <Route path="/testimonial" element={<Testimonial />} />
              <Route path="/testimonial/postdetails" element={<TestimonialDetails />} />
              <Route path="/support" element={<Support />} />
              <Route path="/support/details" element={<SupportDetails />} />
              <Route path="/pZone" element={<ProviderZone />} />
              <Route path="/organisations" element={<Organizations setQuery={() => { setQuery(""); setSelected("") }} query={query} />} />
              <Route path="/organisations/postdetails" element={<TSIOrgProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/website" element={<Website />} />
              <Route path='/tsiratingsdigitialmaturity' element={<TSIRatingsDM />} />
              <Route path='/tsiratingscapabilitymaturity' element={<TSIRatingsCM />} />
              <Route path='/tsiratingsquestionnaireCM' element={<TSIRatingsQuestionareCM />} />
              <Route path='/tsiratingsquestionnaireDM' element={<TSIRatingsQuestionareDM />} />
              <Route path='/tsiacceleratorsDF' element={<AcceleratorsDigitalFoundations />} />
              <Route path='/tsiacceleratorsCMS' element={<AcceleratorsDPDPCMS />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="centered-container">
        <div className="loader"></div>
      </div>
    );
  }
};

export default AppRoutes;