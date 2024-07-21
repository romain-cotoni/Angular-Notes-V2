import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { EditorMenuComponent } from '../../../editor/components/editor-menu/editor-menu.component';
import { MenuViewComponent } from '../../../editor/components/menu-view/menu-view.component';
import { MenuCmdComponent } from '../../../editor/components/menu-cmd/menu-cmd.component';
import { MenuSearchComponent } from '../../../editor/components/menu-search/menu-search.component';
import { MenuProfilComponent } from '../../../editor/components/menu-profil/menu-profil.component';
import { MenuExtraComponent } from '../../../editor/components/menu-extra/menu-extra.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf,
    MatSlideToggleModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    EditorMenuComponent,
    MenuViewComponent,
    MenuCmdComponent,
    MenuSearchComponent,
    MenuProfilComponent, 
    MenuExtraComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isEditor!: boolean;
  @Input() isToolTips: boolean = false;
  @Input() isDevMode: boolean = false;
  //@Output() isDevModeEmit: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  // onToggleChange(event: any): void {
  //   this.isDevModeEmit.emit(event.checked);
  // }
  
  onAvatar() {

  }

}
