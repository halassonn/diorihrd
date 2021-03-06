import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DatakantorModel} from '../../../../model/datakantor.model';
import {LoaderService} from '../../../../core/_http/loader/loader.service';
import {DatakantorService} from './serivces/datakantor.service';
import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, MatSort, MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarConfig} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-datakantor',
  templateUrl: './datakantor.component.html',
  styleUrls: ['./datakantor.component.scss']
})


export class DatakantorComponent implements OnInit {
  pageclass: any = 'page-container-full';
  displayedColumns: any;
  datakantorDB: any;
  dataSource: any;
  datasort: DataKantorSourceSort | null;
  formdatakantor: FormGroup;
  datakantor: DatakantorModel = new DatakantorModel;
  showmodal: boolean = false;
  updateData: boolean = false;

  matSnackBarVerticalPosition: MatSnackBarVerticalPosition = 'top';
  snackBarSuccesConf: MatSnackBarConfig = {
    duration: 3000,
    extraClasses: ['success-snackbar'],
    verticalPosition: this.matSnackBarVerticalPosition
  };
  snackBarErrorConf: MatSnackBarConfig = {
    duration: 3000,
    extraClasses: ['error-snackbar'],
    verticalPosition: this.matSnackBarVerticalPosition
  };


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private loaderService: LoaderService,
              private datakantorService: DatakantorService,
            private fb: FormBuilder,
          private snackbar: MatSnackBar) {
    this.displayedColumns = ['kodekantor', 'namakantor', 'alamat', 'kodepos', 'actions'];
  }

  ngOnInit() {
    this.datakantorService.getEmittedValue().subscribe(
      (data) => {
        this.pageclass = data;
        console.log(data);
      }
    );
    this.getAllDataKantor(null, null);
    this.buildForm(null);
  }

  buildForm(data: DatakantorModel) {
    if ( data == null) {
      this.formdatakantor = this.fb.group({
        'id': [''],
        'kodekantor': ['', Validators.required],
        'namakantor': ['', Validators.required],
        'alamat': ['', Validators.required],
        'kodepos': ['', Validators.required]
      });
    }else {
      this.formdatakantor = this.fb.group({
        'id': [data.id],
        'kodekantor': [data.kodekantor, Validators.required],
        'namakantor': [data.namakantor, Validators.required],
        'alamat': [data.alamat, Validators.required],
        'kodepos': [data.kodepos, Validators.required]
      });
    }


  }

  addDatakantor(event) {
    this.datakantor = event;
    if (!this.updateData) {
      if (this.datakantor != null) {
        this.datakantorService.getDataKantorBy(this.datakantor.kodekantor).subscribe (
          (res) => {

            this.snackbar.open('Kode Kantor ' + this.datakantor.kodekantor + ' Sudah Ada', '', this.snackBarErrorConf);
          },
          (err) => {

            this.datakantorService.addDataKantor(this.datakantor).subscribe(
              (res2) => {
                this.snackbar.open('Data Sudah Di Simpan', '', this.snackBarSuccesConf);
                this.getAllDataKantor(null, null);
              },
              (err2) => {this.snackbar.open(err2, '', this.snackBarErrorConf); }
            );
          }
        );
      }
    }else {
      console.log(this.datakantor);
      this.datakantorService.updateDataKantor(this.datakantor).subscribe(
        (res3) => {
          this.snackbar.open('Data Sudah Di Update', '', this.snackBarSuccesConf);
          this.getAllDataKantor(null, null);

        },
        (err3) => {this.snackbar.open(err3, '', this.snackBarErrorConf); }
      );
      this.updateData = !this.updateData;
    }

    this.buildForm(null);
  }
  showDetail(datakantor: DatakantorModel) {
    this.updateData = !this.updateData;
    this.openside();
    this.buildForm(datakantor);
  }
  batal() {
    this.buildForm(null);
    if(this.updateData === true){
      this.updateData = !this.updateData;
      console.log(this.updateData);
    }
  }

  hapusDataKantor(datakantor: DatakantorModel) {
    this.showmodal = !this.showmodal;
    this.datakantor = datakantor;
  }
  doDelete() {
    this.datakantorService.deleteDataKantor(this.datakantor.id).subscribe(
      (res) => {
        this.snackbar.open('Data Kantor '+this.datakantor.kodekantor+' Sudah Dihapus', '' , this.snackBarSuccesConf);
        this.getAllDataKantor(null,null);

      },
      (err) => {
        this.snackbar.open(err, '' , this.snackBarErrorConf);
      }
    );
    this.showmodal = !this.showmodal;
  }

  getAllDataKantor(by: any, param: any) {
    this.loaderService.status('Fetch Data Kantor...');
    this.datakantorDB = new DataKantorDatabase(this.datakantorService, this.loaderService, by, param);

    // pagination
    this.datasort = new DataKantorSourceSort(this.datakantorDB, this.sort, this.paginator);
    this.dataSource = this.datasort;

  }
  openside() {
    this.datakantorService.sideOpen();
  
  }
  closeside() {
    this.datakantorService.sideclose();
    this.buildForm(null);
    if(this.updateData === true){
      this.updateData = !this.updateData;
      console.log(this.updateData);
    }

  }


}


// database
export class DataKantorDatabase {

  dataChange: BehaviorSubject<DatakantorModel[]> = new BehaviorSubject<DatakantorModel[]>([]);

  constructor(private datakantor: DatakantorService, private loaderService: LoaderService, by: any, param: any) {
    // Fill up the database.
    if (param !== null) {
      this.loaderService.status('Get All Data By ' + param + ' ......');
      this.datakantor.getAllDataKantorBy(by, param).subscribe((data) => this.dataChange.next(data));
    } else {
      this.loaderService.status('Get All Data ...');
      this.datakantor.getAllDataKantor().subscribe((data) => this.dataChange.next(data))
    }

  }

  get data(): DatakantorModel[] {
    return this.dataChange.value;
  }
}

// datasource

export class DataKantorSourceSort extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  constructor(private _datakantorDatabase: DataKantorDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  connect(): Observable<DatakantorModel[]> {
    const displayDataChanges = [
      this._datakantorDatabase.dataChange,
      this._paginator.page,
      this._sort.sortChange,
      this._filterChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._datakantorDatabase.data.slice();

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize)
        .sort((a, b) => {
          const propertyA: number | string = '';
          const propertyB: number | string = '';

          /*switch (this._sort.active) {
            case 'kodekantor':
              [propertyA, propertyB] = [a.kodekantor, b.kodekantor];
              break;
            case 'namakantor':
              [propertyA, propertyB] = [a.namakantor, b.namakantor];
              break;
            case 'alamat':
              [propertyA, propertyB] = [a.alamat, b.alamat];
              break;
            case 'kodepos':
              [propertyA, propertyB] = [a.kodepos, b.kodepos];
              break;

          } */

          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);


        })
        .filter((item: DatakantorModel) => {
          const searchStr = (item.kodekantor + item.namakantor).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
    });


  }

  disconnect() {
  }

}



