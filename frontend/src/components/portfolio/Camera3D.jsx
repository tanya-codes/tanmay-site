import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCursorPosition } from "../../hooks/useCursorPosition";

/**
 * Camera3D — a stylized CSS-3D cinema camera that floats & rotates with cursor.
 * No Three.js. All layered divs on Z-axis inside a `preserve-3d` scene.
 */
export default function Camera3D({ size = 320 }) {
  const cursor = useCursorPosition();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 90, damping: 18 });
  const sry = useSpring(ry, { stiffness: 90, damping: 18 });

  // Base slow rotation (idle) + cursor drift
  const idleY = useMotionValue(0);
  React.useEffect(() => {
    let raf;
    let t = 0;
    const tick = () => {
      t += 0.008;
      idleY.set(Math.sin(t) * 8);
      raf = requestAnimationFrame(tick);
    };
    if (
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(pointer: coarse)").matches
    )
      raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idleY]);

  React.useEffect(() => {
    rx.set(cursor.y * -14 - 8); // slight downward look
    ry.set(cursor.x * 22 - 18); // three-quarter view
  }, [cursor.x, cursor.y, rx, ry]);

  const scale = size / 320;
  const px = (n) => `${n * scale}px`;

  const finalRotY = useTransform(sry, (v) => v + 0); // combine with idle if desired

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        perspective: 1400,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {/* Ground glow */}
      <div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 w-[70%] h-[24px] rounded-[50%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(182,0,168,0.28) 0%, transparent 70%)",
          filter: "blur(14px)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          rotateX: srx,
          rotateY: finalRotY,
          translateY: idleY,
        }}
      >
        {/* -------- Camera body (cuboid front + back + sides) -------- */}
        <CameraCuboid
          width={px(200)}
          height={px(120)}
          depth={px(140)}
          topColor="#161616"
          faceColor="#1a1a1a"
          sideColor="#0e0e0e"
        />

        {/* -------- Top handle -------- */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) translateY(${px(-95)}) translateZ(0)`,
            transformStyle: "preserve-3d",
          }}
        >
          <CameraCuboid
            width={px(170)}
            height={px(22)}
            depth={px(50)}
            topColor="#1c1c1c"
            faceColor="#171717"
            sideColor="#0d0d0d"
          />
          {/* Cold-shoe mount */}
          <div
            className="absolute left-1/2"
            style={{
              top: 0,
              transform: `translate(-50%, ${px(-16)}) translateZ(${px(20)})`,
            }}
          >
            <div
              style={{
                width: px(46),
                height: px(14),
                background: "#0a0a0a",
                borderRadius: px(3),
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.6)",
              }}
            />
          </div>
        </div>

        {/* -------- Lens (multi-ring cylinder protruding on Z+) -------- */}
        <LensStack scale={scale} />

        {/* -------- Viewfinder box on left side -------- */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) translateX(${px(-110)}) translateZ(${px(40)})`,
            transformStyle: "preserve-3d",
          }}
        >
          <CameraCuboid
            width={px(50)}
            height={px(50)}
            depth={px(60)}
            topColor="#171717"
            faceColor="#0f0f0f"
            sideColor="#0a0a0a"
          />
          {/* Eyepiece cushion */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) translateX(${px(-30)}) rotateY(-90deg)`,
              width: px(28),
              height: px(28),
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 40%, #2a2a2a 0%, #050505 60%, #000 100%)",
              boxShadow: "inset 0 0 8px rgba(0,0,0,0.9)",
            }}
          />
        </div>

        {/* -------- Grip / handle on right -------- */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) translateX(${px(105)}) translateY(${px(18)}) translateZ(${px(20)})`,
            transformStyle: "preserve-3d",
          }}
        >
          <CameraCuboid
            width={px(34)}
            height={px(100)}
            depth={px(50)}
            topColor="#1c1c1c"
            faceColor="#161616"
            sideColor="#0a0a0a"
          />
        </div>

        {/* -------- REC LED -------- */}
        <div
          className="absolute left-1/2 top-1/2 animate-record-blink"
          style={{
            transform: `translate(-50%, -50%) translateX(${px(-70)}) translateY(${px(-38)}) translateZ(${px(72)})`,
            width: px(9),
            height: px(9),
            borderRadius: "50%",
            background: "#ff2d2d",
            boxShadow:
              "0 0 12px rgba(255,45,45,0.9), 0 0 24px rgba(255,45,45,0.5)",
          }}
        />

        {/* -------- Brand label on body -------- */}
        <div
          className="absolute left-1/2 top-1/2 text-white/70 font-mono uppercase tracking-[0.28em]"
          style={{
            transform: `translate(-50%, -50%) translateY(${px(28)}) translateZ(${px(71)})`,
            fontSize: px(9),
          }}
        >
          Tanmay · Visuals
        </div>

        {/* -------- Screen (rear side) -------- */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) translateZ(${px(-71)}) rotateY(180deg)`,
            width: px(120),
            height: px(72),
            background:
              "linear-gradient(135deg, rgba(182,0,168,0.35) 0%, rgba(118,33,176,0.25) 60%, rgba(0,0,0,0.9) 100%)",
            borderRadius: px(6),
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.6)",
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * A cuboid built from 6 faces using CSS 3D. Positioned absolutely centered.
 * Ideal for representing the body, handle, viewfinder etc.
 */
function CameraCuboid({ width, height, depth, faceColor, sideColor, topColor }) {
  // Use px-string numeric extraction
  const w = parseFloat(width);
  const h = parseFloat(height);
  const d = parseFloat(depth);
  const style = { position: "absolute", inset: 0, transformStyle: "preserve-3d" };

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width,
        height,
        transform: `translate(-50%, -50%)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front */}
      <Face w={w} h={h} tx={0} ty={0} tz={d / 2} color={faceColor} highlight />
      {/* Back */}
      <Face w={w} h={h} tx={0} ty={0} tz={-d / 2} ry={180} color={faceColor} />
      {/* Left */}
      <Face w={d} h={h} tx={-w / 2} ty={0} tz={0} ry={-90} color={sideColor} />
      {/* Right */}
      <Face w={d} h={h} tx={w / 2} ty={0} tz={0} ry={90} color={sideColor} />
      {/* Top */}
      <Face w={w} h={d} tx={0} ty={-h / 2} tz={0} rx={90} color={topColor} highlight />
      {/* Bottom */}
      <Face w={w} h={d} tx={0} ty={h / 2} tz={0} rx={-90} color={sideColor} />
    </div>
  );
}

