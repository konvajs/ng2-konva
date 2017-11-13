// adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js

export default function updatePicture(node) {
  const drawingNode = node.getLayer() || node.getStage();
  if (drawingNode) {
    drawingNode.batchDraw();
  }
}
