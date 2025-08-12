import React, { useEffect, useRef, useState } from 'react';
import useDeviceType from '../../../Utils/DeviceType';
import { useNavigate } from 'react-router-dom';
import { TSICONFIG } from '../../../configData';

const ConsentManager = ({ showBanner, setShowBanner, showPreferences, setShowPreferences }: any) => {
    const [policy, setPolicy] = useState<any>(null);
    const [langContent, setLangContent] = useState<any>(null);
    const [preferences, setPreferences] = useState<any>({});
    const preferenceRef = useRef<HTMLDivElement>(null);
    const alreadyConsented = document.cookie.includes('user_consent=true');
    const deviceType = useDeviceType()
    const navigate = useNavigate()
    useEffect(() => {
        if (!showPreferences) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (preferenceRef.current && !preferenceRef.current.contains(event.target as Node)) {
                if (alreadyConsented) {
                    setShowPreferences(false)

                } else {
                    setShowPreferences(false)
                    setShowBanner(true)
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPreferences]);

    const CONFIG: any = {
        fiduciaryKey: TSICONFIG.REACT_APP_FIDUCIARY_KEY,
        policyKey: TSICONFIG.REACT_APP_POLICY_KEY,
        localStorageKey: TSICONFIG.COOKIE_LOCAL_STORAGE_KEY,
        apiBaseUrl: TSICONFIG.REACT_APP_API_BASE_URL,
        expiryDays: TSICONFIG.REACT_APP_EXPIRY_DAYS || 365,

    };
    const env_consent: any = TSICONFIG.LOCALSTORAGE_ENV_CONSENT
    let consentCategoriesConfig: any = {};
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    const stored = getCookie(CONFIG?.localStorageKey)

    // env_consentenv_consent
    const fetchPolicy = async () => {
        const res = await fetch(`${CONFIG.apiBaseUrl}/policy-v1.json`);
        const data = await res.json();
        setPolicy(data);
        const lang = navigator.language.split('-')[0];
        const content = data?.languages?.[lang] || data?.languages?.['en'] || {};
        setLangContent(content);
        consentCategoriesConfig = {};
        content?.data_processing_purposes?.forEach((p: any) => {
            consentCategoriesConfig[p.id] = p;
        });
        return { data, content };
    };

    const initConsentState = (policyData: any) => {

        if (!stored) return null;
        const parsed = JSON.parse(stored);
        const expiry = new Date(parsed.timestamp);
        expiry.setDate(expiry.getDate() + CONFIG.expiryDays);
        if (new Date() < expiry && parsed.policyVersion === policyData.version) {
            setPreferences(parsed.preferences)
            return parsed.preferences;
        }
        return null;
    };

    const saveConsent = async (prefs: any, mechanism: string) => {
        const consentData = {
            preferences: prefs,
            timestamp: new Date().toISOString(),
            mechanism,
            policyVersion: policy.version,
            policyId: policy.policy_id
        };
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(consentData));
        localStorage.setItem(env_consent, JSON.stringify(consentData));
        document.cookie = `${CONFIG.localStorageKey}=${JSON.stringify(consentData)}; path=/; max-age=${60 * 60 * 24 * CONFIG.expiryDays}`;
        document.cookie = `user_consent=true; path=/; max-age=${60 * 60 * 24 * CONFIG.expiryDays}`;

        // const userId = localStorage.getItem('tsi_coop_user_id') || `anon_${Date.now()}`;
        // localStorage.setItem('tsi_coop_user_id', userId);
        const userId = localStorage.getItem(TSICONFIG.USER_ID) || `anon_${Date.now()}`;
        localStorage.setItem(TSICONFIG.USER_ID, userId);
        const grantedAll = Object.values(prefs).every(p => p === true);

        const firstTrueKey = Object.keys(prefs).find(key => prefs[key]);
        const deniedNonEssential = Object.values(prefs).every(
            p =>
                p === false ||
                (firstTrueKey && consentCategoriesConfig[firstTrueKey]?.is_mandatory_for_service)
        );


        const payload = {
            _func: 'record_consent',
            user_id: userId,
            fiduciary_id: policy?.data_fiduciary_info?.id || '',
            policy_id: policy?.policy_id || '',
            policy_version: policy?.version,
            timestamp: new Date()?.toISOString(),
            jurisdiction: policy.jurisdiction || 'IN',
            language_selected: langContent?.langCode || 'en',
            consent_mechanism: mechanism,
            ip_address: null,
            consent_status_general: grantedAll
                ? 'granted_all'
                : deniedNonEssential
                    ? 'denied_non_essential'
                    : 'custom',
            user_agent: navigator?.userAgent,
            data_point_consents: Object?.keys(prefs).map(k => ({
                data_point_id: k,
                consent_granted: prefs[k],
                purpose_agreed_to: langContent?.data_processing_purposes?.find((p: any) => p.id === k)?.name || k,
                timestamp_updated: new Date()?.toISOString()
            })),
            is_active_consent: true
        };

        const res = await fetch(`${CONFIG.apiBaseUrl}/api/consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        document.cookie = `consent_id=${result.consent_id}; path=/; max-age=${60 * 60 * 24 * CONFIG.expiryDays}`;
        localStorage.setItem("consent_id", result.consent_id);
        const mobile = ""
        const name = localStorage.getItem("name")
        const email = localStorage.getItem("email")
        const consent_id = result.consent_id
        const fiduciary_id = payload.fiduciary_id
        linkPrincipal({ fiduciary_id, consent_id, name, email, mobile })
    };

    const handleAcceptAll = () => {
        const prefs: any = {};
        langContent?.data_processing_purposes?.forEach((p: any) => prefs[p?.id] = true);
        saveConsent(prefs, 'accept_all_banner');
        setShowBanner(false);
    };

    const handleRejectAll = () => {
        const prefs: any = {};
        langContent.data_processing_purposes.forEach((p: any) => prefs[p.id] = p.is_mandatory_for_service);
        saveConsent(prefs, 'reject_all_banner');
        setShowBanner(false);
    };

    const handleSavePreferences = () => {
        saveConsent(preferences, 'save_preferences_center');
        setShowPreferences(false);
        setTimeout(() => {
            if (localStorage.getItem("token")) {
                navigate("/community")
                window.location.reload()
            } else {
                window.location.reload()
            }
        }, 1000)

    };

    useEffect(() => {
        fetchPolicy().then(({ data }) => {
            const consentId = getCookie('consent_id');
            const savedPrefs = initConsentState(data);
            if (consentId) {
                // setShowPreferences(true);
            } else if (!savedPrefs) {
                setShowBanner(true);
            } else {
                setPreferences(savedPrefs);
            }
        });


    }, [stored]);

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


    if (!langContent) return null;

    return (
        <>
            <style>{`
        @font-face {
          font-family: 'OpenSans';
          src: url('./fonts/OpenSans-Regular.ttf') format('woff2');
          font-weight: normal;
          font-style: normal;
        }

        body {
          font-family: 'OpenSans', sans-serif;
          margin: 0;
          padding: 0;
        }

        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
        //   background-color: #006A67;
          background-color:#333;
          color: white;
          padding:5px;
          padding-left:15px;
          padding-right:15px;
          padding-bottom:6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          z-index: 9999;
          gap:2px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
        }

        .cookie-banner p {
          margin: 0 15px 0 0;
          flex-grow: 1;
          font-size: 0.9em;
        }

        .cookie-banner button {
        //   background-color: #f5a904d2;
          background-color:#006A67;
          color: #FFF;
          border: none;
          margin-left: 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .cookie-banner button:hover {
          background-color: #006A67;
        }

        .cookie-banner .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: space-between;
        }

        .preference-center-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
        }

        .preference-center-content {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          color: #333;
        }

        .preference-center-content h2 {
          margin-top: 0;
          color: #006A67;
          font-size: 1.5em;
        }

        .preference-center-content .category {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 5px;
          background-color: #f9f9f9;
        }

        .category h3 {
          display: flex;
          justify-content: space-between;
          font-size: 1.1em;
          color: #555;
        }

        .category .details {
          margin-top: 10px;
          padding-left: 10px;
          border-left: 2px solid #ddd;
          font-size: 0.8em;
          color: #777;
          text-align:left;
        }

        .toggle-switch {
         position: relative;
         display: inline-block;
         width: 40px;
         height: 24px;
       }

       .toggle-switch input {
         opacity: 0;
         width: 0;
         height: 0;
       }

       .toggle-switch .slider {
         position: absolute;
         cursor: pointer;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background-color: #ccc;
         transition: 0.4s;
         border-radius: 24px;
       }

       .toggle-switch .slider:before {
         content: "";
         position: absolute;
         height: 16px;
         width: 16px;
         left: 4px;
         bottom: 4px;
         background-color: white;
         transition: 0.4s;
         border-radius: 50%;
       }

       .toggle-switch input:checked + .slider {
         background-color: #006A67;
       }

       .toggle-switch input:checked + .slider:before {
         transform: translateX(16px);
       }


      `}</style>
            {showBanner && (
                <div className="cookie-banner">
                    {/* <p>{langContent.description}</p> */}
                    <p style={{ fontSize: '13px', fontFamily: 'OpenSans', textAlign: "left" }}>We collect data for Account Registration & Management, Website Analytics & Performance, Community Engagement, Solutions and Services Showcase and Digital Maturity/Capability Assessments.</p>
                    <div className="button-group" style={{ width: '100%', display: "flex", justifyContent: 'flex-end', alignItems: "flex-end", gap: "10px" }}>
                        <button style={{ width: deviceType == "mobile" ? "100%" : "auto", fontSize: "10px", padding: '8px' }} id="accept-all-cookies" onClick={handleAcceptAll}>{langContent?.buttons?.accept_all || "Accept All & Continue"}</button>
                        <button style={{ width: deviceType == "mobile" ? "100%" : "auto", fontSize: "10px", padding: '8px' }} id="reject-all-cookies" onClick={handleRejectAll}>{langContent?.buttons?.reject_all_non_essential || "Reject Non-Essential"}</button>
                        <button style={{ width: deviceType == "mobile" ? "100%" : "auto", fontSize: "10px", padding: '8px' }} id="manage-preferences" onClick={() => {

                            setShowPreferences(true); setShowBanner(false);
                        }}>
                            {langContent?.buttons?.manage_preferences || "Manage My Preferences"}
                        </button>
                    </div>
                </div>
            )}

            {showPreferences && (
                <div className="preference-center-overlay" style={{ display: 'flex' }}>
                    <div ref={preferenceRef} className="preference-center-content" style={{ scrollbarWidth: "none" }}>
                        <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                            <button onClick={() => {
                                if (alreadyConsented) {
                                    setShowPreferences(false)

                                } else {
                                    setShowPreferences(false)
                                    setShowBanner(true)
                                }
                            }} style={{ top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.5em", cursor: "pointer", color: "#555" }} >&times;</button>
                        </div>
                        <h2 style={{ textAlign: "left" }}>{langContent?.title}</h2>
                        <p style={{ textAlign: "left", fontSize: "14px", fontWeight: 600 }}>{langContent?.general_purpose_description}</p>
                        <p style={{ textAlign: "left", fontSize: "14px", fontWeight: 600 }}>{langContent?.important_note}</p>
                        {langContent?.data_processing_purposes?.map((p: any) => (
                            <div className="category" key={p.id}>
                                <h3 style={{ fontWeight: 600, }}>{p?.name}
                                    {p?.is_mandatory_for_service ? (
                                        <span style={{ color: '#28a745', fontSize: '0.8em', fontWeight: 600, marginLeft: '10px' }}>
                                            (Mandatory for Service)
                                        </span>
                                    ) : (
                                        <label className="toggle-switch">
                                            <input
                                                className='slider'
                                                type="checkbox"
                                                checked={preferences[p.id] ?? false}
                                                onChange={e =>
                                                    setPreferences((prev: any) => ({
                                                        ...prev,
                                                        [p.id]: e.target.checked
                                                    }))
                                                }
                                            />
                                            <span className="slider"></span>
                                        </label>

                                    )}
                                </h3>
                                <p
                                    style={{
                                        marginTop: "10px",
                                        paddingLeft: "10px",
                                        borderLeft: "2px solid #ddd",
                                        fontSize: "0.8em",
                                        color: "#777",
                                        textAlign: "left",
                                        fontWeight: 600,
                                    }}>{p?.description}</p>

                                <div className="details">
                                    <strong>{langContent?.legal_basis_label || 'Legal Basis:'}</strong> {p?.legal_basis}<br />
                                    <strong>{langContent?.data_categories_label || 'Data Categories:'}</strong> {p?.data_categories_involved
                                        .map((catId: any) => {
                                            const cat = langContent?.data_categories_details?.find((d: any) => d?.id === catId);
                                            return cat ? cat?.name : catId;
                                        })
                                        .join(', ')}<br />
                                    <strong>{langContent?.third_parties_label || 'Third Parties:'}</strong> {p?.recipients_or_third_parties && p?.recipients_or_third_parties?.length > 0
                                        ? p?.recipients_or_third_parties?.join(', ')
                                        : langContent.not_applicable || 'N/A'}<br />
                                    <strong>{langContent.retention_label || 'Retention:'}</strong> {p.retention_period}<br />
                                </div>

                            </div>
                        ))}
                        <button id="save-preferences" style={{
                            backgroundColor: "#006A67",
                            color: "white",
                            border: "none",
                            padding: "8px 15px",
                            marginLeft: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "0.9em",
                            transition: "background-color 0.3s ease",
                        }} onClick={handleSavePreferences}>{langContent?.buttons?.save_preferences || "Save Choices"}</button>

                    </div>
                </div>
            )}
        </>
    );
};

export default ConsentManager;
