// ─── GLSL ──────────────────────────────────────────────────────────────────────
export const VERT = `
varying vec2 vUv;varying float vWave;uniform float uTime;uniform float uHover;uniform vec2 uMouse;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
void main(){
  vUv=uv;vec3 pos=position;
  float n=snoise(vec3(pos.x*3.5+uTime*.4,pos.y*3.5,uTime*.3))*0.22*uHover;
  float d=distance(uv,uMouse);
  pos.z+=sin(d*14.-uTime*3.)*0.12*uHover*smoothstep(.6,0.,d);
  pos.z+=n;vWave=pos.z;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}`;

export const FRAG = `
uniform sampler2D uTex;uniform float uAlpha;varying vec2 vUv;varying float vWave;
void main(){
  float w=vWave*.28;
  float r=texture2D(uTex,vUv+vec2(w*.9,0.)).r;
  float g=texture2D(uTex,vUv+vec2(0.,-w*.6)).g;
  float b=texture2D(uTex,vUv+vec2(-w*.4,w*.4)).b;
  gl_FragColor=vec4(r,g,b,uAlpha);
}`;

export const lerp = (a, b, t) => a + (b - a) * t;

// ─── THEME ─────────────────────────────────────────────────────────────────────
export const T = {
  dark: {
    bg: "#06060e", card: "rgba(255,255,255,.028)",
    border: "rgba(255,255,255,.07)", bStrong: "rgba(255,255,255,.14)",
    text: "#ede8ff", muted: "rgba(237,232,255,.44)", faint: "rgba(237,232,255,.16)",
    accent: "#b57bff", glow: "rgba(181,123,255,.28)",
    nav: "rgba(6,6,14,.9)", input: "rgba(255,255,255,.035)",
    hi: "#4ade80", mid: "#fbbf24", lo: "#f87171",
    line: "rgba(255,255,255,.07)",
    menuBg: "#0b0b18",
  },
  light: {
    bg: "#f6f3ef", card: "rgba(0,0,0,.025)",
    border: "rgba(0,0,0,.07)", bStrong: "rgba(0,0,0,.16)",
    text: "#0e0c18", muted: "rgba(14,12,24,.48)", faint: "rgba(14,12,24,.22)",
    accent: "#6d28d9", glow: "rgba(109,40,217,.18)",
    nav: "rgba(246,243,239,.92)", input: "rgba(0,0,0,.03)",
    hi: "#15803d", mid: "#b45309", lo: "#b91c1c",
    line: "rgba(0,0,0,.07)",
    menuBg: "#f0ecff",
  }
};

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(181,123,255,.25);border-radius:2px;}
  ::selection{background:rgba(181,123,255,.22);}
  body{overflow-x:hidden;}

  @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes mqR{from{transform:translateX(-50%)}to{transform:translateX(0)}}
  @keyframes vB0{from{height:10%}to{height:85%}}
  @keyframes vB1{from{height:20%}to{height:60%}}
  @keyframes vB2{from{height:15%}to{height:90%}}
  @keyframes vB3{from{height:30%}to{height:55%}}
  @keyframes micBlink{0%,100%{opacity:1;box-shadow:0 0 48px rgba(248,113,113,.45)}50%{opacity:.75;box-shadow:0 0 80px rgba(248,113,113,.7)}}
  @keyframes scanMove{0%{left:-35%}100%{left:130%}}
  @keyframes floatGlow{0%,100%{opacity:.6}50%{opacity:1}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes orbPulse{0%,100%{opacity:.7,transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}}
  @keyframes gridPulse{0%,100%{opacity:.7}50%{opacity:1}}
  @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(181,123,255,0)}50%{box-shadow:0 0 14px 3px rgba(181,123,255,.15)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes heroScan{0%{top:0%;opacity:0}4%{opacity:1}48%{top:100%;opacity:1}50%{top:100%;opacity:0}54%{top:100%;opacity:1}96%{top:0%;opacity:1}100%{top:0%;opacity:0}}
  @keyframes floatChip{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes framePulse{0%,100%{opacity:.5}50%{opacity:1}}
  @keyframes statusBlink{0%,100%{opacity:1;box-shadow:0 0 8px #4ade80}50%{opacity:.4;box-shadow:0 0 3px #4ade80}}
  @keyframes dataFlicker{0%,95%,100%{opacity:1}96%,99%{opacity:.3}}
  @keyframes slideInLeft{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes radarSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
`;
