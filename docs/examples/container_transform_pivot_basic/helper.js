import { Assets, DOMContainer, Graphics, Text } from 'pixi.js';
import { Pane } from 'tweakpane';

function drawArrow(arrow, startX, startY, endX, endY, inverted = false) {
  arrow.clear();

  // Calculate control point for quadratic curve
  const controlX = endX / 1.5111;
  const controlY = endY;

  // Draw the curved line
  arrow.moveTo(startX, startY);
  if (inverted) {
    arrow.quadraticCurveTo(controlX * 2, controlY, endX, endY);
  } else {
    arrow.quadraticCurveTo(controlX, controlY, endX, endY);
  }
  arrow.stroke({ width: 4, color: 0xffffff, cap: 'round' });

  // Draw arrowhead
  const arrowSize = 16;
  const angle = inverted
    ? Math.atan2(endY - controlY, endX - controlX) + Math.PI
    : Math.atan2(endY - controlY, endX - controlX);

  arrow.moveTo(endX, endY);
  arrow.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
  arrow.moveTo(endX, endY);
  arrow.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
  arrow.stroke({ width: 4, color: 0xffffff, cap: 'round' });
}

export async function setup(app, container) {
  await Assets.load(['http://localhost:3000/examples/assets/fonts/sono.ttf']);

  const pane = new Pane({ title: 'Container Pivot' });
  pane.addBinding(container.pivot, 'x', {
    min: -container.width,
    max: container.width,
    step: 1,
  });
  pane.addBinding(container.pivot, 'y', {
    min: -container.height,
    max: container.height,
    step: 1,
  });

  // Create a DOM container
  pane.element.style.minWidth = '250px';
  const domContainer = new DOMContainer({
    element: pane.element,
    x: app.screen.width / 2,
    y: app.screen.height / 2 + container.height + 50,
    anchor: 0.5,
  });
  app.stage.addChild(domContainer);

  const overallDesc = new Text({
    text:
      'The pivot point is the point around which a container rotates, scales, and skews.\n' +
      'Note: Setting the pivot will also affect the position of the container.\n',
    style: {
      fontFamily: 'Sono',
      fontSize: 16,
      fill: '#ffffff',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: app.screen.width - 40,
    },
    anchor: { x: 0.5, y: 0 },
    position: { x: app.screen.width / 2, y: app.screen.height / 2 - 150 },
  });
  app.stage.addChild(overallDesc);

  const positionText = new Text({
    text: `x,y`,
    style: {
      fontFamily: 'Sono',
      fontSize: 20,
      fill: '#ffffff',
      align: 'center',
    },
    anchor: { x: 0.5, y: 0 },
    position: { x: app.screen.width / 2 - 100, y: app.screen.height / 2 + 75 },
  });
  app.stage.addChild(positionText);

  // Draw an arrow from the positionText to the container position using a nice curve
  const arrow = new Graphics();
  app.stage.addChild(arrow);

  const pivotText = new Text({
    text: `pivot`,
    style: {
      fontFamily: 'Sono',
      fontSize: 20,
      fill: '#ffffff',
      align: 'center',
    },
    anchor: { x: 0.5, y: 0 },
    position: { x: app.screen.width / 2 + container.pivot.x, y: app.screen.height / 2 + container.pivot.y + 25 },
  });
  app.stage.addChild(pivotText);

  // Draw an arrow from the pivotText to the container pivot point using a nice curve
  const pivotArrow = new Graphics();
  app.stage.addChild(pivotArrow);

  // Update arrow when container moves
  container.onRender = () => {
    const startX = positionText.x;
    const startY = positionText.y;
    const endX = container.x;
    const endY = container.y;

    drawArrow(arrow, startX, startY, endX, endY);

    const pivotStartX = pivotText.x;
    const pivotStartY = pivotText.y;
    const pivotEndX = container.x + container.pivot.x;
    const pivotEndY = container.y + container.pivot.y;

    drawArrow(pivotArrow, pivotStartX, pivotStartY, pivotEndX, pivotEndY, true);
  };

  // setup responsive resizing
  app.renderer.on('resize', () => {
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    domContainer.position.set(app.screen.width / 2, app.screen.height / 2 + container.height + 50);
    overallDesc.position.set(app.screen.width / 2, app.screen.height / 2 - 150);
  });
}
