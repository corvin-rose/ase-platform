import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shader-list-item',
  templateUrl: './shader-list-item.component.html',
  styleUrls: ['./shader-list-item.component.css']
})
export class ShaderListItemComponent {

  @Input() title: string;
  @Input() user: string;
  @Input() id: string;

  like: boolean = false;
  likeCount: number = 0;

  constructor() {
    this.title = 'Shader';
    this.user = 'User';
    this.id = '';
  }

}
