/* Quiz Fans Studio website analytics - GA4, basic Consent Mode v2. */
(() => {
  'use strict';
  const ID = 'G-V4TGTCJ49W';
  const KEY = 'qfs_analytics_consent_v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const DENIED = {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
  const GRANTED = {...DENIED,analytics_storage:'granted'};
  const apps = {
    'com.quizfansstudio.seeu':'SeeU',
    'com.blockbustervortex':'Block Puzzle Vortex',
    'com.quizfans.directbeam':'DirectBeam',
    'com.mahjong.puzzlematch.math':'Mahjong',
    'com.loveflirtyquiz.app':'Flirty Vibes',
    'com.lauri.couplesdare':'Couples Dare',
    'com.ultimatum.flashshare':'Ultimatum'
  };
  let choice = null, started = false;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if(saved && ['accepted','rejected'].includes(saved.value) && Number.isFinite(saved.time) && Date.now()-saved.time >= 0 && Date.now()-saved.time < MAX_AGE) choice = saved.value;
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',DENIED);
  window['ga-disable-'+ID] = true;
  function enable(){
    if(started) return;
    started = true;
    window['ga-disable-'+ID] = false;
    window.gtag('consent','update',GRANTED);
    window.gtag('js',new Date());
    window.gtag('config',ID,{allow_google_signals:false,allow_ad_personalization_signals:false});
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id='+ID;
    document.head.appendChild(tag);
  }
  function clearAnalyticsCookies(){
    for(const entry of document.cookie.split(';')){
      const name = entry.split('=')[0].trim();
      if(!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
      for(const domain of ['', '; domain='+location.hostname, '; domain=.'+location.hostname]){
        document.cookie = name+'=; Max-Age=0; path=/; SameSite=Lax; Secure'+domain;
      }
    }
  }
  function choose(value){
    const wasStarted = started;
    choice = value;
    try{localStorage.setItem(KEY,JSON.stringify({value,time:Date.now()}));}catch(_){}
    panel.hidden = true;
    settings.focus({preventScroll: true});
    if(value==='accepted'){enable();return;}
    window['ga-disable-'+ID] = true;
    clearAnalyticsCookies();
    if(wasStarted){window.gtag('consent','update',DENIED);location.reload();}
  }
  const styles = document.createElement('style');
  styles.textContent = '#qfs-consent[hidden]{display:none!important}#qfs-consent{position:fixed;z-index:2147483640;bottom:16px;left:16px;right:16px;max-width:590px;margin:auto;padding:18px;border:1px solid #71869f;border-radius:14px;background:#101b30;color:#f5f8ff;box-shadow:0 12px 40px #0009;font:14px/1.5 system-ui,sans-serif;max-height:80vh;overflow:auto;text-align:left}#qfs-consent h2{font-size:18px;margin:0 0 8px;color:#fff}#qfs-consent p{margin:0 0 10px;color:#e0e9f4}#qfs-consent a{color:#9fe9ff;text-decoration:underline}#qfs-consent .qfs-consent-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}#qfs-consent button,#qfs-analytics-settings{font:inherit;cursor:pointer;border:1px solid #8da7c3;border-radius:8px;background:#20354e;color:#fff;padding:9px 13px}#qfs-consent button{flex:1;min-width:120px}#qfs-consent button:focus-visible,#qfs-analytics-settings:focus-visible{outline:3px solid #ffd492;outline-offset:3px}#qfs-analytics-settings{font-size:13px;margin:10px auto;display:block}#qfs-consent summary{cursor:pointer;color:#a8e8f4}';
  document.head.appendChild(styles);
  const panel = document.createElement('section');
  panel.id = 'qfs-consent'; panel.hidden = true;
  panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','qfs-consent-title');
  panel.innerHTML = '<h2 id="qfs-consent-title">Optional website analytics</h2><p>Quiz Fans Studio uses Google Analytics to understand website visits, referral campaigns and clicks to our app stores and downloads. Analytics is optional and disabled until you accept. Refusing does not affect access to the site or downloads.</p><details><summary>Privacy and data information</summary><p>With your permission, Google Analytics uses cookies and collects website usage information, device/browser information, approximate location and campaign information. This helps us understand which apps visitors explore. We do not enable advertising personalization through this tag. Your preference is saved on this browser for up to 180 days; you can change it at any time using Analytics settings. Google processes analytics data and may process it internationally. Read <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a> and <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses data from partner sites</a>. For privacy questions or requests contact <a href="mailto:quizfans.studio@gmail.com">Quiz Fans Studio</a>.</p></details><div class="qfs-consent-actions"><button type="button" data-choice="rejected">Reject analytics</button><button type="button" data-choice="accepted">Accept analytics</button></div>';
  const settings = document.createElement('button');
  settings.id='qfs-analytics-settings';settings.type='button';settings.textContent='Analytics settings';
  settings.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus();});
  panel.addEventListener('click',e=>{const b=e.target.closest('button[data-choice]');if(b)choose(b.dataset.choice);});
  (document.querySelector('footer')||document.body).appendChild(settings);
  document.body.appendChild(panel);
  if(choice==='accepted')enable();else if(choice===null)panel.hidden=false;
  function send(name,params){if(choice==='accepted'&&started)window.gtag('event',name,{...params,send_to:ID});}
  function trackLink(e){
    if(e.type==='auxclick'&&e.button!==1)return;
    const a=e.target.closest?.('a[href]');if(!a)return;
    let url;try{url=new URL(a.href,location.href);}catch(_){return;}
    if(url.protocol!=='https:'&&url.protocol!=='http:')return;
    if(url.hostname==='play.google.com'&&url.pathname==='/store/apps/details'){
      const pkg=url.searchParams.get('id');if(apps[pkg])send('play_store_click',{app_package:pkg,app_name:apps[pkg],link_url:'https://play.google.com/store/apps/details?id='+pkg});
      return;
    }
    const card=a.closest('article.app-card');
    const pkg=card?.querySelector('.package code')?.textContent.trim();
    if(pkg&&apps[pkg]&&url.origin===location.origin){
      if(a.classList.contains('action-main'))send('app_details_click',{app_package:pkg,app_name:apps[pkg],link_url:url.origin+url.pathname});
      else if(/\/windows\.html$/i.test(url.pathname))send('windows_companion_click',{app_package:pkg,app_name:apps[pkg],link_url:url.origin+url.pathname});
    }
    if(url.hostname==='github.com'&&/\/releases\/download\//i.test(url.pathname)&&/\.(exe|msi|zip)$/i.test(url.pathname)){
      const p=/^\/QuizFansStudio\/DirectBeam\//i.test(url.pathname)?'com.quizfans.directbeam':(/^\/QuizFansStudio\/ultimatum-flash\//i.test(url.pathname)?'com.ultimatum.flashshare':null);
      if(p)send('windows_download_click',{app_package:p,app_name:apps[p],link_url:url.origin+url.pathname});
    }
  }
  document.addEventListener('click',trackLink,true);
  document.addEventListener('auxclick',trackLink,true);
})();
