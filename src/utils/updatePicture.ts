import { Node } from 'konva/lib/Node';

export default function updatePicture(node: Node): void {
  const drawingNode = node.getLayer() || node.getStage();
  if (drawingNode) {
    drawingNode.batchDraw();
  }
}
