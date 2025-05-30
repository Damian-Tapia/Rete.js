import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import { Injector } from '@angular/core';
import {
  ReactPlugin,
  ReactArea2D,
  Presets as ReactPresets,
} from 'rete-react-plugin';
import { createRoot } from 'react-dom/client';

import {
  AngularPlugin,
  AngularArea2D,
  Presets as AngularPresets,
} from 'rete-angular-plugin/19';

class Node extends Classic.Node {
  constructor() {
    super('Perf');

    this.addInput('port', new Classic.Input(socket, 'Input'));
    this.addOutput('port', new Classic.Output(socket, 'Output'));
  }
}

class Connection<A extends Node, B extends Node> extends Classic.Connection<
  A,
  B
> {}

type Schemes = GetSchemes<Node, Connection<Node, Node>>;

type AreaExtra = ReactArea2D<Schemes> | AngularArea2D<Schemes>;

const socket = new Classic.Socket('socket');

export async function createEditor(container: HTMLElement, injector: Injector) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

  const angularRender = new AngularPlugin<Schemes, AreaExtra>({ injector });

  editor.use(area);

  area.use(reactRender);

  area.use(angularRender);

  reactRender.addPreset(ReactPresets.classic.setup());

  angularRender.addPreset(AngularPresets.classic.setup());

  // eslint-disable-next-line no-restricted-globals
  const query = new URLSearchParams(location.search);
  const rows = Number(query.get('rows') || 0) || 12;
  const cols = Number(query.get('cols') || 0) || 12;

  let prev: null | Node = null;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const a = new Node();

      await editor.addNode(a);
      await area.translate(a.id, { x: col * 310, y: row * 190 });

      if (prev) {
        await editor.addConnection(new Connection(prev, 'port', a, 'port'));
      }
      prev = a;
    }
  }

  setTimeout(() => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 300);

  AreaExtensions.simpleNodesOrder(area);

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  return {
    destroy: () => area.destroy(),
  };
}
