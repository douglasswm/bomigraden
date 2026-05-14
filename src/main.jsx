import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownToLine,
  Brush,
  Cat,
  Check,
  Eraser,
  Flower2,
  Image as ImageIcon,
  MousePointer2,
  RotateCcw,
  SendHorizontal,
  Trash2,
  Undo2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { CorgiIdleSprite } from "./SpriteAnimation.js";
import "./styles.css";

const CANVAS_SIZE = 220;
const STORAGE_KEY = "bomigarden-state";
const BACKGROUND_AUDIO_SRC = "/assets/audio/cat_sound.mp3";
const CAT_WALK_DURATION = 6200;
const CAT_REST_DURATION = 2200;
const CAT_JUMP_DURATION = 2400;
const CAT_TICK_MS = 1000 / 60;
const CAT_COLLISION_DISTANCE = 12.5;
const CAT_COLLISION_REARM_DISTANCE = 16;
const TOY_CATCH_DISTANCE = 8.5;
const TOY_ACTION_FRAME_COUNT = 5;
const TOY_DROP_DURATION_MS = 560;
const TOY_THROW_DURATION_MS = 680;
const CAT_INTERACTION_COOLDOWN_MS = 3000;
const CAT_RESTORE_SPACING = 7.2;
const CAT_TAP_MODES = ["idle", "walk", "sleeping", "jumping", "rolling_over"];
const CAT_CONTROL_OPTIONS = [
  { action: "idle", label: "Idle" },
  { action: "walk", label: "Walk" },
  { action: "sleeping", label: "Sleep" },
  { action: "jumping", label: "Jump" },
  { action: "rolling_over", label: "Roll Over" },
];
const CAT_IDS = {
  calico: "calico",
  snow: "snow",
};
const CAT_WAYPOINTS = [
  { x: 23, y: 33 },
  { x: 41, y: 27 },
  { x: 61, y: 34 },
  { x: 72, y: 52 },
  { x: 61, y: 68 },
  { x: 42, y: 77 },
  { x: 25, y: 72 },
  { x: 34, y: 56 },
];
const SNOW_WAYPOINTS = [
  { x: 67, y: 58 },
  { x: 77, y: 49 },
  { x: 69, y: 38 },
  { x: 53, y: 43 },
  { x: 51, y: 59 },
  { x: 63, y: 73 },
  { x: 78, y: 69 },
];
const CAT_FRAME_DURATIONS = {
  idle: 500,
  walk: 125,
  sleeping: 260,
  jumping: 240,
  rolling_over: 260,
  rolling_over_with_toy: 380,
};
const CAT_ACTION_LABELS = {
  idle: "idle",
  walk: "walk",
  sleeping: "sleeping",
  jumping: "jumping",
  rolling_over: "rolling over",
  rolling_over_with_toy: "rolling over with toy",
};
const CAT_LOOPING_ACTIONS = new Set(["idle", "walk", "sleeping"]);
const CAT_ONE_SHOT_ACTIONS = new Set(["jumping", "rolling_over", "rolling_over_with_toy"]);
const DUO_INTERACTION_FRAME_DURATION = 280;
const DUO_INTERACTION_FRAMES = Array.from(
  { length: 10 },
  (_, index) =>
    `/assets/cat/duo-interaction/frames/duo_play_${String(index + 1).padStart(2, "0")}.png`
);
const TOY_PLAY_DURATION_MS = 9600;
const CAT_TOY_ASSET_VERSION = "toyfix-3";
function versionCatToyAsset(src) {
  return `${src}?v=${CAT_TOY_ASSET_VERSION}`;
}
const CAT_ASSET_VERSION = "catfix-4";
function versionCatAsset(src) {
  return `${src}?v=${CAT_ASSET_VERSION}`;
}
const toyAssets = {
  chili: {
    label: "Chili",
    static: versionCatToyAsset("/assets/cat-toys/toys/chili_static.png"),
    drop: {
      frameDurationMs: Math.round(TOY_DROP_DURATION_MS / TOY_ACTION_FRAME_COUNT),
      durationMs: TOY_DROP_DURATION_MS,
      frames: createToyFrames("chili", "drop"),
    },
    throw: {
      frameDurationMs: Math.round(TOY_THROW_DURATION_MS / TOY_ACTION_FRAME_COUNT),
      durationMs: TOY_THROW_DURATION_MS,
      frames: createToyFrames("chili", "throw"),
    },
  },
  carrot: {
    label: "Carrot",
    static: versionCatToyAsset("/assets/cat-toys/toys/carrot_static.png"),
    drop: {
      frameDurationMs: Math.round(TOY_DROP_DURATION_MS / TOY_ACTION_FRAME_COUNT),
      durationMs: TOY_DROP_DURATION_MS,
      frames: createToyFrames("carrot", "drop"),
    },
    throw: {
      frameDurationMs: Math.round(TOY_THROW_DURATION_MS / TOY_ACTION_FRAME_COUNT),
      durationMs: TOY_THROW_DURATION_MS,
      frames: createToyFrames("carrot", "throw"),
    },
  },
};
const toyOptions = Object.entries(toyAssets).map(([toyType, asset]) => ({
  toyType,
  ...asset,
}));
const toyActionOptions = [
  { actionType: "drop", label: "Drop", icon: ArrowDownToLine },
  { actionType: "throw", label: "Throw", icon: SendHorizontal },
];

function createToyFrames(toyType, actionType) {
  return Array.from(
    { length: TOY_ACTION_FRAME_COUNT },
    (_, index) =>
      versionCatToyAsset(
        `/assets/cat-toys/${toyType}/${actionType}/frames/${toyType}_${actionType}_${String(index + 1).padStart(2, "0")}.png`
      )
  );
}

function createCatFrames(basePath, action) {
  return Array.from(
    { length: 10 },
    (_, index) =>
      versionCatAsset(`${basePath}/${action}/${action}_${String(index + 1).padStart(2, "0")}.png`)
  );
}

function createCatAction(basePath, action) {
  return {
    label: CAT_ACTION_LABELS[action],
    frameDurationMs: CAT_FRAME_DURATIONS[action],
    loop: CAT_LOOPING_ACTIONS.has(action),
    frames: createCatFrames(basePath, action),
  };
}

function createCatToyFrames(catType, toyType) {
  return Array.from(
    { length: 10 },
    (_, index) =>
      versionCatToyAsset(
        `/assets/cat-toys/${catType}/${toyType}/frames/${catType}_${toyType}_rolltoy_${String(index + 1).padStart(2, "0")}.png`
      )
  );
}

function createCatToyAction(catType, toyType) {
  return {
    label: CAT_ACTION_LABELS.rolling_over_with_toy,
    frameDurationMs: CAT_FRAME_DURATIONS.rolling_over_with_toy,
    loop: false,
    playDurationMs: TOY_PLAY_DURATION_MS,
    frames: createCatToyFrames(catType, toyType),
  };
}

const catToyAnimations = {
  calico: {
    chili: {
      rolling_over_with_toy: createCatToyAction("calico", "chili"),
    },
    carrot: {
      rolling_over_with_toy: createCatToyAction("calico", "carrot"),
    },
  },
  tuxedo: {
    chili: {
      rolling_over_with_toy: createCatToyAction("tuxedo", "chili"),
    },
    carrot: {
      rolling_over_with_toy: createCatToyAction("tuxedo", "carrot"),
    },
  },
};

const catSpritePacks = {
  calico: {
    label: "Calico",
    scale: 0.42,
    toyAnimations: catToyAnimations.calico,
    actions: {
      idle: {
        ...createCatAction("/assets/cat/idle-walk-smooth", "idle"),
      },
      walk: {
        ...createCatAction("/assets/cat/idle-walk-smooth", "walk"),
      },
      sleeping: {
        ...createCatAction("/assets/cat/smooth", "sleeping"),
      },
      jumping: {
        ...createCatAction("/assets/cat/smooth", "jumping"),
      },
      rolling_over: {
        ...createCatAction("/assets/cat/smooth", "rolling_over"),
      },
    },
  },
  snow: {
    label: "Snow",
    scale: 0.4,
    toyAnimations: catToyAnimations.tuxedo,
    actions: Object.fromEntries(
      CAT_TAP_MODES.map((action) => [action, createCatAction("/assets/cat/tuxedo", action)])
    ),
  },
};
const CAT_BASE_ACTIONS = new Set(["idle", "walk"]);

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function easeInOut(amount) {
  return amount < 0.5 ? 2 * amount * amount : 1 - Math.pow(-2 * amount + 2, 2) / 2;
}

