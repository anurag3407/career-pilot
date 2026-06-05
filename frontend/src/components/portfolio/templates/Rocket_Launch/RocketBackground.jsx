import React from 'react';
import { motion, useTransform } from 'framer-motion';

export default function RocketBackground({ scrollYProgress }) {
  // Stars fade in as the user scrolls down
  const starOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <>
      <style>{`
        /* Smooth continuous space animations */
        @keyframes starLoop {
          0% { transform: translateY(0); }
          100% { transform: translateY(50%); }
        }
        
        @keyframes engineShake {
          0%, 100% { transform: translate(-50%, 0) rotate(0deg); }
          25% { transform: translate(calc(-50% - 1px), 1px) rotate(-0.5deg); }
          50% { transform: translate(calc(-50% + 1px), -1px) rotate(0.5deg); }
          75% { transform: translate(calc(-50% + 0.5px), 0.5px) rotate(-0.2deg); }
        }

        .star-layer-1 { animation: starLoop 60s linear infinite; }
        .star-layer-2 { animation: starLoop 40s linear infinite; }
        .star-layer-3 { animation: starLoop 25s linear infinite; }

        @layer rocket {
          @property --scroll { syntax: "<number>"; inherits: true; initial-value: 0; }
          
          /* Launch Towers */
          .launch-towers::before, .launch-towers::after {
            --tower-x: -300%;
            content: ""; position: absolute; left: 50%; translate: var(--tower-x) 0; bottom: 0;
            width: 40px; height: 430px; clip-path: polygon(50% 0, 100% 100%, 0 100%);
            background-image: repeating-conic-gradient(at top center, #0000 0deg 1deg, #555 0 1.3deg),
              linear-gradient(#0000 120px, #444 0 121px, #0000 0 212px, #444 0 213px, #0000 0 310px, #444 0 311px, #0000 0 410px, #444 0 411px, #0000 0);
            z-index: 1;
            animation: tower-anim 1ms linear; animation-timeline: scroll(root); animation-range: 4% 100%;
          }
          .launch-towers::after { --tower-x: 200%; }
          @keyframes tower-anim { to { translate: var(--tower-x) 1000px; } }

          /* Sky Gradient Linked to Scroll */
          .scene {
            --boost: clamp(0, (var(--scroll) - 20) / 20, 1);
            --stage: clamp(0, (var(--scroll) - 60) / 20, 1);
            --t: calc(var(--scroll) / 100);
            
            /* ORIGINAL ARTEMIS DESIGN VARIABLES */
            --g-round: linear-gradient(90deg, #999, #0000 20% 80%, #ccc);
            --g-checker-l: repeating-conic-gradient(#FFF 0 25%, #000 0 50%);
            --g-checker-r: repeating-conic-gradient(#000 0 25%, #FFF 0 50%);
            --g-dot: radial-gradient(1q, rgb(228 228 231 / 0.5) 1px, #0000);
            --g-dot-w: radial-gradient(1q, white 1px, #0000);
            
            --rocket-width: 40px; --rocket-height: 350px;
            
            /* Capsule */
            --capsule-width: 20px; --capsule-height: 30px;
            --capsule-bg: var(--g-round), linear-gradient(#EEE 0 1px, #0000 0), linear-gradient(#EEE 0 1px, #0000 0) 0 24px, white;
            
            /* Upper Stage (NASA Logo completely removed) */
            --upper-width: 20px; --upper-height: 30px; --upper-y: var(--capsule-height);
            --upper-bg: var(--g-round), var(--g-checker-l) 3px 21px / 3px 3px no-repeat, var(--g-checker-r) 15px 21px / 3px 3px no-repeat, linear-gradient(#0000 20px, rgb(228 228 231 / 0.5) 0 21px, #0000 0 22px), white;

            /* Core Stage (Orange with all intricate checker/dot details) */
            --core-width: 100%; --core-height: 270px; --core-y: calc(var(--upper-y) + var(--upper-height));
            --core-flame-width: 30px; --core-flame-height: 80px;
            --core-bg: var(--g-checker-r) 18px 43px / 4px 4px no-repeat, var(--g-checker-r) 15px 176px / 4px 4px no-repeat, linear-gradient(#0000 35px, rgb(225, 113, 0) 0 36px, #0000 0 38px, rgb(225, 113, 0) 0 39px, #0000 0 55px, rgb(225, 113, 0) 0 56px, #0000 0 65px, rgb(225, 113, 0) 0 66px, #0000 0 75px, rgb(225, 113, 0) 0 76px, #0000 0 85px, rgb(225, 113, 0) 0 86px, #0000 0 95px, rgb(225, 113, 0) 0 96px, #0000 0 105px, rgb(225, 113, 0) 0 106px, #0000 0 115px, rgb(225, 113, 0) 0 116px, #0000 0 125px, rgb(225, 113, 0) 0 126px, #0000 0 135px, rgb(225, 113, 0) 0 136px, #0000 0 145px, rgb(225, 113, 0) 0 146px, #0000 0 158px, #CCC 0 159px, #0000 0 163px, #CCC 0 164px, #0000 0) 20px 80px/ 3px 200px no-repeat, linear-gradient(90deg, #DDD, #FFF, #DDD) 20px 122px/3px 132px no-repeat, var(--g-dot) 17px 2px/ 2px 2px no-repeat, var(--g-dot) 17px 16px/ 2px 2px no-repeat, var(--g-dot) 17px 36px/ 2px 2px no-repeat, var(--g-dot-w) 20px 56px/ 2px 2px no-repeat, var(--g-dot-w) 3px 90px/ 2px 2px no-repeat, var(--g-dot-w) 7px 90px/ 2px 2px no-repeat, var(--g-dot-w) 20px 90px/ 2px 2px no-repeat, var(--g-dot-w) 20px 96px/ 2px 2px no-repeat, var(--g-dot-w) 20px 102px/ 2px 2px no-repeat, var(--g-dot-w) 30px 90px/ 2px 2px no-repeat, var(--g-dot-w) 30px 96px/ 2px 2px no-repeat, var(--g-dot-w) 30px 102px/ 2px 2px no-repeat, var(--g-dot) 2px 100px/ 2px 2px no-repeat, var(--g-dot) 7px 100px/ 2px 2px no-repeat, var(--g-dot) 12px 100px/ 2px 2px no-repeat, radial-gradient(1q 1.4q, rgb(68 19 6 / .5) 2px, rgb(228 228 231 / 0.5) 0 3px, #0000) 2px 28px/6px 10px no-repeat, radial-gradient(1q, rgb(68 19 6 / .5) 4px, rgb(228 228 231 / 0.5) 0 5px, #0000) 22px 28px/10px 10px no-repeat, conic-gradient(#CCC 0 25%, #0000 0) 2px 42px / 6px 10px no-repeat, conic-gradient(#EEE 0 25%, #0000 0) 29px 42px / 3px 6px no-repeat, conic-gradient(#CCC 0 25%, #0000 0) 5px 120px / 6px 10px no-repeat, conic-gradient(#CCC 0 25%, #0000 0) 25px 119px / 7px 7px no-repeat, conic-gradient(#CCC 0 25%, #0000 0) 13px 254px / 6px 10px no-repeat, conic-gradient(#CCC 0 25%, #0000 0) 20px 254px / 6px 10px no-repeat, linear-gradient(100deg, #0000 0 10px, rgb(228 228 231 / 0.5) 0 11px, #0000 0) 2px -10px / 21px 50px no-repeat, linear-gradient(94deg, #0000 0 10px, rgb(228 228 231 / 0.5) 0 11px, #0000 0) 5px -10px / 21px 50px no-repeat, linear-gradient(90deg, #0000 0 10px, rgb(228 228 231 / 0.5) 0 11px, #0000 0) 10px -10px / 21px 50px no-repeat, linear-gradient(85deg, #0000 0 10px, rgb(228 228 231 / 0.5) 0 11px, #0000 0) 18px -10px / 21px 50px no-repeat, linear-gradient(80deg, #0000 0 10px, rgb(228 228 231 / 0.5) 0 11px, #0000 0) 25px -10px / 21px 50px no-repeat, linear-gradient(90deg, rgba(1,1,1,.15), #0000 20% 80%, rgba(1,1,1,.15)), linear-gradient(rgb(225 113 0) 40px, #777 40px 41px, rgb(225 113 0) 0 50px, rgb(255 214 167) 0 53px, rgb(225 113 0) 0 104px, rgb(255 214 167) 0 108px, rgb(225 113 0) 0 127px, rgb(255 214 167) 0 133px, rgb(225 113 0) 0 230px, rgb(255 214 167) 0 234px, #efefef 0 250px, #eee 0 252px, #DDD 0 253px, #efefef 0);

            /* Boosters */
            --booster-width: 15px; --booster-height: 190px; --booster-y: 152px;
            --booster-flame-width: 20px; --booster-flame-height: 100px;
            --booster-bg: var(--g-round), var(--g-checker-r) 5px 31px / 3px 3px no-repeat, var(--g-checker-l) 5px 36px / 2px 2px no-repeat, var(--g-checker-l) 8px 36px / 2px 2px no-repeat, var(--g-checker-l) 11px 36px / 2px 2px no-repeat, var(--g-checker-l) 14px 36px / 2px 2px no-repeat, var(--g-checker-l) 5px 78px / 2px 2px no-repeat, var(--g-checker-l) 8px 78px / 2px 2px no-repeat, var(--g-checker-l) 11px 78px / 2px 2px no-repeat, var(--g-checker-l) 14px 78px / 2px 2px no-repeat, var(--g-checker-l) 5px 140px / 2px 2px no-repeat, var(--g-checker-l) 8px 140px / 2px 2px no-repeat, var(--g-checker-l) 11px 140px / 2px 2px no-repeat, var(--g-checker-l) 14px 140px / 2px 2px no-repeat, var(--g-checker-l) 10px 47px / 2px 10px no-repeat, var(--g-checker-l) 10px 60px / 2px 10px no-repeat, var(--g-checker-l) 10px 89px / 2px 10px no-repeat, var(--g-checker-l) 10px 104px / 2px 10px no-repeat, var(--g-checker-l) 10px 118px / 2px 10px no-repeat, var(--g-checker-r) 5px 145px / 3px 3px no-repeat, linear-gradient(#0000 20px, rgb(225, 113, 0) 20px 21px, black 0 23px, #0000 0 29px, #555 0 30px, #0000 0 43px, #555 0 44px, #0000 0 72px, #555 0 73px, #0000 0 101px, #555 0 102px, #0000 0 129px, #555 0 130px, #0000 0 150px, black 0 151px, #0000 0 170px, black 0 171px, #0000 0 176px, black 0 177px, #0000 0 182px, black 0 183px, #0000 0 188px, black 0 189px, #0000 0 193px, black 0 194px, #0000 0 200px, rgb(225, 113, 0) 0 201px, #0000 0) white;

            position: fixed; inset: 0; width: 100vw; height: 100vh;
            background: color-mix(in srgb, rgb(0, 105, 168) calc((1 - var(--t)) * 100%), rgb(2, 6, 24) calc(var(--t) * 100%));
            animation: launch-anim 1ms linear both; animation-timeline: scroll(root); animation-range: 3% 100%;
          }
          @keyframes launch-anim { to { --scroll: 100; } }

          /* Rocket Math - Kept smaller so it doesn't overflow the top of the screen */
          .rocket {
            position: absolute; left: 50%; bottom: 0; width: var(--rocket-width); height: var(--rocket-height);
            transform: translateX(-50%) translateY(calc(pow(var(--scroll) / 100, 1.2) * -35vh - var(--boost) * 15vh));
            transform-origin: bottom center;
            transition: scale 0.3s ease;
          }
          @media (min-width: 1024px) { .rocket { scale: 1.0; } }
          @media (min-width: 1440px) { .rocket { scale: 1.1; } }

          .rocket-vessel {
            position: absolute; inset: 0;
            animation: engineShake 0.1s linear infinite;
          }
          .rocket-vessel > * { position: absolute; left: 50%; translate: -50% 0; }

          /* Flag removed from Capsule */
          .capsule { top: 0; width: var(--capsule-width); height: var(--capsule-height); background: var(--capsule-bg); border-radius: 17px 17px 0 0/ 45px; }
          .capsule::before { content: ""; position: absolute; left: 50%; translate: -50% 0; bottom: 100%; width: 8px; height: calc(var(--capsule-height) * 1.5); background: var(--capsule-bg); border-radius: 7px 7px 0 0/ 15px; }

          .upper-stage { top: var(--upper-y); width: var(--upper-width); height: var(--upper-height); background: var(--upper-bg); }

          .core {
            top: var(--core-y); width: var(--core-width); height: var(--core-height); background: var(--core-bg);
            transform-origin: center; border-radius: 10px 10px 5px 5px/ 40px 40px 5px 5px;
            animation: core-sep 1ms linear; animation-timeline: scroll(root); animation-range: 60% 100%;
          }
          .core::before {
            content: ""; position: absolute; top: 100%; left: 5px; width: 80%; height: 20px;
            background: linear-gradient(90deg, rgba(1,1,1,.15), rgba(255,255,255,.05) 20% 80%, rgba(1,1,1,.15)), conic-gradient(at 50% 0,#0000,#333,#0000) 0 0 / 15px space;
            border-radius: 10px 10px 0 0/ 40px;
          }
          .core::after {
            content: ''; position: absolute; top: 100%; left: 50%; translate: -50% 10px;
            width: var(--core-flame-width); height: var(--core-flame-height); transform-origin: top center; transform: scaleX(0.5) scaleY(0.3); filter: blur(2px);
            background: radial-gradient(ellipse at top, rgb(255 105 0) 0, rgb(255, 210, 48) 12%, orange 30%, rgba(255,105,0,0.75) 30%, rgba(255,105,0,0.5) 60%, rgba(255,105,0,0.1) 80%, #0000 90%) repeat-x;
            border-radius: 9in; opacity: 0;
            animation: core-flame 1ms linear both; animation-timeline: scroll(root);
          }
          @keyframes core-sep {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            10% { transform: translate(0, 50px) rotate(0deg); }
            40% { transform: translate(-80px, 200px) rotate(-17deg); opacity: 1; }
            60% { transform: translate(-150px, 400px) rotate(-12deg); }
            100% { transform: translate(-250px, 1200px) rotate(-18deg); opacity: 0; }
          }
          @keyframes core-flame {
            5% { opacity: 1; transform: scaleX(3.3) scaleY(0.5); }
            20% { transform: scaleX(2) scaleY(2); }
            57% { opacity: 1; transform: scaleX(2) scaleY(2.5); }
            58% { opacity: 0; }
            100% { opacity: 0; transform: scaleX(0.5) scaleY(1.5); }
          }

          .booster {
            top: var(--booster-y); width: var(--booster-width); height: var(--booster-height); background: var(--booster-bg); border-radius: 17px 17px 0 0/ 45px;
            transform-origin: center; translate: 0; animation-duration: 1ms; animation-timing-function: linear; animation-timeline: scroll(root); animation-range: 30% 100%;
          }
          .booster[data-side="left"] { left: calc(var(--booster-width) * -1); animation-name: booster-fall-left; }
          .booster[data-side="right"] { scale: -1 1; left: 100%; animation-name: booster-fall-right; }
          .booster::before {
            content: ""; position: absolute; top: 100%; left: 0; width: 15px; height: 10px; background: white; border-radius: 14px 14px 0 0/ 40px; box-shadow: inset 0 1px 2px 2px rgba(0,0,0,0.25);
          }
          .booster::after {
            content: ''; position: absolute; top: 100%; left: 50%; translate: -50% 0; width: var(--booster-flame-width); height: var(--booster-flame-height); opacity: 0;
            transform-origin: top center; transform: scaleX(0.5) scaleY(0.3); filter: blur(3px);
            background: radial-gradient(ellipse at top, rgb(255 105 0) 0, rgb(255, 210, 48) 12%, orange 30%, rgba(255,105,0,0.75) 30%, rgba(255,105,0,0.5) 60%, rgba(255,105,0,0.1) 80%, #0000 90%);
            border-radius: 9in; animation: booster-flame 1ms linear both; animation-timeline: scroll(root);
          }
          @keyframes booster-flame {
            5% { opacity: 1; transform: scaleX(3.3) scaleY(0.5); }
            20% { transform: scaleX(1) scaleY(2); }
            39% { opacity: 1; }
            40%, 100% { opacity: 0; }
          }
          @keyframes booster-fall-left {
            50% { transform: translate(-220px, 400px) rotate(-55deg); opacity: 1; }
            100% { transform: translate(-330px, 1200px) rotate(-100deg); opacity: 0; }
          }
          @keyframes booster-fall-right {
            50% { transform: translate(-180px, 350px) rotate(-62deg); opacity: 1; }
            100% { transform: translate(-350px, 1200px) rotate(-120deg); opacity: 0; }
          }
        }
      `}</style>

      {/* FIXED BACKGROUND LAYERS */}
      <motion.div style={{ opacity: starOpacity }} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-100%] left-0 right-0 h-[200%] w-full star-layer-1">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        </div>
        <div className="absolute top-[-100%] left-0 right-0 h-[200%] w-full star-layer-2">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:70px_70px] opacity-40" />
        </div>
        <div className="absolute top-[-100%] left-0 right-0 h-[200%] w-full star-layer-3">
          <div className="absolute inset-0 bg-[radial-gradient(#f97316_2px,transparent_2px)] [background-size:150px_150px] opacity-30" />
        </div>
      </motion.div>
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden launch-towers">
        <div className="scene">
          <div className="rocket">
            {/* Added vessel wrapper for continuous shake animation */}
            <div className="rocket-vessel">
              <div className="capsule"></div>
              <div className="upper-stage"></div>
              <div className="core"></div>
              <div className="booster" data-side="left"></div>
              <div className="booster" data-side="right"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}