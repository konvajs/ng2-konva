// adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js

import Konva from 'konva';
import Node = Konva.Node;

export default function updatePicture(node: Node) {
  const drawingNode = node.getLayer() || node.getStage();
  if (drawingNode) {
    drawingNode.batchDraw();
  }
}
