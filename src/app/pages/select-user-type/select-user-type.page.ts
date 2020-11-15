import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserThemeColorPrimary } from 'src/app/models/ui';

@Component({
  selector: 'app-select-user-type',
  templateUrl: './select-user-type.page.html',
  styleUrls: ['./select-user-type.page.scss'],
})
export class SelectUserTypePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToAboutUs() {
    this.router.navigateByUrl('/about-us');
  }

  goToQuarantinedReg() {
    this.router.navigate(['/user-reg'], {
      queryParams: { userType: 'AF' },
    });
  }

  goToVolunteerReg() {
    this.router.navigate(['/user-reg'], {
      queryParams: { userType: 'HL' },
    });
  }
}
