"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[428],{7428:function(e,n,r){r.r(n),r.d(n,{default:function(){return a}});var t=r(5893),i=r(7294),o=r(9477);function a(){let e=(0,i.useRef)(new o.xsS),n=(0,i.useRef)(new o.cPb(75,window.innerWidth/window.innerHeight,1,1e3)),r=(0,i.useRef)(new o.CP7({antialias:!0,alpha:!0})),a=(0,i.useRef)(null),c=(0,i.useRef)(new o.Tme),u=(0,i.useRef)(new o.Tme),d=(0,i.useRef)(new o.Tme),l=(0,i.useCallback)(()=>{var t,i,l;r.current.setPixelRatio(window.devicePixelRatio?window.devicePixelRatio:1),r.current.setSize(window.innerWidth,window.innerHeight),r.current.autoClear=!1,r.current.setClearColor(0,0),console.log(null===(t=r.current)||void 0===t?void 0:t.domElement),null===(i=a.current)||void 0===i||i.appendChild(null===(l=r.current)||void 0===l?void 0:l.domElement),n.current.position.z=400,e.current.add(n.current),e.current.add(c.current),e.current.add(u.current),e.current.add(d.current);let s=new o.H$k(2,0),w=new o.cJO(7,1),h=new o.cJO(15,1),f=new o.xoR({color:16777215,flatShading:!0});for(let m=0;m<1e3;m++){let x=new o.Kj0(s,f);x.position.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),x.position.multiplyScalar(90+700*Math.random()),x.rotation.set(2*Math.random(),2*Math.random(),2*Math.random()),d.current.add(x)}let p=new o.xoR({color:16777215,flatShading:!0}),v=new o.xoR({color:16777215,wireframe:!0,side:o.ehD}),R=new o.Kj0(w,p),C=new o.Kj0(h,v),M=new o.Mig(10066329,.2),g=[];R.scale.x=R.scale.y=R.scale.z=16,C.scale.x=C.scale.y=C.scale.z=10,c.current.add(R),u.current.add(C),e.current.add(M),g[0]=new o.Ox3(16777215,1),new o.cBI(g[0]),g[0].position.set(1,0,0),g[1]=new o.Ox3(1173691,1),g[1].position.set(.75,1,.5),g[2]=new o.Ox3(8519881,1),g[2].position.set(-.75,-1,.5),g.forEach(n=>e.current.add(n))},[]),s=(0,i.useCallback)(()=>{requestAnimationFrame(s),d.current&&c.current&&u.current&&r.current&&e.current&&n.current&&(d.current.rotation.x+=0,d.current.rotation.y-=.004,c.current.rotation.x-=.002,c.current.rotation.y-=.003,u.current.rotation.x-=.001,u.current.rotation.y+=.002,r.current.clear(),r.current.render(e.current,n.current))},[]),w=(0,i.useCallback)(()=>{n.current&&r.current&&(r.current.setSize(window.innerWidth,window.innerHeight),n.current.aspect=window.innerWidth/window.innerHeight,n.current.updateProjectionMatrix())},[]);return(0,i.useEffect)(()=>(l(),s(),window.addEventListener("resize",w,!1),()=>window.removeEventListener("resize",w)),[s,l,w]),(0,t.jsx)("div",{ref:a})}}}]);