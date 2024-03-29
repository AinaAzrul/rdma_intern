import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DatatableComponent,
  ColumnMode,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { RestService } from '../../services/rest.service';
import { AuthService } from '../../services/auth.service';
import { ModifyMasterModalComponent } from '../modify-master-modal/modify-master-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {MatTableDataSource} from '@angular/material';
// import {  } from '../../material/material.module';
import { FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-master-table',
  templateUrl: './master-table.component.html',
  styleUrls: ['./master-table.component.scss'],
})
export class MasterTableComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  temp = [];
  filterkey = '';
  loadingIndicator = true;
  errorMessage = '';
  selected = [];
  selectedRow: any;
  disabledEditButton = false;
  modifyMasterRef: any;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  readonly formControl: AbstractControl;

  constructor(
    formBuilder: FormBuilder,
    private restService: RestService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.formControl = formBuilder.group({
      entry_id: '',
      asset_no: '',
      asset_desc: '',
      taken_by: '',
      date_taken: '',
      return_by: '',
      date_return: '',
      remarks: '',
      category: '',
    });
  }

  ngOnInit() {
    this.getMaster();
  }

  getMaster() {
    this.loadingIndicator = true;
    // Get Assets
    this.restService
      .getPosts('read_master', this.authService.getToken())
      .subscribe({
        next: (data) => {
          console.log(data);
          if (data['status'] == 200) {
            this.rows = data['data'].records;
            this.temp = [...this.rows];
            this.loadingIndicator = false;
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }

  onActivate(event) {
    if (event.type === 'click') {
      this.selectedRow = event.row;
      this.disabledEditButton = true;
    }

    event.type === 'click' && event.cellElement.blur();
    console.log('Activate Event', event);
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  }

  updateRow() {
    console.log('edit');
    this.modifyMasterRef = this.modalService.open(ModifyMasterModalComponent);
    this.modifyMasterRef.componentInstance.row = this.selectedRow;
    this.modifyMasterRef.componentInstance.valueChange.subscribe((event) => {
      console.log(event);
      this.getMaster();
    });
  }

  //filter individual column function
  searchMaster(event) {
    // console.log(event.target.value);
    // console.log(this.formControl.value);
    // console.log(this.temp);

    const val = event.target.value.toLowerCase();
    const keys = Object.keys(this.temp[0]);
    const colsAmt = keys.length;
    let form2 = Object.values(this.formControl.value);

    //loop through the input form
    for (let i = 0; i < colsAmt; i++) {
      //check for index where value exist
      if (form2[i]) {
        //call function filter based on the specified column index
        this.searchThrough(colsAmt, keys[i], val);
        break;
      }
    }
  }

  searchThrough(colsAmt, colIdx, val) {
    // filter our data
    // const temp = this.temp.filter(temp=>temp.firstname.toLowerCase().indexOf(val) !== -1 || !val);
    const temp = this.temp.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (item[colIdx].toString().toLowerCase().indexOf(val) !== -1 || !val) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
