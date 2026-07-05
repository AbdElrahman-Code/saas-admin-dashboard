import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Root shell — only hosts the router outlet; layout lives in ShellComponent. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
