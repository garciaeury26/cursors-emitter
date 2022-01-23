"use strict"

import Swup from 'swup';
import SwupOverlayTheme from '@swup/overlay-theme';
import { paramParticles, TinyCursor, Particles } from './scripts/cursor';

window.addEventListener('load', (e) => {
  /// add class 'touch' on touch devices
  if(isTouchDevice()){ document.body.classList.add('touch') }

  const classActive = 'active';
  const nav = document.querySelector('nav[role=navigation]');
  /// get page index
  const pathNameMatch = window.location.pathname.match(/\d/);
  /// get currentLink when page load
  const link = document.querySelector(`nav[role="navigation"] li:nth-of-type(${pathNameMatch === null ? 1 : pathNameMatch[0]}) a`);
  let boundsLinks = link.getBoundingClientRect();
  /// get cursor position x at page load
  let xStart = boundsLinks.left + boundsLinks.width/2;
  /// get cursor position y at page load
  let yStart = boundsLinks.top + boundsLinks.height/2;
  /// get link index position in nav at page load
  let index = 0;
  const setIndexLink = (el) => {
    const li = el.parentNode;
    const ul = li.parentNode;
    return index = Array.prototype.slice.call( ul.childNodes ).indexOf(li);
  }

  /// get values of paramsArticles object
  const paramsValues = (i) => Object.values(paramParticles)[i];
  const setSpeed = (i) => paramsValues(i).speed;
  const setParamsCursor = (i) => Object.values(paramsValues(i).cursor);
  const setParamsParticles = (i) => Object.values(paramsValues(i).particles);

  /// init tiny cursor and particles
  const setCursors = (xStart, yStart) => {
    new TinyCursor('#cursor', xStart, yStart, setSpeed(index), ...setParamsCursor(index));
    new Particles( "#particles", xStart, yStart, setSpeed(index), ...setParamsParticles(index));
  }

  /// init events at start
  const init = () => {
    document.body.classList.remove('preload');
    link.classList.add(classActive);
    setIndexLink(link);
    setCursors(xStart, yStart);
  }
  init();

  /// init swup event for page transitions
  const swup = new Swup({
    plugins: [new SwupOverlayTheme({
      color: getComputedStyle(document.body).getPropertyValue('--color-third'),
      duration: 1000,
      direction: 'to-right',
    })]
  });

  /// events on link click
  swup.on('clickLink', (e) => {
    const currentLink = e.delegateTarget;
    const allLinks = nav.querySelectorAll('a');
    for(const link of allLinks){ link.classList.remove(classActive)}
    currentLink.classList.add(classActive);
    xStart = e.clientX;
    yStart = e.clientY;
    setIndexLink(currentLink);
  });

  /// events on content replaced
  swup.on('contentReplaced', (e) => {
    setCursors(xStart, yStart)
  });
});

function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

export function findDiagonal() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const d = Math.sqrt(w*w + h*h);
  return Math.ceil(d);
}
