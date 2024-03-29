import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAssetModalComponent } from './delete-asset-modal.component';

describe('DeleteAssetModalComponent', () => {
  let component: DeleteAssetModalComponent;
  let fixture: ComponentFixture<DeleteAssetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAssetModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAssetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
