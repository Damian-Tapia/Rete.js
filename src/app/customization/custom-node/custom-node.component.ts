import {
  Component,
  Input,
  HostBinding,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { ClassicPreset } from 'rete';
import { CommonModule } from '@angular/common';
import { RefDirective } from 'rete-angular-plugin/19';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, RefDirective, FormsModule],
  templateUrl: './custom-node.component.html',
  styleUrls: ['./custom-node.component.sass'],
  host: {
    'data-testid': 'node',
  },
})
export class CustomNodeComponent implements OnChanges {
  @Input() data!: ClassicPreset.Node;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;

  seed = 0;
  text: string = '';

  @HostBinding('class.selected') get selected() {
    return this.data.selected;
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.rendered());
    this.seed++; // force render sockets
    // Si el nodo tiene un valor inicial, lo carga
    if (this.data && (this.data as any).text !== undefined) {
      this.text = (this.data as any).text;
    }
  }

  sortByIndex(a: any, b: any) {
    const ai = a.value.index || 0;
    const bi = b.value.index || 0;

    return ai - bi;
  }
}
