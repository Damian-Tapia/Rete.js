# Personalización de Componentes en Rete.js (Angular)

Rete.js permite personalizar la visualización de los distintos elementos del editor (nodos, conexiones, sockets, etc.) mediante componentes propios. En un proyecto Angular, esto se logra principalmente usando el sistema de presets y la opción `customize`.

## 1. Crear el Componente Personalizado

Por ejemplo, para personalizar la conexión entre nodos:

```typescript
// custom-connection.component.ts
import { Component, Input } from "@angular/core";
import { ClassicPreset } from "rete";

@Component({
  selector: "connection",
  template: `
    <svg data-testid="connection">
      <path [attr.d]="path" class="animated-connection" />
    </svg>
  `,
  styleUrls: ["./custom-connection.component.sass"]
})
export class CustomConnectionComponent {
  @Input() data!: ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>;
  @Input() start: any;
  @Input() end: any;
  @Input() path!: string;
}
```

Y su estilo animado:

```sass
// custom-connection.component.sass
.animated-connection
  fill: none
  stroke-width: 5px
  stroke: #00bfff
  stroke-dasharray: 10, 10
  stroke-linecap: round
  pointer-events: auto
  animation: dashmove 1s linear infinite

@keyframes dashmove
  to
    stroke-dashoffset: -20
```

## 2. Registrar el Componente en el Preset

En el archivo donde configuras el editor (por ejemplo, `default.ts`):

```typescript
import { CustomConnectionComponent } from '../customization/custom-connection/custom-connection.component';
// ...
angularRender.addPreset(
  AngularPresets.classic.setup({
    customize: {
      connection() {
        return CustomConnectionComponent;
      }
    }
  })
);
```

Esto le indica a Rete que use tu componente para renderizar las conexiones.

## 3. Personalización de Otros Elementos

Puedes personalizar también nodos y sockets:

```typescript
angularRender.addPreset(
  AngularPresets.classic.setup({
    customize: {
      node() {
        return CustomNodeComponent;
      },
      connection() {
        return CustomConnectionComponent;
      },
      socket() {
        return CustomSocketComponent;
      }
    }
  })
);
```

## 4. Consideraciones

- Si usas varios presets, asegúrate de que el preset personalizado se registre después de los presets por defecto para que tenga prioridad.
- El componente personalizado debe estar declarado en el módulo de Angular correspondiente.
- Puedes usar lógica en el método `connection()` para devolver diferentes componentes según el tipo de conexión.

## 5. Referencias

- [Documentación oficial de Rete.js](https://retejs.org/)
- [Ejemplo de personalización en Angular](https://retejs.org/examples/basic/angular#angular)

---

Con este enfoque puedes personalizar completamente la apariencia y comportamiento visual de tu editor Rete.js en Angular.
