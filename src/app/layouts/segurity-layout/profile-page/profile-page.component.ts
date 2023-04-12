import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { projectListModel, documentModel } from '../../../interfaces/profile.interfaces';

import { NgbdProfileSortableHeader } from './profile-sortable.directive';

// import Swiper core and required modules
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from "swiper/angular";

// Swiper Slider
// import { SwiperComponent, SwiperDirective } from 'swiper';
import { AppState } from 'src/app/app.state';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  projectList!: projectListModel[];
  document!: documentModel[];
  userData = {
    first_name: '',
    last_name: '',
    role: '',
    email: ''
  };

  /**
   * Swiper setting
   */
  config: SwiperOptions = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 25,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      }
    }
  };

  // @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  // @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  // Table data
  ListJsList: projectListModel[] = [
    {
      title: 'Lorem ipsum',
      updatedTime: new Date(),
      badgeText: 'Hello Wordl',
      member: [
        {
          name: 'Lorem ipsum',
          img: '',
          text: 'Lorem ipsum',
          variant: ''
        }
      ]
    }
  ];
  total = 1;

  @ViewChildren(NgbdProfileSortableHeader) headers!: QueryList<NgbdProfileSortableHeader>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private _store: Store<AppState>
    // public service: ProfileService
  ) {

    // this.ListJsList = service.countries$;
    // this.total = service.total$;
  }

  ngOnInit(): void {
    this.loadUserData();
    this.fetchData();
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.document = document as any;
  }


  nextSlideComp() {
    this.swiper?.swiperRef.slideNext(100);
  }
  previousSlideComp() {
    this.swiper?.swiperRef.slidePrev(100);
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    // document.getElementById('')
  }

  loadUserData() {
    this._store.pipe(select(state => state.auth.user)).subscribe(resp => {
      this.userData = {
        first_name: resp?.nombre ?? '',
        last_name: resp?.apellido ?? '',
        role: 'Admin',
        email: resp?.contenido ?? ''
      }
    });
  }

}
