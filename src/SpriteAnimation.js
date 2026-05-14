import React from "react";

export function getSpriteFrameIndex(frameIndex, frameCount, loop = true) {
  if (frameCount <= 0) return 0;
  if (loop) return ((frameIndex % frameCount) + frameCount) % frameCount;
  return Math.max(0, Math.min(frameIndex, frameCount - 1));
}

export function getSpriteBackgroundPosition(frameIndex, frameWidth, frameHeight, columns) {
  const col = frameIndex % columns;
  const row = Math.floor(frameIndex / columns);

  return `${-col * frameWidth}px ${-row * frameHeight}px`;
}

export function getSpriteFrameFromElapsed(elapsedMs, fps, frameCount, loop = true) {
  const frameDurationMs = fps > 0 ? 1000 / fps : 1000;
  const rawFrame = Math.floor(Math.max(elapsedMs, 0) / frameDurationMs);

  return getSpriteFrameIndex(rawFrame, frameCount, loop);
}

export function getSpriteAnimationStyle({
  src,
  frameIndex,
  frameWidth,
  frameHeight,
  frameCount,
  columns,
  rows = Math.ceil(frameCount / columns),
  loop = true,
}) {
  const visibleFrame = getSpriteFrameIndex(frameIndex, frameCount, loop);

  return {
    width: `${frameWidth}px`,
    height: `${frameHeight}px`,
    backgroundImage: `url("${src}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${columns * frameWidth}px ${rows * frameHeight}px`,
    backgroundPosition: getSpriteBackgroundPosition(
      visibleFrame,
      frameWidth,
      frameHeight,
      columns
    ),
  };
}

export function SpriteAnimation({
  src,
  frameWidth,
  frameHeight,
  frameCount,
  columns,
  rows = Math.ceil(frameCount / columns),
  fps = 2,
  loop = true,
  playing = true,
  className = "",
  animationName = "idle",
  ariaLabel,
  decorative = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFrameChange,
  style,
}) {
  const [frameIndex, setFrameIndex] = React.useState(0);
  const startedAtRef = React.useRef(0);
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    if (!playing) return undefined;

    startedAtRef.current = performance.now();
    setFrameIndex(0);

    function step(now) {
      const nextFrame = getSpriteFrameFromElapsed(
        now - startedAtRef.current,
        fps,
        frameCount,
        loop
      );

      setFrameIndex((currentFrame) => {
        if (currentFrame !== nextFrame) {
          onFrameChange?.(nextFrame);
        }

        return nextFrame;
      });

      if (loop || nextFrame < frameCount - 1) {
        rafRef.current = window.requestAnimationFrame(step);
      }
    }

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [fps, frameCount, loop, onFrameChange, playing]);

  const spriteStyle = getSpriteAnimationStyle({
    src,
    frameIndex,
    frameWidth,
    frameHeight,
    frameCount,
    columns,
    rows,
    loop,
  });
  const accessibilityProps = decorative
    ? { "aria-hidden": "true" }
    : { role: "img", "aria-label": ariaLabel || `${animationName} animation` };

  return React.createElement("div", {
    className: `sprite-animation ${className}`.trim(),
    style: {
      ...spriteStyle,
      ...style,
    },
    onClick,
    onMouseEnter,
    onMouseLeave,
    "data-animation-fps": fps,
    "data-animation-name": animationName,
    ...accessibilityProps,
  });
}

export function CorgiIdleSprite({
  src = "/assets/corgi_idle_sprite_pack/spritesheets/corgi_idle_sheet_5x2_320x448.png",
  frameWidth = 320,
  frameHeight = 448,
  frameCount = 10,
  columns = 5,
  rows = 2,
  fps = 2,
  loop = true,
  playing = true,
  className = "",
  ariaLabel = "Resting corgi idle animation",
  ...props
}) {
  return React.createElement(SpriteAnimation, {
    ...props,
    src,
    frameWidth,
    frameHeight,
    frameCount,
    columns,
    rows,
    fps,
    loop,
    playing,
    className: `corgi-idle-sprite ${className}`.trim(),
    animationName: "idle",
    ariaLabel,
  });
}
