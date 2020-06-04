export const drag = ({object, startPoint, mouse}) => {
  return {
    ...object,
    x: mouse.x - (startPoint.clientX - startPoint.objectX),
    y: mouse.y - (startPoint.clientY - startPoint.objectY),
  };
};

export const rotate = ({object, startPoint, mouse}) => {
  let angle = Math.atan2(
    startPoint.objectX + (object.width || 0) / 2 - mouse.x,
    startPoint.objectY + (object.height || 0) / 2 - mouse.y,
  );

  let asDegree = (angle * 180) / Math.PI;
  let rotation = (asDegree + 45) * -1;

  return {
    ...object,
    rotate: rotation,
  };
};

export const scale = ({object, startPoint, mouse}) => {
  let {objectX, objectY, clientX, clientY} = startPoint;
  let width = startPoint.width + mouse.x - clientX;
  let height = startPoint.height + mouse.y - clientY;

  return {
    ...object,
    x: width > 0 ? objectX : objectX + width,
    y: height > 0 ? objectY : objectY + height,
    width: Math.abs(width),
    height: Math.abs(height),
  };
};
