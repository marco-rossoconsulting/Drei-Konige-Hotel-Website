// Consent-gated web analytics for Hotel Drei Könige.
//
// Single place to change the tracking setup. Today this loads the GA4
// Google tag (gtag.js) for MEASUREMENT_ID. To switch to Google Tag Manager
// later, set GTM_CONTAINER_ID (e.g. 'GTM-XXXXXXX'): the loader then injects
// gtm.js instead of gtag.js and GA4 is configured inside the GTM container.
// Either way, nothing is requested from Google until the visitor accepts.

export const MEASUREMENT_ID = 'G-TZVSDCQT33';
export const GTM_CONTAINER_ID = ''; // e.g. 'GTM-XXXXXXX' — leave empty to use gtag.js

/** localStorage key holding the visitor's choice: {"value":"granted"|"denied","date":ISO} */
export const CONSENT_KEY = 'dk-consent';
/** Re-ask after 12 months. */
export const CONSENT_MAX_AGE_DAYS = 365;

/**
 * Inline <head> script. `enabled` is true only for Netlify production builds
 * (CONTEXT === 'production'); on deploy previews, branch deploys and local
 * builds the measurement ID is left out of the HTML and load() does nothing,
 * so testing the banner never sends hits to the live GA4 property.
 * Runs before anything else:
 *  1. Google Consent Mode v2 defaults: everything denied.
 *  2. Exposes window.dkConsent (read/accept/reject) for the banner.
 *  3. If a stored, unexpired acceptance exists, loads the tag immediately.
 * The Google tag is never part of the static HTML.
 */
export function consentHeadScript(enabled: boolean): string {
  const cfg = JSON.stringify({
    on: enabled,
    id: enabled ? MEASUREMENT_ID : '',
    gtm: enabled ? GTM_CONTAINER_ID : '',
    key: CONSENT_KEY,
    maxAge: CONSENT_MAX_AGE_DAYS * 864e5
  });
  // When disabled, the loader (and with it every Google URL and the ID) is
  // left out entirely: load() is a no-op.
  const loader = enabled ? LOADER : 'function load(){}';
  return `(function(){
var C=${cfg};
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){dataLayer.push(arguments);};
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('set','ads_data_redaction',true);
var loaded=false;
function read(){try{var s=JSON.parse(localStorage.getItem(C.key)||'null');if(!s||(s.value!=='granted'&&s.value!=='denied'))return null;if(!(Date.now()-new Date(s.date).getTime()<C.maxAge)){localStorage.removeItem(C.key);return null;}return s.value;}catch(e){return null;}}
function store(v){try{localStorage.setItem(C.key,JSON.stringify({value:v,date:new Date().toISOString()}));}catch(e){}}
${loader}
function clearGa(){
  var names=document.cookie.split(';').map(function(c){return c.split('=')[0].trim();}).filter(function(n){return n==='_ga'||n.indexOf('_ga_')===0||n==='_gid'||n==='_gat';});
  var parts=location.hostname.split('.'),doms=[''];
  for(var i=0;i<parts.length-1;i++){var d=parts.slice(i).join('.');doms.push(d,'.'+d);}
  names.forEach(function(n){doms.forEach(function(d){document.cookie=n+'=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'+(d?'; domain='+d:'');});});
}
window.dkConsent={
  get:read,
  accept:function(){store('granted');load();},
  reject:function(){store('denied');gtag('consent','update',{analytics_storage:'denied'});if(C.id)window['ga-disable-'+C.id]=true;clearGa();}
};
if(/^\\/admin(\\/|$)/.test(location.pathname))return;
if(read()==='granted')load();
})();`;
}

const LOADER = `function load(){
  window['ga-disable-'+C.id]=false;
  gtag('consent','update',{analytics_storage:'granted'});
  if(loaded)return;loaded=true;
  var s=document.createElement('script');s.async=true;
  if(C.gtm){
    dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    s.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(C.gtm);
  }else{
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(C.id);
    gtag('js',new Date());
    gtag('config',C.id,{allow_google_signals:false,allow_ad_personalization_signals:false});
  }
  document.head.appendChild(s);
}`;
