/**
 * The pane: a row for each value the lesson sets, written into a plain pose that `index.ts` writes into the letter
 * and the door after every change
 */

/** Every value the lesson sets, as plain numbers the pane writes */

/** Builds the pane and returns the letter's folder, for `index.ts` to add the `rotation.y` row to */
export function createControls({ pane, pose, start, apply }) {
  // A refresh writes each row's value back and fires its change; those aren't the reader's.
  let refreshing = false;

  function changed() {
    if (!refreshing) apply();
  }

  /** A turn row also makes its turn the one written last, and the `turn in use` row shows it */
  function turnWith(turnBy) {
    if (refreshing) return;
    pose.turnBy = turnBy;
    refresh(turnInUse);
    apply();
  }

  function refresh(row) {
    refreshing = true;
    row.refresh();
    refreshing = false;
  }

  const letter = pane.addFolder({ title: 'letter' });

  // Short of the door on x and z, so even a stretched, turned letter never reaches its frame or swing.
  letter
    .addBinding(pose, 'position', {
      x: { min: -2, max: 1 },
      y: { min: 1, max: 3 },
      z: { min: -0.5, max: 1.5 },
    })
    .on('change', changed);
  letter
    .addBinding(pose.angle, 'y', {
      label: 'angle.y',
      min: -180,
      max: 180,
      format: whole,
    })
    .on('change', () => turnWith('angle'));

  const turnInUse = letter
    .addBinding(pose, 'turnBy', {
      label: 'turn in use',
      options: { angle: 'angle', quaternion: 'quaternion' },
    })
    .on('change', changed);

  letter
    .addBinding(pose, 'scale', {
      x: { min: 0.4, max: 1.5 },
      y: { min: 0.4, max: 1.5 },
      z: { min: 0.4, max: 1.5 },
    })
    .on('change', changed);

  // The two arguments `applyPose` in `index.ts` passes to `quaternion.setFromAxisAngle`.
  const quaternion = pane.addFolder({ title: 'quaternion' });

  quaternion
    .addBinding(pose, 'axis', {
      x: { min: -1, max: 1 },
      y: { min: -1, max: 1 },
      z: { min: -1, max: 1 },
    })
    .on('change', () => turnWith('quaternion'));
  quaternion
    .addBinding(pose, 'axisAngle', {
      label: 'angle (radians)',
      min: -Math.PI,
      max: Math.PI,
      format: twoDecimals,
    })
    .on('change', () => turnWith('quaternion'));

  const door = pane.addFolder({ title: 'door' });

  door
    .addBinding(pose, 'doorOrigin', {
      label: 'origin.x',
      min: -0.5,
      max: 0.5,
      format: twoDecimals,
    })
    .on('change', changed);
  door
    .addBinding(pose, 'doorAngle', {
      label: 'angle.y',
      min: 0,
      max: 100,
      format: whole,
    })
    .on('change', changed);
  pane.addButton({ title: 'Reset' }).on('click', () => {
    copyPose(start, pose);
    refresh(pane);
    apply();
  });

  return letter;
}

/** Copies a pose's values in place, so the pane's rows keep the objects they bind */
function copyPose(from, to) {
  Object.assign(to.position, from.position);
  Object.assign(to.angle, from.angle);
  Object.assign(to.axis, from.axis);
  Object.assign(to.scale, from.scale);
  to.axisAngle = from.axisAngle;
  to.turnBy = from.turnBy;
  to.doorOrigin = from.doorOrigin;
  to.doorAngle = from.doorAngle;
}

function whole(value) {
  return value.toFixed(0);
}

/** A pane row's number at two decimals */
export function twoDecimals(value) {
  return value.toFixed(2);
}