function isPointOnGarden(x, y) {
  const upperIsland = Math.pow((x - 50) / 43, 2) + Math.pow((y - 39) / 28, 2) <= 1;
  const lowerIsland = Math.pow((x - 45) / 34, 2) + Math.pow((y - 72) / 23, 2) <= 1;
  const leftBite = x < 34 && y > 38 && y < 58;

  return (upperIsland || lowerIsland) && !leftBite && x > 8 && x < 91 && y > 12 && y < 91;
}

function clampToGarden(x, y) {
  if (isPointOnGarden(x, y)) {
    return { x, y };
  }

  return CAT_WAYPOINTS.reduce((closest, point) => {
    const distance = Math.hypot(point.x - x, point.y - y);
    return distance < closest.distance ? { point, distance } : closest;
  }, { point: CAT_WAYPOINTS[0], distance: Infinity }).point;
}

function distanceBetweenPoints(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function getMidpoint(first, second) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function nudgeGardenPoint(origin, offsetX, offsetY = 0) {
  const point = {
    x: origin.x + offsetX,
    y: origin.y + offsetY,
  };

  return isPointOnGarden(point.x, point.y) ? point : clampToGarden(point.x, point.y);
}

const palette = [
  "#f45b69",
  "#ffb703",
  "#7f4f24",
  "#2a9d8f",
  "#277da1",
  "#744fc6",
  "#ffffff",
  "#1f2937",
];

function svgFlower(markup) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;
}

