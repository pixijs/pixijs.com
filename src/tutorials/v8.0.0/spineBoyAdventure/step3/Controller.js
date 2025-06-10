// Map keyboard key codes to controller's state keys
const keyMap = {
  Space: 'space',
  KeyW: 'up',
  ArrowUp: 'up',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyD: 'right',
  ArrowRight: 'right',
};

// Class for handling keyboard inputs.
export class Controller {
  constructor() {
    // The controller's state.
    this.keys = {
      up: { pressed: false, doubleTap: false, timestamp: 0 },
      left: { pressed: false, doubleTap: false, timestamp: 0 },
      down: { pressed: false, doubleTap: false, timestamp: 0 },
      right: { pressed: false, doubleTap: false, timestamp: 0 },
      space: { pressed: false, doubleTap: false, timestamp: 0 },
    };

    // Register event listeners for keydown and keyup events.
    window.addEventListener('keydown', (event) => this.keydownHandler(event));
    window.addEventListener('keyup', (event) => this.keyupHandler(event));
  }

  keydownHandler(event) {
    /** -- INSERT CODE HERE -- */
  }

  keyupHandler(event) {
    /** -- INSERT CODE HERE -- */
  }
}
