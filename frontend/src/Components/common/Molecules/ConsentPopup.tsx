import React, { useEffect, useRef, useState } from 'react';
import colors from '../../../assets/styles/colors';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
const ConsentPopup = ({ showConsent, setShowConsent, iframeRef }: any) => {
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


  useEffect(() => {

    if (
      !(alreadyConsented && getCookie('consent_id'))
    
    ) {
      setShowConsent(true);
    }

    const handleMessage = (event: any) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.consentGiven) {
        document.cookie = "user_consent=true; path=/; max-age=" + 60 * 60 * 24 * 365;
        setShowConsent(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [alreadyConsented]);


  const linkPrincipal = async ({ fiduciary_id, consent_id, name, email, mobile }: any) => {
    const url = 'https://dpdp-cms.tsicoop.org/api/consent';

    const requestBody = {
      _func: 'link_principal',
      fiduciary_id,
      consent_id,
      "name": name,
      "email": email,
      mobile,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (data?.principal_id) {
        document.cookie = `principal_id=${data?.principal_id}; path=/; max-age=${60 * 60 * 24 * 365}`;
        localStorage.setItem("principal_id", data?.principal_id)
      }
      return data; // { principal_id: '...' }
    } catch (error: any) {
      console.log('error:', error);
    }
  }

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data?.type === 'FROM_IFRAME') {
        setShowConsent(event.data.payload.consentOpen)
        const consent_id = getCookie('consent_id');
        if (event.data.payload.consentOpen == false && consent_id) {
          const mobile = ""
          const name = localStorage.getItem("name")
          const email = localStorage.getItem("email")

          const fiduciary_id = "bfa42245-214a-45e3-bdb4-53c34404bc62"
          linkPrincipal({ fiduciary_id, consent_id, name, email, mobile })
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.location.reload();
    };
  }, []);

  if (!showConsent) return null;

  return (
    // <div style={styles.overlay}>
    //   <div style={styles.modal}>
    //     <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", height: "15%" }}>
    //       <div style={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%" }}>
    //         <p style={{ color: colors.primary, fontFamily: "OpenSans", fontSize: "24px", fontWeight: 600, margin: 0, }}>Your Privacy Choices</p>
    //       </div>
    //       <button onClick={() => { setShowConsent(false) }} style={{ border: "0px solid transparent", backgroundColor: "transparent", cursor: "pointer" }}>
    //         <CancelOutlinedIcon sx={{ width: '25px', height: '25px', }} />
    //       </button>
    //     </div>
    <>
      {(showConsent) && (<iframe
        ref={iframeRef}
        title="Consent HTML"
        src="/consent.html"
        style={styles.iframe}
      />)}
    </>
    // </div>
    // </div>
  );
};

const styles: any = {
  iframe: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '10%',
    border: 'none',
    zIndex: 9999,
    // backgroundColor: '#fff', 
  }

};

export default ConsentPopup;