const flowerTemplates = [
  {
    id: "wildflower",
    name: "Wildflower",
    image: svgFlower(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <path d="M60 60 C46 26 76 26 60 60Z" fill="#f45b69"/>
  <path d="M60 60 C94 46 94 76 60 60Z" fill="#ffb703"/>
  <path d="M60 60 C74 94 44 94 60 60Z" fill="#2a9d8f"/>
  <path d="M60 60 C26 74 26 44 60 60Z" fill="#744fc6"/>
  <circle cx="60" cy="60" r="11" fill="#fff3b0"/>
  <path d="M60 68 C58 84 55 96 48 108" stroke="#2f6f4e" stroke-width="7" stroke-linecap="round" fill="none"/>
</svg>`)
  },
  {
    id: "tulip",
    name: "Tulip",
    image: svgFlower(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <path d="M61 60 C60 78 56 93 51 110" fill="none" stroke="#2f7d50" stroke-width="7" stroke-linecap="round"/>
  <path d="M55 83 C35 76 31 62 39 50 C49 62 56 71 55 83Z" fill="#5ab26b"/>
  <path d="M65 82 C84 72 90 58 81 47 C73 61 66 71 65 82Z" fill="#3d9d5b"/>
  <path d="M61 59 C38 48 39 21 58 35 C66 18 84 30 76 52 C72 62 66 66 61 59Z" fill="#ec5a62"/>
  <path d="M60 57 C55 39 60 30 69 23 C75 38 75 54 60 57Z" fill="#f47b83"/>
  <path d="M61 59 C50 50 47 38 52 26 C59 38 63 48 61 59Z" fill="#d83f56"/>
</svg>`)
  },
  {
    id: "sunflower",
    name: "Sunflower",
    image: svgFlower(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <path d="M60 63 C59 80 57 95 54 111" fill="none" stroke="#2f7d50" stroke-width="7" stroke-linecap="round"/>
  <path d="M55 84 C39 78 36 66 44 57 C53 68 58 75 55 84Z" fill="#56a95c"/>
  <g transform="translate(60 49)">
    <path d="M0-18 C-9-44 9-44 0-18Z" fill="#ffd447"/>
    <path d="M0 18 C-9 44 9 44 0 18Z" fill="#ffd447"/>
    <path d="M-18 0 C-44-9-44 9-18 0Z" fill="#ffd447"/>
    <path d="M18 0 C44-9 44 9 18 0Z" fill="#ffd447"/>
    <path d="M-13-13 C-39-28-28-39-13-13Z" fill="#ffb703"/>
    <path d="M13-13 C28-39 39-28 13-13Z" fill="#ffb703"/>
    <path d="M13 13 C39 28 28 39 13 13Z" fill="#ffb703"/>
    <path d="M-13 13 C-28 39-39 28-13 13Z" fill="#ffb703"/>
    <circle r="15" fill="#75451f"/>
    <circle r="8" fill="#513018"/>
  </g>
</svg>`)
  },
  {
    id: "lily",
    name: "Lily",
    image: svgFlower(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <path d="M59 61 C59 80 56 96 50 111" fill="none" stroke="#2f7d50" stroke-width="7" stroke-linecap="round"/>
  <path d="M58 66 C34 58 29 37 49 42 C47 22 67 25 61 51 C75 28 91 40 75 58 C69 65 63 68 58 66Z" fill="#fff8e8"/>
  <path d="M59 61 C49 49 47 36 55 24 C64 41 65 54 59 61Z" fill="#ffe2cc"/>
  <path d="M58 63 C44 64 35 56 30 43 C44 43 55 50 58 63Z" fill="#fff0d8"/>
  <path d="M62 62 C77 57 85 47 88 34 C73 37 63 48 62 62Z" fill="#fff0d8"/>
  <path d="M56 58 L49 43 M60 58 L61 39 M64 58 L76 43" stroke="#c9782a" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="49" cy="42" r="3" fill="#c9782a"/>
  <circle cx="61" cy="38" r="3" fill="#c9782a"/>
  <circle cx="77" cy="42" r="3" fill="#c9782a"/>
</svg>`)
  },
  {
    id: "rose",
    name: "Rose",
    image: svgFlower(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <path d="M61 62 C60 78 58 96 54 111" fill="none" stroke="#2f7d50" stroke-width="7" stroke-linecap="round"/>
  <path d="M57 82 C39 76 34 63 43 52 C52 63 58 72 57 82Z" fill="#4fa85c"/>
  <path d="M64 80 C81 72 86 60 78 50 C70 62 64 71 64 80Z" fill="#3e9b55"/>
  <g transform="translate(60 45)">
    <path d="M0 20 C-26 18-30-11-9-13 C-3-30 22-22 17-1 C31 10 17 26 0 20Z" fill="#d93d5b"/>
    <path d="M-15 5 C-19-9-6-18 6-12 C-4-7-8-1-5 8Z" fill="#f0647d"/>
    <path d="M3 13 C-9 7-7-7 5-10 C16-7 18 6 8 13Z" fill="#b72f4a"/>
    <path d="M8 5 C0 4-2-5 6-8 C16-3 15 6 8 5Z" fill="#ff8aa0"/>
  </g>
</svg>`)
  },
];

const starterFlower = flowerTemplates[0].image;
const openingLetter = {
  to: "Damcho",
  message:
    "Happy Meowther's Day. Thank you for every meal, cuddle, and gentle bit of care. Bomi loves her mother more than every sunny spot.",
  from: "Bomi",
  flowers: [
    { src: "/assets/letter/flower-0.png", className: "letter-flower letter-flower-one" },
    { src: "/assets/letter/flower-2.png", className: "letter-flower letter-flower-two" },
    { src: "/assets/letter/flower-4.png", className: "letter-flower letter-flower-three" },
    { src: "/assets/letter/flower-5.png", className: "letter-flower letter-flower-four" },
  ],
};
const permanentGardenFlowers = [
  {
    src: "/assets/letter/flower-0.png",
    className: "garden-decor-flower garden-decor-flower-one",
  },
  {
    src: "/assets/letter/flower-2.png",
    className: "garden-decor-flower garden-decor-flower-two",
  },
  {
    src: "/assets/letter/flower-4.png",
    className: "garden-decor-flower garden-decor-flower-three",
  },
  {
    src: "/assets/letter/flower-5.png",
    className: "garden-decor-flower garden-decor-flower-four",
  },
];

function loadGarden() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (Array.isArray(stored.flowers)) {
      return {
        flowers: stored.flowers,
        currentFlower: stored.currentFlower || starterFlower,
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { flowers: [], currentFlower: starterFlower };
}

function usePersistentGarden() {
  const [garden, setGarden] = React.useState(loadGarden);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(garden));
  }, [garden]);

  return [garden, setGarden];
}

function DrawingPad({ selectedColor, brushSize, tool, onSave, undoSignal, clearSignal }) {
  const canvasRef = React.useRef(null);
  const ctxRef = React.useRef(null);
  const drawingRef = React.useRef(false);
  const historyRef = React.useRef([]);
  const lastPointRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const scale = window.devicePixelRatio || 1;

    canvas.width = CANVAS_SIZE * scale;
    canvas.height = CANVAS_SIZE * scale;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    ctx.scale(scale, scale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(255,255,255,0)";
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxRef.current = ctx;
    drawStarterGuide(ctx);
    saveHistory();
  }, []);

  React.useEffect(() => {
    if (!undoSignal) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (historyRef.current.length < 2) return;
    historyRef.current.pop();
    const previous = historyRef.current[historyRef.current.length - 1];
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.putImageData(previous, 0, 0);
    canvas.dispatchEvent(new Event("input"));
  }, [undoSignal]);

  React.useEffect(() => {
    if (!clearSignal) return;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    saveHistory();
  }, [clearSignal]);

  function drawStarterGuide(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "#31543f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(110, 110, 38, 0, Math.PI * 2);
    ctx.moveTo(110, 72);
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      ctx.moveTo(110, 110);
      ctx.quadraticCurveTo(
        110 + Math.cos(angle - 0.28) * 34,
        110 + Math.sin(angle - 0.28) * 34,
        110 + Math.cos(angle) * 56,
        110 + Math.sin(angle) * 56
      );
    }
    ctx.stroke();
    ctx.restore();
  }

  function saveHistory() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    historyRef.current = [
      ...historyRef.current.slice(-11),
      ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE),
    ];
  }

  function getPoint(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    const pointer = event.touches?.[0] || event;
    return {
      x: pointer.clientX - rect.left,
      y: pointer.clientY - rect.top,
    };
  }

  function startDrawing(event) {
    event.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = getPoint(event);
  }

  function draw(event) {
    if (!drawingRef.current) return;
    event.preventDefault();
    const point = getPoint(event);
    const ctx = ctxRef.current;
    const lastPoint = lastPointRef.current;

    ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = tool === "erase" ? brushSize + 8 : brushSize;
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function stopDrawing() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    saveHistory();
  }

  function saveFlower() {
    onSave(canvasRef.current.toDataURL("image/png"));
  }

  return (
    <div className="drawing-pad" aria-label="Flower drawing canvas">
      <canvas
        ref={canvasRef}
        className="flower-canvas"
        aria-label="Draw a flower"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button className="primary-action" type="button" onClick={saveFlower}>
        <Check size={18} aria-hidden="true" />
        Save flower
      </button>
    </div>
  );
}

function usePreloadImages(sources) {
  React.useEffect(() => {
    const images = sources.map((source) => {
      const image = new Image();
      image.src = source;
      return image;
    });

    return () => {
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [sources]);
}

function AnimatedCat({
  spritePack,
  waypoints = CAT_WAYPOINTS,
  initialPosition = waypoints[0],
  autoWalk,
  target,
  requestedAction,
  requestedToyType,
  onModeChange,
  onActionComplete,
  onTargetReached,
  onPositionChange,
  className = "",
}) {
  const catRef = React.useRef(null);
  const waypointRef = React.useRef(0);
  const positionRef = React.useRef(initialPosition);
  const rafRef = React.useRef(null);
  const restTimerRef = React.useRef(null);
  const lastTickRef = React.useRef(0);
  const frameRafRef = React.useRef(null);
  const frameStartedAtRef = React.useRef(0);
  const baseFrameRafRef = React.useRef(null);
  const baseFrameStartedAtRef = React.useRef(0);
  const actionCompletedRef = React.useRef(false);
  const activeAction = React.useMemo(() => {
    if (CAT_BASE_ACTIONS.has(requestedAction)) return null;
    if (requestedAction === "rolling_over_with_toy") {
      return spritePack.toyAnimations?.[requestedToyType]?.rolling_over_with_toy || null;
    }

    return spritePack.actions[requestedAction] || null;
  }, [requestedAction, requestedToyType, spritePack]);
  const [frameIndex, setFrameIndex] = React.useState(0);
  const [baseFrameIndex, setBaseFrameIndex] = React.useState(0);
  const [failedFrameSources, setFailedFrameSources] = React.useState(() => new Set());
  const [catState, setCatState] = React.useState({
    isMoving: false,
    direction: 1,
  });
  const spriteFrameSources = React.useMemo(
    () => [
      ...Object.values(spritePack.actions).flatMap((action) => action.frames),
      ...Object.values(spritePack.toyAnimations || {}).flatMap((toyConfig) =>
        Object.values(toyConfig).flatMap((action) => action.frames)
      ),
    ],
    [spritePack]
  );

  usePreloadImages(spriteFrameSources);

  function syncCatPosition(position) {
    if (!catRef.current) return;
    catRef.current.style.setProperty("--cat-x", `${position.x}%`);
    catRef.current.style.setProperty("--cat-y", `${position.y}%`);
    catRef.current.style.setProperty("--cat-depth", Math.round(position.y * 10));
    onPositionChange?.(position);
  }

  function syncCatJumpVisual(progress = 0) {
    if (!catRef.current) return;
    const lift = -Math.sin(progress * Math.PI) * 52;
    const shadowLift = Math.sin(progress * Math.PI) * 18;
    const shadowScale = 1 - Math.sin(progress * Math.PI) * 0.32;
    const shadowOpacity = 1 - Math.sin(progress * Math.PI) * 0.36;

    catRef.current.style.setProperty("--cat-hop-y", `${lift}px`);
    catRef.current.style.setProperty("--cat-shadow-hop-y", `${shadowLift}px`);
    catRef.current.style.setProperty("--cat-shadow-scale", shadowScale.toFixed(3));
    catRef.current.style.setProperty("--cat-shadow-opacity", shadowOpacity.toFixed(3));
  }

  React.useEffect(() => {
    positionRef.current = initialPosition;
    syncCatPosition(initialPosition);
  }, [initialPosition]);

  function clearCatTimers() {
    window.clearTimeout(restTimerRef.current);
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
    }
  }

  function handleCatClick(event) {
    event.stopPropagation();
    onModeChange?.();
  }

  function handleCatKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    onModeChange?.();
  }

  function walkTo(next, onComplete) {
    clearCatTimers();
    const current = positionRef.current;
    const distance = Math.hypot(next.x - current.x, next.y - current.y);
    const duration = Math.max(900, Math.min(CAT_WALK_DURATION, distance * 95));
    const startedAt = performance.now();

    setCatState((state) => ({
      ...state,
      isMoving: true,
      direction: next.x < current.x ? -1 : 1,
    }));

    function step(now) {
      if (now - lastTickRef.current < CAT_TICK_MS) {
        rafRef.current = window.requestAnimationFrame(step);
        return;
      }

      lastTickRef.current = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = easeInOut(progress);
      const position = {
        x: lerp(current.x, next.x, eased),
        y: lerp(current.y, next.y, eased),
      };

      positionRef.current = position;
      syncCatPosition(position);

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(step);
        return;
      }

      positionRef.current = next;
      syncCatPosition(next);
      setCatState((state) => ({ ...state, isMoving: false }));
      onComplete?.();
    }

    rafRef.current = window.requestAnimationFrame(step);
  }

  function jumpTo(next, onComplete) {
    clearCatTimers();
    const current = positionRef.current;
    const distance = Math.hypot(next.x - current.x, next.y - current.y);
    const duration = Math.max(1500, Math.min(CAT_JUMP_DURATION, distance * 130));
    const startedAt = performance.now();

    setCatState((state) => ({
      ...state,
      isMoving: false,
      direction: next.x < current.x ? -1 : 1,
    }));

    function step(now) {
      if (now - lastTickRef.current < CAT_TICK_MS) {
        rafRef.current = window.requestAnimationFrame(step);
        return;
      }

      lastTickRef.current = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = easeInOut(progress);
      const position = {
        x: lerp(current.x, next.x, eased),
        y: lerp(current.y, next.y, eased),
      };

      positionRef.current = position;
      syncCatPosition(position);
      syncCatJumpVisual(progress);

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(step);
        return;
      }

      positionRef.current = next;
      syncCatPosition(next);
      syncCatJumpVisual(0);
      onComplete?.();
    }

    rafRef.current = window.requestAnimationFrame(step);
  }

  React.useEffect(() => {
    clearCatTimers();

    if (!autoWalk) {
      setCatState((state) => ({ ...state, isMoving: false }));
      return undefined;
    }

    function startWalk() {
      const current = positionRef.current;
      const nextIndex = (waypointRef.current + 1) % waypoints.length;
      const next = waypoints[nextIndex];

      waypointRef.current = nextIndex;
      walkTo(next, () => {
        restTimerRef.current = window.setTimeout(startWalk, CAT_REST_DURATION);
      });
    }

    restTimerRef.current = window.setTimeout(startWalk, 400);

    return clearCatTimers;
  }, [autoWalk]);

  React.useEffect(() => {
    if (!activeAction) return undefined;

    clearCatTimers();
    setCatState((state) => ({ ...state, isMoving: false }));

    if (requestedAction !== "jumping" || target) {
      syncCatJumpVisual(0);
      return undefined;
    }

    function startJump() {
      const nextIndex = (waypointRef.current + 1) % waypoints.length;
      const next = waypoints[nextIndex];

      waypointRef.current = nextIndex;
      jumpTo(next);
    }

    restTimerRef.current = window.setTimeout(startJump, 120);

    return () => {
      clearCatTimers();
      syncCatJumpVisual(0);
    };
  }, [activeAction, requestedAction, waypoints]);

  React.useEffect(() => {
    if (!target) return;
    if (target.motion === "jump") {
      jumpTo(target, onTargetReached);
      return;
    }

    walkTo(target, onTargetReached);
  }, [target, onTargetReached]);

  React.useEffect(() => {
    if (!activeAction) {
      setFrameIndex(0);
      return undefined;
    }

    actionCompletedRef.current = false;
    frameStartedAtRef.current = performance.now();
    setFrameIndex(0);

    function step(now) {
      const elapsed = now - frameStartedAtRef.current;
      const nextFrame = Math.floor(elapsed / activeAction.frameDurationMs);

      if (activeAction.loop) {
        setFrameIndex(nextFrame % activeAction.frames.length);
        frameRafRef.current = window.requestAnimationFrame(step);
        return;
      }

      if (!activeAction.loop && activeAction.playDurationMs && elapsed < activeAction.playDurationMs) {
        setFrameIndex(nextFrame % activeAction.frames.length);
        frameRafRef.current = window.requestAnimationFrame(step);
        return;
      }

      if (nextFrame >= activeAction.frames.length) {
        setFrameIndex(
          activeAction.playDurationMs
            ? Math.max(nextFrame - 1, 0) % activeAction.frames.length
            : activeAction.frames.length - 1
        );
        if (!actionCompletedRef.current) {
          actionCompletedRef.current = true;
          onActionComplete?.();
        }
        return;
      }

      setFrameIndex(nextFrame);
      frameRafRef.current = window.requestAnimationFrame(step);
    }

    frameRafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (frameRafRef.current) {
        window.cancelAnimationFrame(frameRafRef.current);
      }
    };
  }, [activeAction, onActionComplete]);

  const baseState = catState.isMoving ? "walk" : "idle";
  const currentCatState = activeAction ? requestedAction : baseState;
  const baseAnimation = spritePack.actions[baseState];
  const baseFrame = baseAnimation.frames[baseFrameIndex % baseAnimation.frames.length];
  const actionFrame = activeAction?.frames[frameIndex] || null;
  const fallbackAction = requestedAction === "rolling_over_with_toy" ? spritePack.actions.rolling_over : null;
  const fallbackFrame = fallbackAction?.frames[frameIndex % fallbackAction.frames.length] || baseFrame;
  const smoothFrame = actionFrame && !failedFrameSources.has(actionFrame) ? actionFrame : fallbackFrame;
  const toyFallbackAsset =
    requestedAction === "rolling_over_with_toy" ? toyAssets[requestedToyType]?.static : null;
  const shouldRenderToyFallback =
    Boolean(toyFallbackAsset) && (!actionFrame || failedFrameSources.has(actionFrame));

  function handleFrameError() {
    if (!actionFrame || failedFrameSources.has(actionFrame)) return;

    setFailedFrameSources((sources) => {
      const nextSources = new Set(sources);
      nextSources.add(actionFrame);
      return nextSources;
    });
  }

  React.useEffect(() => {
    baseFrameStartedAtRef.current = performance.now();
    setBaseFrameIndex(0);

    function step(now) {
      const elapsed = now - baseFrameStartedAtRef.current;
      const nextFrame = Math.floor(elapsed / baseAnimation.frameDurationMs);

      setBaseFrameIndex(nextFrame % baseAnimation.frames.length);
      baseFrameRafRef.current = window.requestAnimationFrame(step);
    }

    baseFrameRafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (baseFrameRafRef.current) {
        window.cancelAnimationFrame(baseFrameRafRef.current);
      }
    };
  }, [baseAnimation]);

  return (
    <div
      ref={catRef}
      className={`animated-cat ${className} cat-state-${currentCatState} ${catState.isMoving ? "is-walking" : "is-idle"}`}
      aria-label={`Tap ${spritePack.label.toLowerCase()} cat to change mode. Current mode: ${currentCatState.replace("_", " ")}`}
      role="button"
      tabIndex={0}
      onClick={handleCatClick}
      onKeyDown={handleCatKeyDown}
      style={{
        "--cat-x": `${initialPosition.x}%`,
        "--cat-y": `${initialPosition.y}%`,
        "--cat-direction": catState.direction,
        "--cat-scale-desktop": spritePack.scale,
        "--cat-scale-mobile": Number((spritePack.scale * 0.86).toFixed(3)),
        "--cat-depth": Math.round(initialPosition.y * 10),
      }}
    >
      <div className="cat-ground-shadow" />
      <img className="cat-frame" src={smoothFrame} alt="" draggable="false" onError={handleFrameError} />
      {shouldRenderToyFallback && (
        <img
          className={`cat-toy-fallback cat-toy-fallback-${requestedToyType}`}
          src={toyFallbackAsset}
          alt=""
          draggable="false"
        />
      )}
    </div>
  );
}

function CalicoCat({ initialPosition = CAT_WAYPOINTS[0], ...props }) {
  return (
    <AnimatedCat
      {...props}
      className="calico-cat"
      spritePack={catSpritePacks.calico}
      waypoints={CAT_WAYPOINTS}
      initialPosition={initialPosition}
    />
  );
}

function SnowCat({ initialPosition = SNOW_WAYPOINTS[0], ...props }) {
  return (
    <AnimatedCat
      {...props}
      className="snow-cat"
      spritePack={catSpritePacks.snow}
      waypoints={SNOW_WAYPOINTS}
      initialPosition={initialPosition}
    />
  );
}

function CatDuoInteraction({ position, onComplete }) {
  const [frameIndex, setFrameIndex] = React.useState(0);
  const frameRafRef = React.useRef(null);
  const startedAtRef = React.useRef(0);
  const completedRef = React.useRef(false);

  usePreloadImages(DUO_INTERACTION_FRAMES);

  React.useEffect(() => {
    startedAtRef.current = performance.now();
    completedRef.current = false;
    setFrameIndex(0);

    function step(now) {
      const elapsed = now - startedAtRef.current;
      const nextFrame = Math.floor(elapsed / DUO_INTERACTION_FRAME_DURATION);

      if (nextFrame >= DUO_INTERACTION_FRAMES.length) {
        setFrameIndex(DUO_INTERACTION_FRAMES.length - 1);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
        return;
      }

      setFrameIndex(nextFrame);
      frameRafRef.current = window.requestAnimationFrame(step);
    }

    frameRafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (frameRafRef.current) {
        window.cancelAnimationFrame(frameRafRef.current);
      }
    };
  }, [onComplete]);

  return (
    <div
      className="cat-duo-interaction"
      aria-label="Calico and snow cat interaction"
      style={{
        "--duo-x": `${position.x}%`,
        "--duo-y": `${position.y}%`,
        "--duo-depth": Math.round(position.y * 10) + 14,
      }}
    >
      <div className="cat-duo-shadow" />
      <img
        className="cat-duo-frame"
        src={DUO_INTERACTION_FRAMES[frameIndex]}
        alt=""
        draggable="false"
      />
    </div>
  );
}

function GardenToy({ toy }) {
  const asset = toyAssets[toy.toyType];
  if (!asset || !toy.isActive || toy.isCaught) return null;
  const action = asset[toy.actionType];
  const isAnimating = toy.state === "dropping" || toy.state === "throwing";
  const frame = action?.frames[toy.frameIndex] || asset.static;

  return (
    <img
      className={`garden-toy garden-toy-${toy.state}`}
      src={isAnimating ? frame : asset.static}
      alt=""
      draggable="false"
      style={{
        left: `${toy.x}%`,
        top: `${toy.y}%`,
        zIndex: Math.round(toy.y * 10) + 8,
      }}
    />
  );
}

function GardenScene({
  flowers,
  currentFlower,
  plantMode,
  selectedToyType,
  selectedToyAction,
  toys,
  catWalking,
  catTarget,
  catAction,
  catToyType,
  catSpawn,
  snowWalking,
  snowTarget,
  snowAction,
  snowToyType,
  snowSpawn,
  duoInteraction,
  onCatTarget,
  onCatTargetReached,
  onCatModeChange,
  onCatActionComplete,
  onCalicoPositionChange,
  onSnowModeChange,
  onSnowActionComplete,
  onSnowTargetReached,
  onSnowPositionChange,
  onDuoInteractionComplete,
  onToyDrop,
  onPlant,
}) {
  function handleGardenClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (selectedToyType && !duoInteraction) {
      if (!isPointOnGarden(x, y)) return;
      onToyDrop({ toyType: selectedToyType, actionType: selectedToyAction, x, y });
      return;
    }

    if (plantMode) {
      if (!isPointOnGarden(x, y)) return;
      onPlant({ x, y });
      return;
    }

    if (!duoInteraction) {
      onCatTarget(clampToGarden(x, y));
    }
  }

  return (
    <section
      className={`garden-stage ${plantMode ? "is-planting" : ""} ${selectedToyType ? "is-toying" : ""}`}
      aria-label="Garden island"
    >
      <div className="sky-glow" />
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="garden-island" onClick={handleGardenClick}>
        <img
          className="garden-asset"
          src="/assets/garden/annas-garden-island.png"
          alt="Garden island"
          draggable="false"
        />
        {permanentGardenFlowers.map((flower) => (
          <img key={flower.src} className={flower.className} src={flower.src} alt="" />
        ))}
        {flowers.map((flower) => (
          <img
            key={flower.id}
            className="planted-flower"
            src={flower.image}
            alt=""
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              width: `${flower.size}px`,
              transform: `translate(-50%, -78%) rotate(${flower.rotation}deg)`,
              zIndex: Math.round(flower.y * 10),
            }}
          />
        ))}
        {toys.map((toy) => (
          <GardenToy key={toy.id} toy={toy} />
        ))}
        <CorgiIdleSprite
          className="garden-corgi"
          ariaLabel="A resting corgi sitting in the garden"
          decorative={false}
        />
        {duoInteraction ? (
          <CatDuoInteraction
            key={duoInteraction.id}
            position={duoInteraction.position}
            onComplete={onDuoInteractionComplete}
          />
        ) : (
          <>
            <CalicoCat
              key={`calico-${catSpawn.version}`}
              initialPosition={catSpawn.position}
              autoWalk={catWalking}
              target={catTarget}
              requestedAction={catAction}
              requestedToyType={catToyType}
              onModeChange={onCatModeChange}
              onTargetReached={onCatTargetReached}
              onActionComplete={onCatActionComplete}
              onPositionChange={onCalicoPositionChange}
            />
            <SnowCat
              key={`snow-${snowSpawn.version}`}
              initialPosition={snowSpawn.position}
              autoWalk={snowWalking}
              target={snowTarget}
              requestedAction={snowAction}
              requestedToyType={snowToyType}
              onModeChange={onSnowModeChange}
              onActionComplete={onSnowActionComplete}
              onTargetReached={onSnowTargetReached}
              onPositionChange={onSnowPositionChange}
            />
          </>
        )}
        {plantMode && (
          <img
            className="plant-preview"
            src={currentFlower}
            alt=""
            style={{ width: 78 }}
          />
        )}
      </div>
      <div className="island-base" />
    </section>
  );
}

function Gallery({ flowers, onSelect, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="gallery-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-heading">
          <h2 id="gallery-title">Flower gallery</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close gallery">
            <Check size={18} aria-hidden="true" />
          </button>
        </div>
        {flowers.length === 0 ? (
          <p className="empty-copy">No planted flowers yet.</p>
        ) : (
          <div className="gallery-grid">
            {flowers.map((flower, index) => (
              <button
                key={flower.id}
                className="gallery-flower"
                type="button"
                onClick={() => onSelect(flower.image)}
                aria-label={`Use planted flower ${index + 1}`}
              >
                <img src={flower.image} alt="" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TemplatePicker({ selectedFlower, onSelect }) {
  return (
    <section className="template-panel" aria-labelledby="template-title">
      <div className="section-heading">
        <h2 id="template-title">Flower templates</h2>
      </div>
      <div className="template-grid">
        {flowerTemplates.map((template) => (
          <button
            key={template.id}
            className={selectedFlower === template.image ? "template-button active" : "template-button"}
            type="button"
            onClick={() => onSelect(template.image)}
            aria-label={`Use ${template.name} template`}
          >
            <img src={template.image} alt="" />
            <span>{template.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ToyPicker({ selectedToyType, selectedToyAction, onSelect, onActionSelect }) {
  return (
    <section className="toy-panel" aria-labelledby="toy-title">
      <div className="section-heading">
        <h2 id="toy-title">Toys</h2>
      </div>
      <div className="toy-grid" role="group" aria-label="Toy selection">
        {toyOptions.map((toy) => (
          <button
            key={toy.toyType}
            className={selectedToyType === toy.toyType ? "toy-button active" : "toy-button"}
            type="button"
            onClick={() => onSelect(toy.toyType)}
            aria-pressed={selectedToyType === toy.toyType}
          >
            <img src={toy.static} alt="" />
            <span>{toy.label}</span>
          </button>
        ))}
      </div>
      <div className="toy-action-row" role="group" aria-label="Toy action">
        {toyActionOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.actionType}
              className={
                selectedToyAction === option.actionType
                  ? "toy-action-button active"
                  : "toy-action-button"
              }
              type="button"
              onClick={() => onActionSelect(option.actionType)}
              aria-pressed={selectedToyAction === option.actionType}
            >
              <Icon size={17} aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getVisibleCatMode(isWalking, action) {
  return isWalking ? "walk" : action;
}

function CatModeControls({ title, currentMode, onSelect, disabled = false }) {
  return (
    <div className="cat-control-group">
      <h3>{title}</h3>
      <div className="cat-control-grid" role="group" aria-label={`${title} animation controls`}>
        {CAT_CONTROL_OPTIONS.map((option) => (
          <button
            key={option.action}
            className={currentMode === option.action ? "cat-control-button active" : "cat-control-button"}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.action)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function OpeningLetter({ onEnterGarden }) {
  const [isVisible, setIsVisible] = React.useState(true);

  function enterGarden() {
    onEnterGarden?.();
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <section className="opening-letter-overlay" aria-label="Opening letter">
      <div className="opening-letter-backdrop" />
      <div className="opening-letter-scene">
        <div className="garden-letter-card" aria-live="polite">
          <img
            className="letter-envelope-back"
            src="/assets/letter/envelope-back.png"
            alt=""
            draggable="false"
          />
          {openingLetter.flowers.map((flower) => (
            <span key={flower.src} className={flower.className} aria-hidden="true">
              <img className="letter-flower-art" src={flower.src} alt="" draggable="false" />
            </span>
          ))}
          <div className="letter-paper-wrap">
            <img
              className="letter-paper"
              src="/assets/letter/letter-paper.png"
              alt=""
              draggable="false"
            />
            <div className="letter-copy">
              <p className="letter-to">To: {openingLetter.to}</p>
              <p>{openingLetter.message}</p>
              <p className="letter-from">- {openingLetter.from}</p>
            </div>
          </div>
          <img
            className="letter-envelope-front"
            src="/assets/letter/envelope-front.png"
            alt=""
            draggable="false"
          />
        </div>
      </div>
      <button className="letter-close" type="button" onClick={enterGarden}>
        Enter garden
      </button>
    </section>
  );
}

function App() {
  const [{ flowers, currentFlower }, setGarden] = usePersistentGarden();
  const [activeColor, setActiveColor] = React.useState(palette[0]);
  const [brushSize, setBrushSize] = React.useState(9);
  const [tool, setTool] = React.useState("brush");
  const [plantMode, setPlantMode] = React.useState(true);
  const [selectedToyType, setSelectedToyType] = React.useState(null);
  const [selectedToyAction, setSelectedToyAction] = React.useState("drop");
  const [toys, setToys] = React.useState([]);
  const [catSpawn, setCatSpawn] = React.useState({
    position: CAT_WAYPOINTS[0],
    version: 0,
  });
  const [catWalking, setCatWalking] = React.useState(false);
  const [catTarget, setCatTarget] = React.useState(null);
  const [catAction, setCatAction] = React.useState("idle");
  const [catToyType, setCatToyType] = React.useState(null);
  const [snowSpawn, setSnowSpawn] = React.useState({
    position: SNOW_WAYPOINTS[0],
    version: 0,
  });
  const [snowWalking, setSnowWalking] = React.useState(false);
  const [snowTarget, setSnowTarget] = React.useState(null);
  const [snowAction, setSnowAction] = React.useState("idle");
  const [snowToyType, setSnowToyType] = React.useState(null);
  const [duoInteraction, setDuoInteraction] = React.useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = React.useState(false);
  const [showGallery, setShowGallery] = React.useState(false);
  const [undoSignal, setUndoSignal] = React.useState(0);
  const [clearSignal, setClearSignal] = React.useState(0);
  const calicoPositionRef = React.useRef(CAT_WAYPOINTS[0]);
  const snowPositionRef = React.useRef(SNOW_WAYPOINTS[0]);
  const duoInteractionRef = React.useRef(null);
  const toysRef = React.useRef([]);
  const caughtToyIdsRef = React.useRef(new Set());
  const duoCanTriggerRef = React.useRef(true);
  const duoCooldownUntilRef = React.useRef(0);
  const backgroundAudioRef = React.useRef(null);
  const toyPreloadSources = React.useMemo(
    () =>
      Object.values(toyAssets).flatMap((asset) => [
        asset.static,
        ...asset.drop.frames,
        ...asset.throw.frames,
      ]),
    []
  );

  usePreloadImages(toyPreloadSources);

  React.useEffect(() => {
    duoInteractionRef.current = duoInteraction;
  }, [duoInteraction]);

  React.useEffect(() => {
    toysRef.current = toys;
  }, [toys]);

  const completeCatAction = React.useCallback(() => {
    setCatAction("idle");
    setCatToyType(null);
  }, []);

  const startBackgroundAudio = React.useCallback(() => {
    const audio = backgroundAudioRef.current;
    if (!audio) return;

    audio.volume = 0.42;
    audio.loop = true;
    void audio
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => {
        // Browsers may still block audio in unusual permission states.
        setIsMusicPlaying(false);
      });
  }, []);

  const stopBackgroundAudio = React.useCallback(() => {
    const audio = backgroundAudioRef.current;
    if (!audio) return;

    audio.pause();
    setIsMusicPlaying(false);
  }, []);

  const toggleBackgroundAudio = React.useCallback(() => {
    if (isMusicPlaying) {
      stopBackgroundAudio();
      return;
    }

    startBackgroundAudio();
  }, [isMusicPlaying, startBackgroundAudio, stopBackgroundAudio]);

  const completeSnowAction = React.useCallback(() => {
    setSnowAction("idle");
    setSnowToyType(null);
  }, []);

  const updateCalicoPosition = React.useCallback((position) => {
    calicoPositionRef.current = position;
  }, []);

  const updateSnowPosition = React.useCallback((position) => {
    snowPositionRef.current = position;
  }, []);

  React.useEffect(() => {
    let rafId;

    function tick(now) {
      setToys((currentToys) => {
        let didChange = false;
        const nextToys = currentToys.map((toy) => {
          if (!toy.isActive || toy.isCaught || (toy.state !== "dropping" && toy.state !== "throwing")) {
            return toy;
          }

          const action = toyAssets[toy.toyType]?.[toy.actionType];
          if (!action) return toy;

          const elapsed = Math.max(now - toy.spawnedAt, 0);
          const progress = Math.min(elapsed / action.durationMs, 1);
          const frameIndex = Math.min(
            action.frames.length - 1,
            Math.floor(progress * action.frames.length)
          );
          let x = toy.targetX;
          let y = toy.targetY;

          if (toy.actionType === "throw") {
            x = lerp(toy.startX, toy.targetX, easeInOut(progress));
            y =
              lerp(toy.startY, toy.targetY, easeInOut(progress)) -
              Math.sin(progress * Math.PI) * 10;
          }

          const state = progress >= 1 ? "settled" : toy.state;
          const settledAt = progress >= 1 ? toy.settledAt || now : toy.settledAt;
          const nextToy = {
            ...toy,
            x,
            y,
            frameIndex,
            state,
            settledAt,
            velocityX: toy.actionType === "throw" ? toy.velocityX : 0,
            velocityY: toy.actionType === "throw" ? toy.velocityY : 0,
          };

          if (
            nextToy.x !== toy.x ||
            nextToy.y !== toy.y ||
            nextToy.frameIndex !== toy.frameIndex ||
            nextToy.state !== toy.state ||
            nextToy.settledAt !== toy.settledAt
          ) {
            didChange = true;
            return nextToy;
          }

          return toy;
        });

        return didChange ? nextToys : currentToys;
      });

      rafId = window.requestAnimationFrame(tick);
    }

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const setCalicoMode = React.useCallback((mode) => {
    setCatTarget(null);
    setCatToyType(null);

    if (mode === "walk") {
      setCatAction("idle");
      setCatWalking(true);
      return;
    }

    setCatWalking(false);
    setCatAction(mode);
  }, []);

  const setSnowMode = React.useCallback((mode) => {
    setSnowTarget(null);
    setSnowToyType(null);

    if (mode === "walk") {
      setSnowAction("idle");
      setSnowWalking(true);
      return;
    }

    setSnowWalking(false);
    setSnowAction(mode);
  }, []);

  const moveCatToTarget = React.useCallback((target) => {
    setCatWalking(false);
    setCatAction("idle");
    setCatToyType(null);
    setCatTarget({ ...target, id: crypto.randomUUID() });
  }, []);

  const clearCatTarget = React.useCallback(() => {
    setCatTarget(null);
  }, []);

  const clearSnowTarget = React.useCallback(() => {
    setSnowTarget(null);
  }, []);

  const assignToyToCat = React.useCallback(
    (toy) => {
      if (!toy || duoInteractionRef.current || toy.targetedByCatId) return;

      const candidates = [
        {
          catId: CAT_IDS.calico,
          position: calicoPositionRef.current,
          isAvailable: !catTarget && !CAT_ONE_SHOT_ACTIONS.has(catAction),
          chase: () => {
            setCatWalking(false);
            setCatToyType(null);
            setCatAction("jumping");
            setCatTarget({ x: toy.targetX, y: toy.targetY, id: toy.id, motion: "jump" });
          },
        },
        {
          catId: CAT_IDS.snow,
          position: snowPositionRef.current,
          isAvailable: !snowTarget && !CAT_ONE_SHOT_ACTIONS.has(snowAction),
          chase: () => {
            setSnowWalking(false);
            setSnowToyType(null);
            setSnowAction("jumping");
            setSnowTarget({ x: toy.targetX, y: toy.targetY, id: toy.id, motion: "jump" });
          },
        },
      ].filter((candidate) => candidate.isAvailable);

      if (candidates.length === 0) return;

      const target = candidates.reduce((closest, candidate) => {
        const distance = distanceBetweenPoints(candidate.position, toy);
        return distance < closest.distance ? { ...candidate, distance } : closest;
      }, { distance: Infinity });

      setToys((currentToys) =>
        currentToys.map((currentToy) =>
          currentToy.id === toy.id
            ? { ...currentToy, targetedByCatId: target.catId }
            : currentToy
        )
      );
      target.chase();
    },
    [catAction, catTarget, snowAction, snowTarget]
  );

  React.useEffect(() => {
    if (duoInteraction) return;

    const settledToy = toys.find(
      (toy) =>
        toy.isActive &&
        !toy.isCaught &&
        toy.state === "settled" &&
        !toy.targetedByCatId
    );

    if (settledToy) {
      assignToyToCat(settledToy);
    }
  }, [assignToyToCat, duoInteraction, toys]);

  const cycleCatMode = React.useCallback(() => {
    const currentMode = catWalking ? "walk" : catAction;
    const currentIndex = CAT_TAP_MODES.indexOf(currentMode);
    const nextMode = CAT_TAP_MODES[(currentIndex + 1) % CAT_TAP_MODES.length];

    setCalicoMode(nextMode);
  }, [catAction, catWalking, setCalicoMode]);

  const cycleSnowMode = React.useCallback(() => {
    const currentMode = getVisibleCatMode(snowWalking, snowAction);
    const currentIndex = CAT_TAP_MODES.indexOf(currentMode);
    const nextMode = CAT_TAP_MODES[(currentIndex + 1) % CAT_TAP_MODES.length];

    setSnowMode(nextMode);
  }, [snowAction, snowWalking, setSnowMode]);

  const completeDuoInteraction = React.useCallback(() => {
    const interaction = duoInteractionRef.current;
    if (!interaction) return;

    const calicoPosition = nudgeGardenPoint(interaction.position, -CAT_RESTORE_SPACING, 1);
    const snowPosition = nudgeGardenPoint(interaction.position, CAT_RESTORE_SPACING, 1);

    calicoPositionRef.current = calicoPosition;
    snowPositionRef.current = snowPosition;
    duoCanTriggerRef.current = false;
    duoCooldownUntilRef.current = performance.now() + CAT_INTERACTION_COOLDOWN_MS;
    setCatTarget(null);
    setCatSpawn((spawn) => ({
      position: calicoPosition,
      version: spawn.version + 1,
    }));
    setSnowSpawn((spawn) => ({
      position: snowPosition,
      version: spawn.version + 1,
    }));
    setDuoInteraction(null);
  }, []);

  React.useEffect(() => {
    if (duoInteraction) return undefined;

    let rafId;

    function tick(now) {
      const calicoPosition = calicoPositionRef.current;
      const snowPosition = snowPositionRef.current;
      const distance = distanceBetweenPoints(calicoPosition, snowPosition);

      if (distance > CAT_COLLISION_REARM_DISTANCE) {
        duoCanTriggerRef.current = true;
      }

      const canInterruptActions =
        !CAT_ONE_SHOT_ACTIONS.has(catAction) && !CAT_ONE_SHOT_ACTIONS.has(snowAction);

      if (
        duoCanTriggerRef.current &&
        canInterruptActions &&
        now >= duoCooldownUntilRef.current &&
        distance <= CAT_COLLISION_DISTANCE
      ) {
        const midpoint = getMidpoint(calicoPosition, snowPosition);
        const position = isPointOnGarden(midpoint.x, midpoint.y)
          ? midpoint
          : clampToGarden(midpoint.x, midpoint.y);

        duoCanTriggerRef.current = false;
        setCatTarget(null);
        setSnowTarget(null);
        setToys((currentToys) =>
          currentToys.map((toy) =>
            toy.isActive ? { ...toy, isActive: false, isCaught: true } : toy
          )
        );
        setDuoInteraction({
          id: crypto.randomUUID(),
          position,
        });
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    }

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [catAction, duoInteraction, snowAction]);

  React.useEffect(() => {
    if (duoInteraction) return undefined;

    let rafId;

    function catchToy(toy) {
      if (caughtToyIdsRef.current.has(toy.id)) return;
      caughtToyIdsRef.current.add(toy.id);

      setToys((currentToys) =>
        currentToys.map((currentToy) =>
          currentToy.id === toy.id
            ? {
                ...currentToy,
                state: "caught",
                isActive: false,
                isCaught: true,
                velocityX: 0,
                velocityY: 0,
              }
            : currentToy
        )
      );

      if (toy.targetedByCatId === CAT_IDS.snow) {
        setSnowWalking(false);
        setSnowTarget(null);
        setSnowToyType(toy.toyType);
        setSnowAction("rolling_over_with_toy");
        return;
      }

      setCatWalking(false);
      setCatTarget(null);
      setCatToyType(toy.toyType);
      setCatAction("rolling_over_with_toy");
    }

    function tick() {
      const activeToy = toysRef.current.find(
        (toy) => toy.isActive && !toy.isCaught && toy.state === "settled" && toy.targetedByCatId
      );

      if (activeToy) {
        const catPosition =
          activeToy.targetedByCatId === CAT_IDS.snow
            ? snowPositionRef.current
            : calicoPositionRef.current;
        const distance = distanceBetweenPoints(catPosition, activeToy);

        if (distance <= TOY_CATCH_DISTANCE) {
          catchToy(activeToy);
        }
      }

      rafId = window.requestAnimationFrame(tick);
    }

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [duoInteraction]);

  function saveFlower(image) {
    setGarden((garden) => ({ ...garden, currentFlower: image }));
    setPlantMode(true);
    setSelectedToyType(null);
  }

  function plantFlower({ x, y }) {
    const flower = {
      id: crypto.randomUUID(),
      image: currentFlower,
      x,
      y,
      size: Math.round(54 + Math.random() * 36),
      rotation: Math.round(-9 + Math.random() * 18),
    };
    setGarden((garden) => ({ ...garden, flowers: [...garden.flowers, flower] }));
  }

  function resetGarden() {
    setGarden((garden) => ({ ...garden, flowers: [] }));
    setToys([]);
    caughtToyIdsRef.current.clear();
  }

  function selectTemplate(image) {
    setGarden((garden) => ({ ...garden, currentFlower: image }));
    setPlantMode(true);
    setSelectedToyType(null);
  }

  function selectToy(toyType) {
    setSelectedToyType(toyType);
    setPlantMode(true);
  }

  function dropToy({ toyType, actionType, x, y }) {
    if (duoInteractionRef.current) return;

    const point = clampToGarden(x, y);
    const startPoint =
      actionType === "throw"
        ? clampToGarden(point.x - 18, point.y + 9)
        : point;
    const now = performance.now();
    const duration = toyAssets[toyType]?.[actionType]?.durationMs || TOY_DROP_DURATION_MS;
    const toy = {
      id: crypto.randomUUID(),
      toyType,
      actionType,
      state: actionType === "throw" ? "throwing" : "dropping",
      x: startPoint.x,
      y: startPoint.y,
      startX: startPoint.x,
      startY: startPoint.y,
      targetX: point.x,
      targetY: point.y,
      velocityX: (point.x - startPoint.x) / duration,
      velocityY: (point.y - startPoint.y) / duration,
      frameIndex: 0,
      spawnedAt: now,
      settledAt: null,
      isActive: true,
      isCaught: false,
      targetedByCatId: null,
    };

    caughtToyIdsRef.current.delete(toy.id);
    setToys((currentToys) => [
      ...currentToys.filter((currentToy) => currentToy.isActive && !currentToy.isCaught).slice(-2),
      toy,
    ]);
    setDuoInteraction(null);
  }

  return (
    <main className="app-shell">
      <GardenScene
        flowers={flowers}
        currentFlower={currentFlower}
        plantMode={plantMode}
        selectedToyType={selectedToyType}
        selectedToyAction={selectedToyAction}
        toys={toys}
        catSpawn={catSpawn}
        catWalking={catWalking}
        catTarget={catTarget}
        catAction={catAction}
        catToyType={catToyType}
        snowSpawn={snowSpawn}
        snowWalking={snowWalking}
        snowTarget={snowTarget}
        snowAction={snowAction}
        snowToyType={snowToyType}
        duoInteraction={duoInteraction}
        onCatTarget={moveCatToTarget}
        onCatTargetReached={clearCatTarget}
        onCatModeChange={cycleCatMode}
        onCatActionComplete={completeCatAction}
        onCalicoPositionChange={updateCalicoPosition}
        onSnowModeChange={cycleSnowMode}
        onSnowActionComplete={completeSnowAction}
        onSnowTargetReached={clearSnowTarget}
        onSnowPositionChange={updateSnowPosition}
        onDuoInteractionComplete={completeDuoInteraction}
        onToyDrop={dropToy}
        onPlant={plantFlower}
      />

      <aside className="tool-panel" aria-label="Garden controls">
        <div className="brand-row">
          <div>
            <p className="eyebrow">Bomi Garden</p>
            <h1>Bomi's Secret Garden</h1>
          </div>
          <button className="icon-button" type="button" onClick={resetGarden} aria-label="Reset garden">
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mode-row" role="group" aria-label="Mode">
          <button
            className={plantMode ? "mode-button active" : "mode-button"}
            type="button"
            onClick={() => {
              setPlantMode(true);
              setSelectedToyType(null);
            }}
          >
            <MousePointer2 size={17} aria-hidden="true" />
            Plant
          </button>
          <button
            className={!plantMode ? "mode-button active" : "mode-button"}
            type="button"
            onClick={() => {
              setPlantMode(false);
              setSelectedToyType(null);
            }}
          >
            <Brush size={17} aria-hidden="true" />
            Draw
          </button>
        </div>

        {!plantMode && (
          <div className="draw-tools">
            <DrawingPad
              selectedColor={activeColor}
              brushSize={brushSize}
              tool={tool}
              onSave={saveFlower}
              undoSignal={undoSignal}
              clearSignal={clearSignal}
            />

            <div className="toolbar" role="group" aria-label="Drawing tools">
              <button
                className={tool === "brush" ? "icon-button active" : "icon-button"}
                type="button"
                onClick={() => setTool("brush")}
                aria-label="Brush"
                title="Brush"
              >
                <Brush size={18} aria-hidden="true" />
              </button>
              <button
                className={tool === "erase" ? "icon-button active" : "icon-button"}
                type="button"
                onClick={() => setTool("erase")}
                aria-label="Eraser"
                title="Eraser"
              >
                <Eraser size={18} aria-hidden="true" />
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={() => setUndoSignal((value) => value + 1)}
                aria-label="Undo"
                title="Undo"
              >
                <Undo2 size={18} aria-hidden="true" />
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={() => setClearSignal((value) => value + 1)}
                aria-label="Clear drawing"
                title="Clear"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="palette" aria-label="Flower colors">
              {palette.map((color) => (
                <button
                  key={color}
                  className={activeColor === color ? "swatch active" : "swatch"}
                  type="button"
                  onClick={() => {
                    setActiveColor(color);
                    setTool("brush");
                  }}
                  style={{ backgroundColor: color }}
                  aria-label={`Use ${color}`}
                />
              ))}
            </div>

            <label className="slider-row">
              <span>Brush</span>
              <input
                type="range"
                min="3"
                max="22"
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
              />
              <output>{brushSize}</output>
            </label>
          </div>
        )}

        {plantMode && (
          <div className="plant-card">
            <img src={selectedToyType ? toyAssets[selectedToyType].static : currentFlower} alt="" />
            <p>
              {selectedToyType
                ? `Click the island to ${selectedToyAction} the ${toyAssets[selectedToyType].label.toLowerCase()}.`
                : "Click the island to plant the selected flower."}
            </p>
            <button
              className="primary-action"
              type="button"
              onClick={() => {
                setPlantMode(false);
                setSelectedToyType(null);
              }}
            >
              <Flower2 size={18} aria-hidden="true" />
              Draw a flower
            </button>
          </div>
        )}

        <TemplatePicker selectedFlower={currentFlower} onSelect={selectTemplate} />

        <ToyPicker
          selectedToyType={selectedToyType}
          selectedToyAction={selectedToyAction}
          onSelect={selectToy}
          onActionSelect={setSelectedToyAction}
        />

        <section className="cat-controls" aria-labelledby="cat-controls-title">
          <div className="section-heading">
            <h2 id="cat-controls-title">Cats</h2>
          </div>
          <CatModeControls
            title="Bomi"
            currentMode={getVisibleCatMode(catWalking, catAction)}
            onSelect={setCalicoMode}
            disabled={Boolean(duoInteraction)}
          />
          <CatModeControls
            title="Snow"
            currentMode={getVisibleCatMode(snowWalking, snowAction)}
            onSelect={setSnowMode}
            disabled={Boolean(duoInteraction)}
          />
        </section>

        <div className="utility-row">
          <button
            className="ghost-button"
            type="button"
            onClick={toggleBackgroundAudio}
            aria-pressed={isMusicPlaying}
            aria-label={isMusicPlaying ? "Turn music off" : "Turn music on"}
            title={isMusicPlaying ? "Turn music off" : "Turn music on"}
          >
            {isMusicPlaying ? (
              <Volume2 size={17} aria-hidden="true" />
            ) : (
              <VolumeX size={17} aria-hidden="true" />
            )}
            Music
          </button>
          <button className="ghost-button" type="button" onClick={() => setShowGallery(true)}>
            <ImageIcon size={17} aria-hidden="true" />
            Gallery
          </button>
        </div>

        <div className="status-row" aria-live="polite">
          <Cat size={17} aria-hidden="true" />
          {flowers.length} {flowers.length === 1 ? "flower" : "flowers"} planted
        </div>
      </aside>

      {showGallery && (
        <Gallery
          flowers={flowers}
          onSelect={(image) => {
            setGarden((garden) => ({ ...garden, currentFlower: image }));
            setShowGallery(false);
            setPlantMode(true);
          }}
          onClose={() => setShowGallery(false)}
        />
      )}
      <audio ref={backgroundAudioRef} src={BACKGROUND_AUDIO_SRC} preload="auto" loop />
      <OpeningLetter onEnterGarden={startBackgroundAudio} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