function Face({ w, h, tx, ty, tz, rx = 0, ry = 0, color, highlight }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: w,
        height: h,
        transform: `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        background: highlight
          ? `linear-gradient(135deg, ${color} 0%, #0a0a0a 100%)`
          : color,
        borderRadius: 6,
        boxShadow: highlight
          ? "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)"
          : "inset 0 0 0 1px rgba(0,0,0,0.4)",
      }}
    />
  );
}

/** Lens — stack of cylindrical rings on Z-axis with glass in front */
function LensStack({ scale }) {
  const px = (n) => `${n * scale}px`;
  const rings = [
    { z: 65, r: 66, color: "#101010", bright: 0.08 },
    { z: 82, r: 62, color: "#151515", bright: 0.12 },
    { z: 100, r: 58, color: "#1a1a1a", bright: 0.16 },
    { z: 118, r: 52, color: "#131313", bright: 0.2 },
    { z: 132, r: 48, color: "#0e0e0e", bright: 0.14 },
  ];

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
        transform: "translate(-50%, -50%)",
        transformStyle: "preserve-3d",
      }}
    >
      {rings.map((r, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: px(r.r * 2),
            height: px(r.r * 2),
            left: -r.r * scale,
            top: -r.r * scale,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,${r.bright}) 0%, ${r.color} 50%, #000 100%)`,
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow:
              "inset 0 0 10px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.5)",
            transform: `translateZ(${px(r.z).replace("px", "")}px)`,
          }}
        />
      ))}
      {/* Front glass */}
      <div
        className="absolute"
        style={{
          width: px(90),
          height: px(90),
          left: px(-45),
          top: px(-45),
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.28) 0%, rgba(20,15,40,0.85) 35%, #050510 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "inset 0 0 18px rgba(140,0,168,0.5), 0 0 24px rgba(120,30,180,0.35)",
          transform: `translateZ(${140 * scale}px)`,
        }}
      />
      {/* Anamorphic flare highlight */}
      <div
        className="absolute animate-spin-slow"
        style={{
          width: px(30),
          height: px(4),
          left: px(-15),
          top: px(-2),
          borderRadius: 4,
          background:
            "linear-gradient(90deg, transparent, rgba(190,220,255,0.7), transparent)",
          filter: "blur(1px)",
          transform: `translate3d(${-10 * scale}px, ${-10 * scale}px, ${
            145 * scale
          }px)`,
        }}
      />
    </div>
  );
}
