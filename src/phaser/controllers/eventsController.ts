import { Scene } from 'phaser';

let scene: Scene;

interface eventsControllerInterface {
  init: (sceneObj: Scene) => void;
  onGameOut: (any) => void; // once cursor is out of game screen
  onFocus: (any) => void;
  onLostFocus: (any) => void;
  onHidden: (any) => void;
  onVisible: (any) => void;
  onResume: (any) => void;
}

const init = (sceneObj: Scene): void => {
  scene = sceneObj;
};

const onGameOut = (callback): void => {
  scene.input.on('gameout', () => callback());
};

const onFocus = (callback): void => {
  scene.game.events.on(Phaser.Core.Events.FOCUS, () => callback());
};

const onLostFocus = (callback): void => {
  scene.game.events.on(Phaser.Core.Events.BLUR, () => callback());
};

const onHidden = (callback): void => {
  scene.game.events.on(Phaser.Core.Events.HIDDEN, () => callback());
};

const onVisible = (callback): void => {
  scene.game.events.on(Phaser.Core.Events.VISIBLE, () => callback());
};

const onResume = (callback): void => {
  scene.game.events.on(Phaser.Core.Events.RESUME, () => callback());
};

export const EventsController: eventsControllerInterface = {
  init,
  onGameOut,
  onFocus,
  onLostFocus,
  onHidden,
  onVisible,
  onResume
};