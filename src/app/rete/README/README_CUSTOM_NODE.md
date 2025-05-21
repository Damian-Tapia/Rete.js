# Personalización de Nodo en Rete.js (Angular)

Este documento explica cómo se personalizó el nodo en el editor visual de Rete.js para que incluya:

- Un área de texto (`textarea`) editable y redimensionable mediante drag del mouse.
- Un fondo con gradiente moderno.

## Cambios realizados

### 1. Componente CustomNodeComponent

Se modificó el componente `CustomNodeComponent` para:

- Incluir un `<textarea>` editable y redimensionable, enlazado a una propiedad `text` del componente.
- Usar `ngModel` para el binding bidireccional del texto.
- Emitir cambios al modelo de Rete cuando el usuario edita el contenido.

**Archivo:** `src/app/customization/custom-node/custom-node.component.html`

```html
<div class="title" data-testid="title">{{data.label}}</div>
<textarea
  class="custom-textarea"
  [(ngModel)]="text"
  (ngModelChange)="emit({ type: 'change', node: data, value: $event })"
  rows="3"
  spellcheck="false"
></textarea>
<!-- ...resto del template... -->
```

### 2. Estilos del Nodo

Se agregaron estilos para:

- Un fondo gradiente usando `linear-gradient`.
- El textarea con bordes redondeados, fondo semitransparente y opción de resize.

**Archivo:** `src/app/customization/custom-node/custom-node.component.sass`

```sass
:host
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)
  // ...otros estilos...
  .custom-textarea
    width: 90%
    min-height: 60px
    resize: both
    border-radius: 6px
    border: 1px solid #888
    background: rgba(255,255,255,0.8)
    // ...otros estilos...
```

### 3. Lógica del Componente

- Se agregó la propiedad `text` en el componente TypeScript.
- Se sincroniza el valor inicial desde el nodo si existe.
- Se importa `FormsModule` en el decorador `@Component` para habilitar `ngModel`.

**Archivo:** `src/app/customization/custom-node/custom-node.component.ts`

```typescript
import { FormsModule } from '@angular/forms';
// ...
@Component({
  imports: [CommonModule, RefDirective, FormsModule],
  // ...
})
export class CustomNodeComponent implements OnChanges {
  text: string = '';
  // ...
  ngOnChanges(): void {
    // ...
    if (this.data && (this.data as any).text !== undefined) {
      this.text = (this.data as any).text;
    }
  }
}
```

### 4. Registro del Nodo Personalizado en Rete

En el archivo de configuración del editor (`default.ts`), se registró el nodo custom en el preset de Angular:

```typescript
angularRender.addPreset(
  AngularPresets.classic.setup({
    customize: {
      node() {
        return CustomNodeComponent;
      },
      // ...
    }
  })
);
```

## Resultado

- El nodo ahora muestra un área de texto editable y redimensionable.
- El fondo del nodo es un gradiente moderno.
- Los cambios en el texto se reflejan en el modelo de Rete y pueden ser usados en la lógica del editor.

---

**Nota:** Si usas componentes standalone en Angular, asegúrate de importar `FormsModule` directamente en el decorador `@Component` y no en el `AppModule`.
