import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-grid-list-view',
  templateUrl: './grid-list-view.component.html',
  styleUrls: ['./grid-list-view.component.scss']
})
export class GridListViewComponent {
  @ViewChild('gridViewButton') gridViewButton: ElementRef;
  @ViewChild('listViewButton') listViewButton: ElementRef;
  @Output() onChange = new EventEmitter();
  @Input() selectedView: any = 'grid';
  setSelectedView(accessKey: string) {
    switch (accessKey) {
      case 'g':
        {
          this.selectedView = 'grid';
        }
        break;
      case 'l':
        {
          this.selectedView = 'list';
        }
        break;
    }
    this.onChange.emit({ selectedView: this.selectedView });
  }

  handleClick($event) {
    const el = $event.target;
    this.setSelectedView(el.attributes.accessKey.value);
  }
}
