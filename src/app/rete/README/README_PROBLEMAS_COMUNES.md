# Problemas Comunes al Configurar Rete.js en Angular

Este documento recopila los problemas más frecuentes al integrar y personalizar Rete.js en un proyecto Angular, junto con sus soluciones y recomendaciones.

---

## 1. Error de Render de React

**Síntoma:**

- El editor muestra conexiones o nodos con el render clásico de React, aunque se haya personalizado el render de Angular.

**Causa:**

- El preset de React (`ReactPresets.classic.setup()`) está activo o el área está usando el render de React además del de Angular.

**Solución:**

- Asegúrate de que solo el render de Angular esté activo para los presets que quieres personalizar. Si usas ambos renders, el de React puede sobrescribir el de Angular.
- Elimina o comenta las líneas que agregan presets de React si solo quieres Angular:

  ```typescript
  // area.use(reactRender);
  // reactRender.addPreset(ReactPresets.classic.setup());
  ```

- Personaliza el preset de Angular con la opción `customize` para nodos, conexiones y sockets.

---

## 2. Problemas con Standalone Components y NgModule

**Síntoma:**

- Errores como: `Component X is standalone, and cannot be declared in an NgModule.`

**Causa:**

- Los componentes personalizados de Rete (nodo, conexión, socket) están definidos como standalone y se intentan declarar en un NgModule.

**Solución:**

- No declares componentes standalone en el array `declarations` de tu NgModule. Solo impórtalos en el decorador `@Component` donde se usen.
- Ejemplo:

  ```typescript
  @Component({
    imports: [CommonModule, RefDirective, FormsModule],
    // ...
  })
  export class CustomNodeComponent {}
  ```

---

## 3. Error de ngModel: "Can't bind to 'ngModel' since it isn't a known property of 'textarea'"

**Causa:**

- No se importó `FormsModule` en el decorador del componente standalone.

**Solución:**

- Agrega `FormsModule` en el array `imports` del decorador `@Component` de tu componente custom.

---

## 4. Sockets Personalizados No Se Ven

**Síntoma:**

- Los sockets siguen viéndose como los clásicos, no como el componente custom.

**Causa:**

- No se registró el componente custom en el preset de Angular.

**Solución:**

- Asegúrate de registrar el socket custom en el preset:

  ```typescript
  angularRender.addPreset(
    AngularPresets.classic.setup({
      customize: {
        socket() {
          return CustomSocketComponent;
        }
      }
    })
  );
  ```

---

## 5. Problemas de Tipos en las Conexiones

**Síntoma:**

- TypeScript arroja errores de tipos al crear conexiones entre nodos.

**Causa:**

- La definición de tipos `Conn` y `Connection` no es compatible con la estructura de nodos.

**Solución:**

- Revisa la definición de tipos y asegúrate de que los tipos de nodos y conexiones sean compatibles.
- Si es necesario, usa tipos más generales o ajusta las firmas de los métodos `data()` en tus nodos.

---

## 6. Cambios de Estilos No Se Reflejan

**Síntoma:**

- Modificas el SASS/CSS pero no ves cambios en la interfaz.

**Causa:**

- El navegador puede estar usando caché, o el selector CSS no es lo suficientemente específico.

**Solución:**

- Fuerza un recargo completo (Ctrl+Shift+R).
- Usa `:host::ng-deep` para asegurar que los estilos se apliquen a los elementos internos de Rete.

---

## 7. El Área de Trabajo No Permite Mover Nodos

**Causa:**

- El plugin de auto-arrange está activo y sobreescribe la posición de los nodos.

**Solución:**

- Comenta o elimina la línea `await arrange.layout();` para permitir el movimiento manual de nodos.

**Actualizado:** Mayo 2025
