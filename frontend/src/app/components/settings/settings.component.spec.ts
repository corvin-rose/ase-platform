import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../modules/material/material.module';
import { User } from '../../rest/model/user';
import { Auth, AuthService } from '../../rest/service/auth.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<SettingsComponent>;

  const testUser: User = {
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(async () => {
    let mockAuthService: jasmine.SpyObj<AuthService> = jasmine.createSpyObj('AuthService', [
      'getUserAfterAuth',
    ]);
    mockAuthService.getUserAfterAuth.and.returnValue(Promise.resolve(testUser));

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    // Auth.user = testUser;

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current data', () => {
    // TODO: fix
    pending();

    const firstNameInput: HTMLInputElement | null = compiled.querySelector('#firstName');
    const lastNameInput: HTMLInputElement | null = compiled.querySelector('#lastName');

    expect(firstNameInput?.value).toBe(testUser.firstName);
    expect(lastNameInput?.value).toBe(testUser.lastName);
  });

  it('should enable save button on changes else disable', () => {
    const firstNameInput: HTMLInputElement | null = compiled.querySelector('#firstName');
    const lastNameInput: HTMLInputElement | null = compiled.querySelector('#lastName');

    expect(
      compiled.querySelector('#save-btn')?.attributes.getNamedItem('ng-reflect-disabled')?.value
    ).toBeTruthy();

    if (firstNameInput) firstNameInput.value = 'Test2';
    if (lastNameInput) lastNameInput.value = 'User2';

    expect(
      compiled.querySelector('#save-btn')?.attributes.getNamedItem('ng-reflect-disabled')?.value
    ).toBeTruthy();
  });
});
