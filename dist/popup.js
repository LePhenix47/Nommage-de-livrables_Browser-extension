(()=>{"use strict";const e=["ndl_firstName","ndl_lastName","ndl_date"],t=function(e,t=document){if(t===document)return document.querySelector(e);switch(!0){case t.tagName?.includes("-"):return t.shadowRoot?.querySelector(e);case t instanceof HTMLTemplateElement:return document.importNode(t.content,!0).querySelector(e);case t instanceof HTMLIFrameElement:return t.contentDocument?.querySelector(e);default:return t.querySelector(e)}}("form"),r=function(e,t=document){if(t===document)return Array.from(document.querySelectorAll(e));switch(!0){case t.tagName?.includes("-"):return Array.from(t.shadowRoot?.querySelectorAll(e)||[]);case t instanceof HTMLTemplateElement:return Array.from(document.importNode(t.content,!0).querySelectorAll(e));case t instanceof HTMLIFrameElement:return Array.from(t.contentDocument?.querySelectorAll(e)||[]);default:return Array.from(t.querySelectorAll(e))}}("input");t.addEventListener("submit",(e=>{e.preventDefault();const t={ndl_firstName:r[0].value,ndl_lastName:r[1].value,ndl_date:r[2].value};chrome.storage.sync.set(t,(()=>{console.log("Values saved to chrome.storage.sync:",t)})),chrome.runtime.sendMessage({type:"setValues",data:t})})),async function(){for(let t=0;t<e.length;t++){const n=e[t];await chrome.storage.sync.get(n,(e=>{const o=e[n];r[t].value=o}))}}(),console.log("Hello popup.ts",t)})();