import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinneroverlay',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinneroverlay.component.html',
  styleUrl: './spinneroverlay.component.css'
})
export class SpinneroverlayComponent {

}
