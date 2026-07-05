import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Role } from '@core/models';

/**
 * Structural directive for fine-grained, in-template RBAC.
 * Usage: <button *appHasRole="'admin'">Delete</button>
 * Reactively shows/hides as the auth signal changes (e.g. after logout).
 */
@Directive({ selector: '[appHasRole]', standalone: true })
export class HasRoleDirective {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly auth = inject(AuthService);

  private required: Role = 'member';
  private rendered = false;

  @Input() set appHasRole(role: Role) {
    this.required = role;
  }

  constructor() {
    // Re-evaluate whenever the auth signal updates.
    effect(() => {
      const allowed = this.auth.hasRole(this.required);
      if (allowed && !this.rendered) {
        this.vcr.createEmbeddedView(this.tpl);
        this.rendered = true;
      } else if (!allowed && this.rendered) {
        this.vcr.clear();
        this.rendered = false;
      }
    });
  }
}
