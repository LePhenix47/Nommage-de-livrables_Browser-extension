(()=>{"use strict";const e=function(e,t=document){if(t===document)return document.querySelector(e);switch(!0){case t.tagName?.includes("-"):return t.shadowRoot?.querySelector(e);case t instanceof HTMLTemplateElement:return document.importNode(t.content,!0).querySelector(e);case t instanceof HTMLIFrameElement:return t.contentDocument?.querySelector(e);default:return t.querySelector(e)}}("form");e.addEventListener("submit",(e=>{e.preventDefault();const t=function(e,t=document){if(t===document)return Array.from(document.querySelectorAll(e));switch(!0){case t.tagName?.includes("-"):return Array.from(t.shadowRoot?.querySelectorAll(e)||[]);case t instanceof HTMLTemplateElement:return Array.from(document.importNode(t.content,!0).querySelectorAll(e));case t instanceof HTMLIFrameElement:return Array.from(t.contentDocument?.querySelectorAll(e)||[]);default:return Array.from(t.querySelectorAll(e))}}("input"),r=new Map;for(const e of t)r.set(e.id,e.value);console.log(r)})),console.log("Hello popup.ts",e)})();