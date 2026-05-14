import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CorgiIdleSprite,
  CorgiWalkSprite,
  SpriteAnimation,
  getSpriteAnimationStyle,
  getSpriteBackgroundPosition,
  getSpriteFrameFromElapsed,
  getSpriteFrameIndex,
} from "./SpriteAnimation.js";

test("SpriteAnimation renders an accessible background sprite", () => {
  const html = renderToStaticMarkup(
    React.createElement(SpriteAnimation, {
      src: "/assets/corgi_idle_sprite_pack/spritesheets/corgi_idle_sheet_5x2_320x448.png",
      frameWidth: 320,
      frameHeight: 448,
      frameCount: 10,
      columns: 5,
      rows: 2,
      fps: 8,
      loop: true,
      playing: false,
      ariaLabel: "A resting corgi",
      className: "test-sprite",
    })
  );

  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="A resting corgi"/);
  assert.match(html, /class="sprite-animation test-sprite"/);
  assert.match(html, /background-position:0px 0px/);
  assert.match(html, /background-size:1600px 896px/);
});

test("sprite frame helpers calculate sheet positions left-to-right, row by row", () => {
  assert.equal(getSpriteBackgroundPosition(0, 320, 448, 5), "0px 0px");
  assert.equal(getSpriteBackgroundPosition(4, 320, 448, 5), "-1280px 0px");
  assert.equal(getSpriteBackgroundPosition(5, 320, 448, 5), "0px -448px");
  assert.equal(getSpriteBackgroundPosition(9, 320, 448, 5), "-1280px -448px");
  assert.equal(getSpriteBackgroundPosition(9, 416, 352, 5), "-1664px -352px");
});

test("sprite frame helpers advance at fps and loop correctly", () => {
  assert.equal(getSpriteFrameFromElapsed(0, 8, 10, true), 0);
  assert.equal(getSpriteFrameFromElapsed(124, 8, 10, true), 0);
  assert.equal(getSpriteFrameFromElapsed(125, 8, 10, true), 1);
  assert.equal(getSpriteFrameFromElapsed(1125, 8, 10, true), 9);
  assert.equal(getSpriteFrameFromElapsed(1250, 8, 10, true), 0);
  assert.equal(getSpriteFrameFromElapsed(5000, 8, 10, false), 9);
  assert.equal(getSpriteFrameIndex(11, 10, true), 1);
  assert.equal(getSpriteFrameIndex(11, 10, false), 9);
});

test("CorgiIdleSprite uses idle defaults and accepts interaction callbacks", () => {
  const handleClick = () => {};
  const handleHover = () => {};
  const html = renderToStaticMarkup(
    React.createElement(CorgiIdleSprite, {
      playing: false,
      className: "garden-corgi",
      onClick: handleClick,
      onMouseEnter: handleHover,
      onMouseLeave: handleHover,
    })
  );
  const style = getSpriteAnimationStyle({
    src: "/assets/corgi_idle_sprite_pack/spritesheets/corgi_idle_sheet_5x2_320x448.png",
    frameIndex: 9,
    frameWidth: 320,
    frameHeight: 448,
    frameCount: 10,
    columns: 5,
    rows: 2,
  });

  assert.match(html, /class="sprite-animation corgi-idle-sprite garden-corgi"/);
  assert.match(html, /aria-label="Resting corgi idle animation"/);
  assert.match(html, /data-animation-fps="2"/);
  assert.match(html, /data-animation-name="idle"/);
  assert.equal(style.backgroundPosition, "-1280px -448px");
});

test("CorgiWalkSprite uses walk spritesheet defaults and accepts direction, speed, and callbacks", () => {
  const handleClick = () => {};
  const handleHover = () => {};
  const html = renderToStaticMarkup(
    React.createElement(CorgiWalkSprite, {
      playing: false,
      className: "garden-corgi-walker",
      direction: "left",
      speed: 1.5,
      onClick: handleClick,
      onMouseEnter: handleHover,
      onMouseLeave: handleHover,
    })
  );
  const style = getSpriteAnimationStyle({
    src: "/assets/corgi_walk_sprite_pack/spritesheets/corgi_walk_sheet_5x2_416x352.png",
    frameIndex: 9,
    frameWidth: 416,
    frameHeight: 352,
    frameCount: 10,
    columns: 5,
    rows: 2,
  });

  assert.match(html, /class="sprite-animation corgi-walk-sprite garden-corgi-walker"/);
  assert.match(html, /aria-label="Walking corgi animation"/);
  assert.match(html, /data-animation-fps="8"/);
  assert.match(html, /data-animation-name="walk"/);
  assert.match(html, /data-direction="left"/);
  assert.match(html, /data-speed="1.5"/);
  assert.match(html, /--sprite-direction:-1/);
  assert.match(html, /--sprite-speed:1.5/);
  assert.equal(style.backgroundPosition, "-1664px -352px");
});
